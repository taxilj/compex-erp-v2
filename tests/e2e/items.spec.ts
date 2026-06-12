import { test, expect } from '@playwright/test'

test.describe('Items', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'takshilprajapati2004@gmail.com')
    await page.fill('input[type="password"]', 'Compex@2026')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('items page shows list', async ({ page }) => {
    await page.goto('/admin/items')
    await expect(page.locator('h1')).toHaveText('Items')
  })

  test('quotations page shows list', async ({ page }) => {
    await page.goto('/admin/quotations')
    await expect(page.locator('h1')).toHaveText('Quotations')
  })

  test('dashboard shows stats cards', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('main').getByText('Items', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('main').getByText('Suppliers', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('main').getByText('Customers', { exact: true }).first()).toBeVisible()
  })
})
