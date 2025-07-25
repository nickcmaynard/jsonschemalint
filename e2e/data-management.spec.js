import { test, expect } from '@playwright/test'

test.describe('data management', () => {
  test('should preserve schema and document across route changes', async ({ page }) => {
    await page.goto('/version/draft-06/markup/json')

    const randomSchema = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
    const randomDocument = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click()

    // Type something RANDOM in schema and document
    const schemaElement = page.locator('.validator-card[identifier=schema] textarea')
    const documentElement = page.locator('.validator-card[identifier=document] textarea')
    await schemaElement.fill(randomSchema)
    await documentElement.fill(randomDocument)

    // Open the version menu
    await page.getByLabel('Spec version selection').getByRole('button').click()

    // Select a different version
    await page.getByLabel('Spec version selection').getByText('draft-07').click()

    // Wait for app to finish working (simulate lib.isDoneWorking)
    await page.waitForTimeout(1000)

    // Check the RANDOM stuff is still there
    await expect(schemaElement).toHaveValue(randomSchema)
    await expect(documentElement).toHaveValue(randomDocument)
  })

  test('should preserve schema and document across page reloads', async ({ page }) => {
    await page.goto('/version/draft-06/markup/json')

    const randomSchema = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
    const randomDocument = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click()

    // Type something RANDOM in schema and document
    const schemaElement = page.locator('.validator-card[identifier=schema] textarea')
    const documentElement = page.locator('.validator-card[identifier=document] textarea')
    await schemaElement.fill(randomSchema)
    await documentElement.fill(randomDocument)

    // Reload it
    await page.reload()
    await page.waitForTimeout(1000)

    // Check the RANDOM stuff is still there
    await expect(schemaElement).toHaveValue(randomSchema)
    await expect(documentElement).toHaveValue(randomDocument)
  })

  test('should update the route and schema spec when a schema with $schema is loaded', async ({ page }) => {
    await page.goto('/version/draft-06/markup/json')

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click()

    // Type a schema with $schema
    const schemaElement = page.locator('.validator-card[identifier=schema] textarea')
    const schemaWithSpec = `{
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "type": "object",
      "properties": {
        "foo": {
          "type": "string"
        }
      }
    }`
    await schemaElement.fill(schemaWithSpec)

    // Wait for app to finish working (simulate lib.isDoneWorking)
    await page.waitForTimeout(1000)

    // Check the route has updated to draft-07
    expect(page.url()).toMatch(/\/version\/2020-12\/markup\/json/)
  })
})
