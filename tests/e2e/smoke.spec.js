const { test, expect } = require('@playwright/test');

test('landing loads on mobile and primary CTA is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Ücretsiz Başla' }).first()).toBeVisible();
});

test('sign-in loads with email and social options surface', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByText('Kod sık geliyorsa, şifre ile giriş veya sosyal giriş seçeneklerini kullanabilirsiniz.')).toBeVisible();
  const identifierInput = page.locator('input[type="email"], input[type="text"], input[name*="identifier"]').first();
  await expect(identifierInput).toBeVisible();

  const googleButton = page.getByRole('button', { name: /Google/i });
  if (await googleButton.count()) {
    await expect(googleButton.first()).toBeVisible();
  }

  const githubButton = page.getByRole('button', { name: /GitHub/i });
  if (await githubButton.count()) {
    await expect(githubButton.first()).toBeVisible();
  }
});

test('dashboard route loads without runtime crash', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page.locator('text=Application error')).toHaveCount(0);
  await expect(page.locator('text=Something went wrong')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Takvim' })).toBeVisible({ timeout: 20000 });
});

test('calendar tab renders and mobile day tap opens detail drawer', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('button', { name: 'Takvim' })).toBeVisible({ timeout: 20000 });

  await page.getByRole('button', { name: 'Takvim' }).click();
  await expect(page.getByRole('heading', { name: 'Takvim & Hatırlatıcılar' })).toBeVisible();

  const firstDayCell = page.locator('button.aspect-square.rounded-xl').first();
  await firstDayCell.click();

  await expect(page.getByRole('button', { name: 'Paneli kapat' })).toBeVisible();
});
