import { test, expect } from '@playwright/test';

test.use({ baseURL: 'http://localhost:3000' });

test.describe('Dark Mode Diagnostic', () => {
  test('diagnose dark mode styling', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('\n========== INITIAL STATE ==========');

    // Check HTML element
    const html = page.locator('html');
    const hasInitialDark = await html.evaluate((el) => el.classList.contains('dark'));
    console.log('HTML has dark class:', hasInitialDark);

    // Check computed styles of various elements
    const body = page.locator('body');
    const bodyBg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const bodyColor = await body.evaluate((el) => window.getComputedStyle(el).color);
    console.log('Body background:', bodyBg);
    console.log('Body color:', bodyColor);

    // Check main container
    const main = page.locator('main');
    const mainBg = await main.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log('Main container background:', mainBg);

    // Check if dark: classes are working by inspecting a specific element
    const header = page.locator('header');
    const headerBg = await header.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const headerBorder = await header.evaluate((el) => window.getComputedStyle(el).borderBottomColor);
    console.log('Header background:', headerBg);
    console.log('Header border:', headerBorder);

    // Take screenshot before toggle
    await page.screenshot({ path: 'test-results/dark-mode-before-toggle.png', fullPage: true });

    console.log('\n========== TOGGLING DARK MODE ==========');

    // Open settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForSelector('text=Dark mode', { state: 'visible' });

    // Find and click dark mode checkbox
    const darkModeLabel = page.locator('label').filter({ hasText: 'Dark mode' });
    await darkModeLabel.click();

    // Wait for changes
    await page.waitForTimeout(500);

    console.log('\n========== AFTER TOGGLE ==========');

    // Check HTML element again
    const hasAfterDark = await html.evaluate((el) => el.classList.contains('dark'));
    console.log('HTML has dark class:', hasAfterDark);

    // Check if class actually changed
    console.log('Dark class changed:', hasInitialDark !== hasAfterDark);

    // Check computed styles again
    const bodyBgAfter = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const bodyColorAfter = await body.evaluate((el) => window.getComputedStyle(el).color);
    console.log('Body background after:', bodyBgAfter);
    console.log('Body color after:', bodyColorAfter);

    const mainBgAfter = await main.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log('Main container background after:', mainBgAfter);

    const headerBgAfter = await header.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const headerBorderAfter = await header.evaluate((el) => window.getComputedStyle(el).borderBottomColor);
    console.log('Header background after:', headerBgAfter);
    console.log('Header border after:', headerBorderAfter);

    // Take screenshot after toggle
    await page.screenshot({ path: 'test-results/dark-mode-after-toggle.png', fullPage: true });

    console.log('\n========== CHECKING SPECIFIC TAILWIND CLASSES ==========');

    // Close settings to see the main content
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Check if Tailwind dark: classes are being applied by inspecting actual element classes
    const mainClasses = await main.getAttribute('class');
    console.log('Main element classes:', mainClasses);

    // Check the outer div
    const outerDiv = page.locator('body > div').first();
    const outerDivClasses = await outerDiv.getAttribute('class');
    const outerDivBg = await outerDiv.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    console.log('Outer div classes:', outerDivClasses);
    console.log('Outer div background:', outerDivBg);

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    console.log('Theme in localStorage:', theme);

    // Get all stylesheets to see if Tailwind CSS is loaded
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(sheet => {
        try {
          return {
            href: sheet.href,
            rulesCount: sheet.cssRules?.length || 0
          };
        } catch (e) {
          return { href: sheet.href, error: 'Cannot access' };
        }
      });
    });
    console.log('\nStylesheets loaded:', JSON.stringify(stylesheets, null, 2));

    // Check if dark variant is available by testing a specific rule
    const isDarkVariantWorking = await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.className = 'dark:bg-gray-900';
      document.body.appendChild(testDiv);
      const styles = window.getComputedStyle(testDiv);
      const bg = styles.backgroundColor;
      document.body.removeChild(testDiv);
      return bg;
    });
    console.log('Test div with dark:bg-gray-900 background:', isDarkVariantWorking);

    // Final screenshot
    await page.screenshot({ path: 'test-results/dark-mode-final.png', fullPage: true });

    console.log('\n========== DIAGNOSTIC COMPLETE ==========\n');
  });
});
