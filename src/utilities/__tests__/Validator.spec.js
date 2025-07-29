import { describe, it, expect } from 'vitest'
import { buildValidator } from '../Validator.js'

const draft4Url = 'https://json-schema.org/draft-04/schema'
const draft6Url = 'https://json-schema.org/draft-06/schema'
const draft7Url = 'https://json-schema.org/draft-07/schema'
const draft2019Url = 'https://json-schema.org/draft/2019-09/schema'
const draft2020Url = 'https://json-schema.org/draft/2020-12/schema'

const simpleSchema = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
  },
  required: ['foo'],
}

const invalidSchema = {
  type: 'object',
  properties: {
    foo: { type: 'not-a-type' },
  },
}

describe('Validator', () => {
  for (const schemaUrl of [draft4Url, draft6Url, draft7Url, draft2019Url, draft2020Url]) {
    it(`should build a validator for ${schemaUrl}`, async () => {
      const validator = await buildValidator(schemaUrl)
      expect(validator).toBeDefined()
      expect(validator.schemaUrl).toBe(schemaUrl)
    })

    it('should validate a correct document', async () => {
      const validator = await buildValidator(schemaUrl)
      expect(validator.validate(simpleSchema, { foo: 'bar' })).toBe(true)
    })

    it('should throw on invalid document', async () => {
      const validator = await buildValidator(schemaUrl)
      expect(() => validator.validate(simpleSchema, { foo: 123 })).toThrow()
    })

    it('should throw on invalid schema in validateSchema', async () => {
      const validator = await buildValidator(schemaUrl)
      expect(() => validator.validateSchema(invalidSchema)).toThrow()
    })

    it('should return true for valid schema in validateSchema', async () => {
      const validator = await buildValidator(schemaUrl)
      expect(validator.validateSchema(simpleSchema)).toBe(true)
    })
  }

  it(`should throw on unsupported schema URL`, async () => {
    const unsupportedUrl = 'https://unsupported-schema.org'
    // Suppress console.error for this test
    const origError = console.error
    console.error = () => {}
    await expect(() => buildValidator(unsupportedUrl)).rejects.toThrow(`Unsupported schema URL: ${unsupportedUrl}`)
    console.error = origError
  })
})
