import { test, expect } from '@playwright/test';

test('detailed flash investigation', async ({ page }) => {
  // Track all DOM mutations
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');

  // Capture DOM changes
  const mutations: any[] = [];

  await page.exposeFunction('logMutation', (data: any) => {
    mutations.push(data);
  });

  // Monitor the message container for text changes
  await page.evaluate(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target as HTMLElement;
          const text = target.textContent || '';
          if (text.length > 0) {
            (window as any).logMutation({
              type: mutation.type,
              text: text.substring(0, 100),
              textLength: text.length,
              timestamp: Date.now()
            });
          }
        }
      }
    });

    // Start observing
    const container = document.body;
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true
    });
  });

  // Send a message
  const textarea = page.locator('textarea');
  await textarea.fill('Hello there');

  const sendButton = page.locator('button:has-text("Send")');
  await sendButton.click();

  // Wait for response
  await page.waitForTimeout(3000);

  // Print all mutations
  console.log('\n=== DOM MUTATIONS ===');
  mutations.forEach((m, i) => {
    console.log(`[${i}] ${m.type}: "${m.text.substring(0, 50)}" (len: ${m.textLength})`);
  });
  console.log('====================\n');

  // Check if there's a long text that appears then disappears
  for (let i = 0; i < mutations.length - 1; i++) {
    const current = mutations[i];
    const next = mutations[i + 1];

    if (current.textLength > 50 && next.textLength < 10) {
      console.log('⚠️  FLASH DETECTED:');
      console.log(`  Mutation ${i}: ${current.textLength} chars`);
      console.log(`  Mutation ${i + 1}: ${next.textLength} chars`);
      console.log(`  Text that flashed: "${current.text}"`);
    }
  }
});
