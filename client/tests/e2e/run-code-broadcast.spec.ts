import { test, expect } from '@playwright/test';

test('collaborators see run code outputs broadcasted in real-time', async ({ browser }) => {
  const roomId = 'e2e-run-room';
  const url = `/room/${roomId}`;

  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();
  pageA.on('pageerror', (err) => {
    console.error('PageA Error:', err.message);
  });
  pageA.on('console', (msg) => {
    console.log('PageA Console:', msg.text());
  });
  await pageA.goto(url);
  await pageA.fill('input[placeholder="e.g. Loganathan"]', 'UserA');
  await pageA.click('button:has-text("Enter Room")');

  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await pageB.goto(url);
  await pageB.fill('input[placeholder="e.g. Loganathan"]', 'UserB');
  await pageB.click('button:has-text("Enter Room")');

  await pageA.waitForSelector('header');
  await pageB.waitForSelector('header');

  const editorA = pageA.locator('.monaco-editor').first();
  await editorA.click();
  await pageA.keyboard.type('console.log("Run execution broadcast");');

  await pageA.click('button:has-text("Run Code")');

  await expect(pageA.locator('text=Run execution broadcast').first()).toBeVisible();
  await expect(pageB.locator('text=Run execution broadcast').first()).toBeVisible();

  await contextA.close();
  await contextB.close();
});
