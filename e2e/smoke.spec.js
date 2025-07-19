import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('should automatically redirect to a default version & markup when location hash/fragment is empty', async ({ page }) => {
    await page.goto('/')
    const url = page.url()
    expect(url).toMatch(/\/version\/.*\/markup\/.*/)
  })

  test.describe('about dialog', () => {
    test('should display when the button is clicked', async ({ page }) => {
      await page.goto('/')
      await page.locator('a', { hasText: 'About' }).click()
      const aboutHeader = page.locator('h5', { hasText: 'About' })
      await expect(aboutHeader).toBeVisible()
    })
  })
})
