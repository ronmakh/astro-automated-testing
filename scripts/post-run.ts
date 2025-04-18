import { notifyTeams } from '../utils/notify-teams';

(async () => {
  await notifyTeams('✅ Playwright Tests Completed. Check the report!');
})();