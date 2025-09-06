# basic run with sensible defaults
k6 run vote-load.js \
  -e BASE_URL="https://api.yourdomain.com" \
  -e CAMPAIGN_ID="cmp_123" \
  -e OPTION_IDS="opt_a,opt_b,opt_c" \
  -e AUTH_BEARER="YOUR_JWT_IF_ANY"

# override traffic shapes
k6 run vote-load.js \
  -e BASE_URL="https://api.yourdomain.com" \
  -e CAMPAIGN_ID="cmp_123" \
  -e OPTION_IDS="opt_a,opt_b,opt_c" \
  -e SPIKE_RPS=1200 \
  -e STEADY_RPS=150 \
  -e SURGE_RPS=450 \
  -e STEADY_DURATION="1h" \
  -e SURGE_BLOCKS="3" \
  -e AUTH_BEARER="YOUR_JWT_IF_ANY"
