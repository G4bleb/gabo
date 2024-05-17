import { test, expect } from '@playwright/test';

test('room login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  page.on('websocket', async (socket) => {
    await page.getByPlaceholder('Nickname').fill('playwright-user');
    await page.getByPlaceholder('Room code').fill('playwright-room');
  
    await page.locator("[type=submit]").click();
  });
  await page.locator("#gameboard").waitFor();
  await expect(page.locator("#gameboard")).toBeVisible();
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
