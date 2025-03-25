import { test, expect } from '@playwright/test';

test('Go to Video Live TV', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://www.astroawani.com');

    // Locate the <a> element with aria-label="VIDEO"
    const videoLink = page.locator('a[aria-label="VIDEO"]');

    await page.waitForSelector('a[aria-label="VIDEO"]', { state: 'visible' });

    // Check if the element is visible
    await expect(videoLink).toBeVisible();

    // Click the element
    await videoLink.click();

    // Wait for navigation to complete
    await page.waitForURL(/video/);

    // Locate the 'LIVE TV' item
    const liveTvItem = page.locator('li', { hasText: /^LIVE TV$/ });
    await expect(liveTvItem).toBeVisible();
    await liveTvItem.click();

    // Wait for the live TV section to load
    const liveTvLatestVideoParent = page.locator('div.css-9on23b');
    const liveTvLatestVideoChildDivs = liveTvLatestVideoParent.locator('div.css-0').first();
    await expect(liveTvLatestVideoChildDivs).toBeVisible();

    // Navigate to Bulletin
    const bulletinItem = page.locator('li', { hasText: /^Buletin$/ });
    await expect(bulletinItem).toBeVisible();
    await bulletinItem.click();

    // Wait for the bulletin section to load
    const bulletinLatestVideoParent = page.locator('div.css-9on23b');
    const bulletinLatestVideoChildDivs = bulletinLatestVideoParent.locator('div.css-0').first();
    await expect(bulletinLatestVideoChildDivs).toBeVisible();

    // Navigate to AWANI 745
    const awani745Item = page.locator('li', { hasText: /^AWANI 745$/ });
    await expect(awani745Item).toBeVisible();
    await awani745Item.click();

    // Wait for the AWANI 745 section to load
    const awani745LatestVideoParent = page.locator('div.css-9on23b');
    const awani745LatestVideoChildDivs = awani745LatestVideoParent.locator('div.css-0').first();
    await expect(awani745LatestVideoChildDivs).toBeVisible();
});
