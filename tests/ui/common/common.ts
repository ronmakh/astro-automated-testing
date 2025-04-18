import { Page } from "@playwright/test";

// Close ad if present on page
export const closeAdIfPresent = async (page: Page) => {
  try {
    // Match either "Tutup Iklan" or "Close Ads"
    const adCloseButton = page.locator('button:has-text("Tutup Iklan"), button:has-text("Close Ads")');
    
    await adCloseButton.first().waitFor({ state: 'visible', timeout: 5000 });
    await adCloseButton.first().click();
  } catch (err) {
    // It's okay if the ad doesn't show
    console.log('No ad to close or failed to close ad');
  }
};
