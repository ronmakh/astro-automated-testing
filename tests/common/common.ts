import { Page } from "@playwright/test";

// Close ad if present on page
export const closeAdIfPresent = async (page: Page) => {
  try {
    // Wait up to 5 seconds for ad to appear
    const adCloseButton = page.locator('button:has-text("Tutup Iklan")');
    await adCloseButton.waitFor({ state: 'visible', timeout: 5000 });
    await adCloseButton.click();
  } catch (err) {
    // It's okay if the ad doesn't show
    console.log('No ad to close or failed to close ad');
  }
};