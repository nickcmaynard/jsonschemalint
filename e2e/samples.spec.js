import { test, expect } from '@playwright/test'

const sampleTestMatrix = [
  { mode: 'draft-04', sample: 'Sample draft-04 schema and valid document', schemaValid: true, documentValid: true },
  { mode: 'draft-04', sample: 'Sample draft-04 schema and invalid document', schemaValid: true, documentValid: false },
  { mode: 'draft-06', sample: 'Sample draft-06 schema and valid document', schemaValid: true, documentValid: true },
  { mode: 'draft-06', sample: 'Sample draft-06 schema and invalid document', schemaValid: true, documentValid: false },
  { mode: 'draft-07', sample: 'Sample draft-07 schema and valid document', schemaValid: true, documentValid: true },
  { mode: 'draft-07', sample: 'Sample draft-07 schema and invalid document', schemaValid: true, documentValid: false },
]

function markupSampleTests(markup) {
  for (const { mode, sample, schemaValid, documentValid } of sampleTestMatrix) {
    test(`in ${mode} mode, should correctly validate the ${sample} (${markup})`, async ({ page }) => {
      await page.goto(`/version/${mode}/markup/${markup}`)

      // Open the samples menu
      await page.getByRole('button', { name: 'Samples' }).click()

      // Wait for the samples dropdown to be visible
      //   await expect(page.locator('ul[aria-labelledby=sampleDropdown]')).toBeVisible()

      // Click the sample to load it
      await page.locator('a', { hasText: sample }).click()

      // Wait for validation to finish (simulate lib.isDoneWorking)
      // Wait for validation to complete (replace with a better selector if possible)
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(1000)

      // Schema is valid/invalid
      const schemaPanel = page.locator(`.validator-card[identifier=schema] .card-header.bg-${schemaValid ? 'success' : 'danger'}`)
      await expect(schemaPanel).toBeVisible()

      // Document is valid/invalid
      const documentPanel = page.locator(`.validator-card[identifier=document] .card-header.bg-${documentValid ? 'success' : 'danger'}`)
      await expect(documentPanel).toBeVisible()
    })
  }
}

test.describe('JSON samples', () => {
  markupSampleTests('json')
})

test.describe('YAML samples', () => {
  markupSampleTests('yaml')
})
