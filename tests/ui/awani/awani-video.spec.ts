import { test, expect, Page } from '@playwright/test';
import { closeAdIfPresent } from '../common/common';
import { AWANI_URL } from '../common/locator.constants';

test('Go to Video Live TV', async ({ page }) => {
  // Navigate to the site
  await page.goto(AWANI_URL);

  // Locate and click the VIDEO link
  const videoLink = page.locator('a[aria-label="VIDEO"]');
  await videoLink.waitFor({ state: 'visible' });
  await expect(videoLink).toBeVisible();

  // Try to close ad if visible
  await closeAdIfPresent(page);
  await videoLink.click();

  // Wait for video page to load
  await page.waitForURL(/video/);

  // Navigate to LIVE TV
  const liveTvItem = page.locator('li', { hasText: /^LIVE TV$/ });

  await expect(liveTvItem).toBeVisible();
  await liveTvItem.click();

  const liveTvLatestVideo = page.locator('div.css-9on23b div.css-0').first();
  await closeAdIfPresent(page);
  await liveTvLatestVideo.waitFor({ state: 'visible' });
  await expect(liveTvLatestVideo).toBeVisible();

  const liveVideoLocator = page.locator('iframe.dailymotion-player');
  await liveVideoLocator.waitFor({ state: 'visible' });
  await expect(liveVideoLocator).toBeVisible();

  // Navigate to Buletin
  const bulletinItem = page.locator('li', { hasText: /^Buletin$/ });
  await expect(bulletinItem).toBeVisible();
  await bulletinItem.click();

  const bulletinLatestVideo = page.locator('div.css-9on23b div.css-0').first();
  await expect(bulletinLatestVideo).toBeVisible();

  // Navigate to AWANI 745
  const awani745Item = page.locator('li', { hasText: /^AWANI 745$/ });
  await expect(awani745Item).toBeVisible();
  await awani745Item.click();

  const awani745LatestVideo = page.locator('div.css-9on23b div.css-0').first();
  await expect(awani745LatestVideo).toBeVisible();
});
