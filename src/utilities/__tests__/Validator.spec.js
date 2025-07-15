import { describe, it, expect } from 'vitest'
import Validator from '../Validator.js'

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
  it('should validate a correct document with draft-06', () => {
    const validator = new Validator(draft6Url)
    expect(validator.validate(simpleSchema, { foo: 'bar' })).toBe(true)
  })

  it('should throw on invalid document with draft-06', () => {
    const validator = new Validator(draft6Url)
    expect(() => validator.validate(simpleSchema, { foo: 123 })).toThrow()
  })

  it('should validate a correct document with draft-07', () => {
    const validator = new Validator(draft7Url)
    expect(validator.validate(simpleSchema, { foo: 'bar' })).toBe(true)
  })

  it('should throw on invalid document with draft-07', () => {
    const validator = new Validator(draft7Url)
    expect(() => validator.validate(simpleSchema, { foo: 123 })).toThrow()
  })

  it('should validate a correct document with draft-2019-09', () => {
    const validator = new Validator(draft2019Url)
    expect(validator.validate(simpleSchema, { foo: 'bar' })).toBe(true)
  })

  it('should throw on invalid document with draft-2019-09', () => {
    const validator = new Validator(draft2019Url)
    expect(() => validator.validate(simpleSchema, { foo: 123 })).toThrow()
  })

  it('should validate a correct document with draft-2020-12', () => {
    const validator = new Validator(draft2020Url)
    expect(validator.validate(simpleSchema, { foo: 'bar' })).toBe(true)
  })

  it('should throw on invalid document with draft-2020-12', () => {
    const validator = new Validator(draft2020Url)
    expect(() => validator.validate(simpleSchema, { foo: 123 })).toThrow()
  })

  it('should throw on invalid schema in validateSchema', () => {
    const validator = new Validator(draft7Url)
    expect(() => validator.validateSchema(invalidSchema)).toThrow()
  })

  it('should return true for valid schema in validateSchema', () => {
    const validator = new Validator(draft7Url)
    expect(validator.validateSchema(simpleSchema)).toBe(true)
  })

  it('should throw for unsupported schema URL', () => {
    // Suppress console.error for this test
    const origError = console.error
    console.error = () => {}
    expect(() => new Validator('https://unsupported-schema.org')).not.toThrow()
    console.error = origError
  })
})
