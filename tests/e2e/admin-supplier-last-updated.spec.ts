import { test, expect } from '@playwright/test';

test.describe('Admin supplier details', () => {
  test('shows supplier last updated from API response with fallback', async ({ page }) => {
    await page.addInitScript(() => {
      window.RUNTIME_CONFIG = { API_URL: window.location.origin };
    });

    const products = [
      {
        productId: 1,
        supplierId: 101,
        name: 'SmartFeeder One',
        description: 'desc',
        price: 99,
        sku: 'SKU-1',
        unit: 'pcs',
        imgName: 'smart-feeder.png',
      },
      {
        productId: 2,
        supplierId: 102,
        name: 'Laser Tower',
        description: 'desc',
        price: 199,
        sku: 'SKU-2',
        unit: 'pcs',
        imgName: 'laser-tower.png',
      },
      {
        productId: 3,
        supplierId: 103,
        name: 'Nap Pod',
        description: 'desc',
        price: 299,
        sku: 'SKU-3',
        unit: 'pcs',
        imgName: 'nap-pod.png',
      },
    ];

    await page.route('**/*', async (route) => {
      const url = route.request().url();

      if (url.includes('/api/products')) {
        await route.fulfill({ json: products });
        return;
      }

      if (url.includes('/api/suppliers/101')) {
        await route.fulfill({
          json: {
            supplierId: 101,
            name: 'Octo Parts',
            description: 'desc',
            contactPerson: 'A',
            email: 'a@example.com',
            phone: '123',
            last_updated: '2026-04-11T10:45:30Z',
          },
        });
        return;
      }

      if (url.includes('/api/suppliers/102')) {
        await route.fulfill({
          json: {
            supplierId: 102,
            name: 'Cattronics',
            description: 'desc',
            contactPerson: 'B',
            email: 'b@example.com',
            phone: '456',
            lastUpdated: '2026-04-12T08:15:00+02:00',
          },
        });
        return;
      }

      if (url.includes('/api/suppliers/103')) {
        await route.fulfill({
          json: {
            supplierId: 103,
            name: 'Purr Logistics',
            description: 'desc',
            contactPerson: 'C',
            email: 'c@example.com',
            phone: '789',
          },
        });
        return;
      }

      if (url.includes('/api/suppliers')) {
        await route.fulfill({
          json: [
            { supplierId: 101, name: 'Octo Parts' },
            { supplierId: 102, name: 'Cattronics' },
            { supplierId: 103, name: 'Purr Logistics' },
          ],
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/login');
    await page.getByLabel('Email Address').fill('admin@github.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('link', { name: 'Manage Products' }).click();

    await expect(page).toHaveURL(/\/admin\/products/);
    await expect(page.getByRole('heading', { name: 'Product Management' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'SmartFeeder One' })).toBeVisible();

    const expected101 = await page.evaluate((timestamp) => {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(new Date(timestamp));
    }, '2026-04-11T10:45:30Z');

    const expected102 = await page.evaluate((timestamp) => {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      }).format(new Date(timestamp));
    }, '2026-04-12T08:15:00+02:00');

    await expect(page.locator('tr', { hasText: 'SmartFeeder One' })).toContainText(
      `Last updated: ${expected101}`,
    );
    await expect(page.locator('tr', { hasText: 'Laser Tower' })).toContainText(
      `Last updated: ${expected102}`,
    );
    await expect(page.locator('tr', { hasText: 'Nap Pod' })).toContainText(
      'Last updated: Not available',
    );
  });
});
