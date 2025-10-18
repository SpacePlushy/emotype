import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Get the html element to check for dark class
    const html = page.locator('html');

    // Check initial state (should match system preference or be light by default)
    const initialHasDark = await html.evaluate((el) => el.classList.contains('dark'));
    console.log('Initial dark mode state:', initialHasDark);

    // Open settings
    await page.click('button[aria-label="Settings"]');

    // Wait for settings panel to be visible
    await page.waitForSelector('text=Dark mode', { state: 'visible' });

    // Find the dark mode checkbox
    const darkModeCheckbox = page.locator('input[type="checkbox"]').filter({
      has: page.locator('xpath=preceding-sibling::span[contains(text(), "Dark mode")]')
    }).first();

    // Get the current checkbox state
    const isChecked = await darkModeCheckbox.isChecked();
    console.log('Dark mode checkbox checked:', isChecked);

    // Toggle the checkbox
    await darkModeCheckbox.click();

    // Wait a bit for the change to apply
    await page.waitForTimeout(300);

    // Check that the html class has changed
    const afterToggleHasDark = await html.evaluate((el) => el.classList.contains('dark'));
    console.log('After toggle dark mode state:', afterToggleHasDark);

    // Verify the toggle worked (should be opposite of initial state if we started in light mode)
    expect(afterToggleHasDark).toBe(!initialHasDark);

    // Toggle back
    await darkModeCheckbox.click();
    await page.waitForTimeout(300);

    // Check that it returned to original state
    const afterSecondToggleHasDark = await html.evaluate((el) => el.classList.contains('dark'));
    console.log('After second toggle dark mode state:', afterSecondToggleHasDark);
    expect(afterSecondToggleHasDark).toBe(initialHasDark);

    // Verify localStorage is being set
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    console.log('Theme in localStorage:', theme);
    expect(theme).toBeTruthy();
  });

  test('should have different visual appearance in light vs dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForSelector('text=Dark mode', { state: 'visible' });

    // Find the dark mode checkbox
    const darkModeCheckbox = page.locator('input[type="checkbox"]').filter({
      has: page.locator('xpath=preceding-sibling::span[contains(text(), "Dark mode")]')
    }).first();

    // Ensure we're in light mode
    const html = page.locator('html');
    const hasDark = await html.evaluate((el) => el.classList.contains('dark'));

    if (hasDark) {
      await darkModeCheckbox.click();
      await page.waitForTimeout(300);
    }

    // Get background color in light mode
    const lightBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body.parentElement!).backgroundColor;
    });

    // Switch to dark mode
    await darkModeCheckbox.click();
    await page.waitForTimeout(300);

    // Get background color in dark mode
    const darkBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body.parentElement!).backgroundColor;
    });

    console.log('Light mode background:', lightBgColor);
    console.log('Dark mode background:', darkBgColor);

    // The colors should be different
    expect(lightBgColor).not.toBe(darkBgColor);
  });

  test('should persist theme preference on page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForSelector('text=Dark mode', { state: 'visible' });

    // Find and click the dark mode checkbox
    const darkModeCheckbox = page.locator('input[type="checkbox"]').filter({
      has: page.locator('xpath=preceding-sibling::span[contains(text(), "Dark mode")]')
    }).first();

    // Enable dark mode
    await darkModeCheckbox.click();
    await page.waitForTimeout(300);

    // Verify dark mode is active
    const html = page.locator('html');
    const hasDarkBefore = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkBefore).toBe(true);

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that dark mode is still active
    const hasDarkAfter = await html.evaluate((el) => el.classList.contains('dark'));
    expect(hasDarkAfter).toBe(true);

    console.log('Dark mode persisted after reload');
  });
});
