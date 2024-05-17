import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
  page.once('websocket', async (socket) => {
    socket.on("framereceived", async (data) => {
      const payload = JSON.parse(data.payload.toString()) as {type:string};
      console.log(payload);
      if (payload.type === "connected") {
        await page.getByPlaceholder('Nickname').fill('playwright-user');
        await page.getByPlaceholder('Room code').fill('playwright-room');
      
        await page.locator("[type=submit]").click();
      }
    });
  });
  await page.locator("#gameboard").waitFor();
  await expect(page.locator("#gameboard")).toBeVisible();
}

test('Room login, reload and re-login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await login(page);
  await page.reload();
  await login(page);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
