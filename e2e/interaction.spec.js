import { test, expect } from '@playwright/test'

test.describe('document/spec interaction', () => {
  test('should show an explanatory error in the document errors when the schema is invalid', async ({ page }) => {
    await page.goto('/version/draft-07/markup/json')

    const invalidSchema = `{
            "type": "object",
            "properties": {
                "fooMin": {
                    "type": "number",
                    "minimum": "foo"
                }
            }
        }`

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click()

    // Type the invalid schema in the schema element
    const schemaTextarea = page.locator('.validator-card[identifier=schema] textarea')
    await schemaTextarea.fill(invalidSchema)

    // And a basically valid JSON document
    const documentTextarea = page.locator('.validator-card[identifier=document] textarea')
    await documentTextarea.fill('{}')

    // Wait for validation to complete (replace with a better selector if possible)
    await page.waitForTimeout(1000)

    // Check for document errors
    const documentErrors = page.locator('.validator-card[identifier=document] .validation-messages tbody tr')
    await expect(documentErrors).toBeVisible()
  })
})
