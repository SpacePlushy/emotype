import { test, expect } from '@playwright/test';

test.describe('Animation Issues Investigation', () => {
  test('investigate flash before animation and backspace behavior', async ({ page }) => {
    // Start video recording
    await page.goto('http://localhost:3002');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Type a message
    const textarea = page.locator('textarea');
    await textarea.fill('Hello, can you tell me about typing animations?');

    // Click send
    const sendButton = page.locator('button:has-text("Send")');
    await sendButton.click();

    // Wait for assistant message to appear
    await page.waitForSelector('[class*="justify-start"]', { timeout: 10000 });

    // Take screenshots at different intervals to catch the flash
    await page.screenshot({ path: 'tests/screenshots/01-message-start.png', fullPage: true });

    await page.waitForTimeout(100);
    await page.screenshot({ path: 'tests/screenshots/02-after-100ms.png', fullPage: true });

    await page.waitForTimeout(200);
    await page.screenshot({ path: 'tests/screenshots/03-after-300ms.png', fullPage: true });

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/04-after-800ms.png', fullPage: true });

    // Monitor the message text content over time
    const messageContainer = page.locator('[class*="justify-start"]').last();
    const textChanges: string[] = [];

    for (let i = 0; i < 10; i++) {
      const text = await messageContainer.innerText();
      textChanges.push(text);
      console.log(`[${i * 100}ms] Text: "${text}"`);
      await page.waitForTimeout(100);
    }

    // Check if text ever shows full content then resets
    const hasFlash = textChanges.some((text, index) => {
      if (index === 0) return false;
      const prevText = textChanges[index - 1];
      return text.length > 10 && prevText.length < 3;
    });

    console.log('Text changes detected:', textChanges);
    console.log('Flash detected:', hasFlash);

    // Wait for animation to complete
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'tests/screenshots/05-animation-complete.png', fullPage: true });

    // Log final state
    const finalText = await messageContainer.innerText();
    console.log('Final text:', finalText);
  });

  test('check DOM rendering during animation start', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    // Setup console log capture
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('[Message]') || msg.text().includes('[TypingAnimator]')) {
        consoleLogs.push(msg.text());
      }
    });

    const textarea = page.locator('textarea');
    await textarea.fill('Test message');

    const sendButton = page.locator('button:has-text("Send")');
    await sendButton.click();

    // Wait for animation to start
    await page.waitForSelector('[class*="justify-start"]', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Print all console logs
    console.log('=== Console Logs ===');
    consoleLogs.forEach(log => console.log(log));
    console.log('===================');
  });
});
