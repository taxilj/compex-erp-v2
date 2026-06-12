import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toHaveText('Compex ERP')
    await expect(page.getByText('EMS & PCB Manufacturing')).toBeVisible()
  })

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'takshilprajapati2004@gmail.com')
    await page.fill('input[type="password"]', 'Compex@2026')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
    await expect(page.locator('h1')).toHaveText('Dashboard')
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@test.com')
    await page.fill('input[type="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.getByText('Invalid credentials')).toBeVisible()
  })
})
