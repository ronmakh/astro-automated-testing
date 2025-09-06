import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import exec from 'k6/execution';

// ---------- Config via env ----------
const BASE_URL       = __ENV.BASE_URL || 'http://localhost:3000';
const VOTE_PATH      = __ENV.VOTE_PATH || '/api/v1/votes'; // change to your endpoint
const CAMPAIGN_ID    = __ENV.CAMPAIGN_ID || 'cmp_local';
const OPTION_IDS     = (__ENV.OPTION_IDS || 'opt_a,opt_b,opt_c').split(',').map(s => s.trim()).filter(Boolean);

// traffic knobs
const SPIKE_RPS      = Number(__ENV.SPIKE_RPS || 1000);  // launch spike peak
const STEADY_RPS     = Number(__ENV.STEADY_RPS || 100);  // campaign baseline
const SURGE_RPS      = Number(__ENV.SURGE_RPS || 300);   // mini spikes
const SPIKE_WARMUP   = __ENV.SPIKE_WARMUP || '2m';
const SPIKE_HOLD     = __ENV.SPIKE_HOLD || '8m';
const POST_SPIKE_RAMP= __ENV.POST_SPIKE_RAMP || '5m';
const STEADY_DURATION= __ENV.STEADY_DURATION || '2h';
const SURGE_HOLD     = __ENV.SURGE_HOLD || '5m';
const SURGE_COOLDOWN = __ENV.SURGE_COOLDOWN || '10m';
const SURGE_BLOCKS   = Number(__ENV.SURGE_BLOCKS || 2); // how many surge cycles

// executors capacity
const PREALLOC_VUS   = Number(__ENV.PREALLOC_VUS || 300);
const MAX_VUS        = Number(__ENV.MAX_VUS || 5000);

// auth & headers
const AUTH_BEARER    = __ENV.AUTH_BEARER || '';
const EXTRA_HEADERS  = JSON.parse(__ENV.EXTRA_HEADERS || '{}'); // e.g. '{"x-api-key":"abc"}'

// pacing
const THINK_TIME_MIN = Number(__ENV.THINK_TIME_MIN || 0.05); // seconds (jitter to avoid lockstep)
const THINK_TIME_MAX = Number(__ENV.THINK_TIME_MAX || 0.25);

// id/keying
const IDEMPOTENCY_HEADER = __ENV.IDEMPOTENCY_HEADER || 'Idempotency-Key';

// ---------- Custom metrics ----------
export const vote_success = new Counter('vote_success');
export const vote_fail_rate = new Rate('vote_fail_rate');

// ---------- Scenarios ----------
/**
 * We use arrival-rate based executors to model “real” RPS independent of VUs.
 * 1) launch_spike: big blast then ramp down to baseline
 * 2) steady_campaign: sustained baseline traffic (soak)
 * 3) surge_windows: repeating mini-spikes during the campaign
 */
export const options = {
  discardResponseBodies: true,
  thresholds: {
    // global reliability
    'http_req_failed': ['rate<0.02'], // overall <2% errors
    // endpoint-specific latency SLOs by scenario
    'http_req_duration{scenario:steady_campaign,endpoint:post_votes}': ['p(95)<300', 'p(99)<600'],
    'http_req_duration{scenario:launch_spike,endpoint:post_votes}': ['p(95)<500', 'p(99)<1200'],
    'http_req_duration{scenario:surge_windows,endpoint:post_votes}': ['p(95)<400', 'p(99)<900'],
    // custom metric threshold
    'vote_fail_rate': ['rate<0.02'],
  },
  scenarios: {
    launch_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: PREALLOC_VUS,
      maxVUs: MAX_VUS,
      stages: [
        { target: SPIKE_RPS, duration: SPIKE_WARMUP },      // ramp up to spike
        { target: SPIKE_RPS, duration: SPIKE_HOLD },        // hold spike
        { target: STEADY_RPS, duration: POST_SPIKE_RAMP },  // ramp down to baseline
      ],
      exec: 'castVote',
      tags: { phase: 'launch' },
      gracefulStop: '30s',
    },

    steady_campaign: {
      executor: 'constant-arrival-rate',
      rate: STEADY_RPS,
      timeUnit: '1s',
      duration: STEADY_DURATION,
      preAllocatedVUs: PREALLOC_VUS,
      maxVUs: MAX_VUS,
      exec: 'castVote',
      tags: { phase: 'steady' },
      gracefulStop: '30s',
      startTime: addDurations([SPIKE_WARMUP, SPIKE_HOLD, POST_SPIKE_RAMP]), // starts after spike completes
    },

    surge_windows: {
      executor: 'ramping-arrival-rate',
      startRate: STEADY_RPS,
      timeUnit: '1s',
      preAllocatedVUs: PREALLOC_VUS,
      maxVUs: MAX_VUS,
      // build repeating surge blocks after the steady traffic begins
      stages: buildSurgeStages(SURGE_BLOCKS, STEADY_RPS, SURGE_RPS, SURGE_HOLD, SURGE_COOLDOWN),
      exec: 'castVote',
      tags: { phase: 'surge' },
      gracefulStop: '30s',
      startTime: addDurations([
        SPIKE_WARMUP, SPIKE_HOLD, POST_SPIKE_RAMP, STEADY_DURATION
      ]), // surges start after the steady soak completes
    },
  },
};

// ---------- Helpers ----------
function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function sleepJitter() {
  const s = randBetween(THINK_TIME_MIN, THINK_TIME_MAX);
  if (s > 0) sleep(s);
}

// RFC4122-ish, works in recent k6; fallback if not available
function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  // simple fallback
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}-${exec.vu.idInTest}-${exec.scenario.iterationInInstance}`;
}

function pickOption() {
  return OPTION_IDS[Math.floor(Math.random() * OPTION_IDS.length)];
}

function headersWithAuth(idemKey) {
  const base = {
    'Content-Type': 'application/json',
    [IDEMPOTENCY_HEADER]: idemKey,
    ...EXTRA_HEADERS,
  };
  if (AUTH_BEARER) base['Authorization'] = `Bearer ${AUTH_BEARER}`;
  return base;
}

function addDurations(arr) {
  // Accept "Nm" or "Ns" pieces, return sum in seconds as "Xs"
  const toSec = (frag) => {
    const m = String(frag).match(/^(\d+)([smh])$/);
    if (!m) return 0;
    const n = Number(m[1]);
    const unit = m[2];
    if (unit === 's') return n;
    if (unit === 'm') return n * 60;
    if (unit === 'h') return n * 3600;
    return 0;
  };
  const total = arr.reduce((acc, d) => acc + toSec(d), 0);
  return `${total}s`;
}

function buildSurgeStages(blocks, baseRps, surgeRps, hold, cool) {
  // [ up to surge, hold, down to base, cooldown ] × blocks
  const stages = [];
  for (let i = 0; i < blocks; i++) {
    stages.push({ target: surgeRps, duration: '1m' });
    stages.push({ target: surgeRps, duration: hold });
    stages.push({ target: baseRps,  duration: '1m' });
    stages.push({ target: baseRps,  duration: cool });
  }
  return stages;
}

// ---------- Main vote executor ----------
export function castVote() {
  // Generate a unique idempotency key so your API can safely dedupe
  const idKey = uuid();

  const body = JSON.stringify({
    campaignId: CAMPAIGN_ID,
    optionId: pickOption(),
    // optional: include a voter identity or nonce if your backend supports it
    nonce: idKey,
    // e.g. timestamp for server-side ordering if you queue
    clientTs: new Date().toISOString(),
  });

  const url = `${BASE_URL}${VOTE_PATH}`;
  const res = http.post(url, body, {
    tags: { endpoint: 'post_votes' },
    headers: headersWithAuth(idKey),
    redirects: 0,
    timeout: '30s',
  });

  const ok = check(res, {
    'status is 2xx/202': (r) => r.status >= 200 && r.status < 300 || r.status === 202,
  });

  vote_success.add(ok ? 1 : 0);
  vote_fail_rate.add(!ok);

  // Optional: mild think-time jitter to reduce lockstep effects on upstream infra
  sleepJitter();
}
