'use strict'

// Ajv
// import * as Ajv from 'ajv/dist/ajv.js'
// import * as Ajv2019 from 'ajv/dist/2019.js'
// import * as Ajv2020 from 'ajv/dist/2020.js'

/**
 * Asynchronous builder for Validator.
 * @param {string} schemaUrl - The schema URL to use.
 * @returns {Promise<Validator>}
 */
export async function buildValidator(schemaUrl) {
  const opts = {
    verbose: true,
    allErrors: true,
    addUsedSchema: false, // Don't cache schemas
  }

  let ajv
  let validator
  switch (schemaUrl) {
    // draft4 is not supported because we'd need an old version of Ajv
    case 'https://json-schema.org/draft-06/schema':
      // Ajv's meta schema for draft-06
      opts.meta = await import('ajv/dist/refs/json-schema-draft-06.json')
      ajv = await import('ajv/dist/ajv.js')
      validator = new ajv(opts)
      break
    case 'https://json-schema.org/draft-07/schema':
      ajv = await import('ajv/dist/ajv.js')
      validator = new ajv(opts)
      break
    case 'https://json-schema.org/draft/2019-09/schema':
      ajv = await import('ajv/dist/2019.js')
      validator = new ajv(opts)
      break
    case 'https://json-schema.org/draft/2020-12/schema':
      ajv = await import('ajv/dist/2020.js')
      validator = new ajv(opts)
      break
    default:
      console.error('Validator: Unsupported schema URL:', schemaUrl)
  }

  return new _Validator(validator, schemaUrl)
}

const _Validator = function (validator, schemaUrl) {
  console.debug('Validator() schemaUrl:', schemaUrl)

  this.schemaUrl = schemaUrl
  this.validator = validator

  this.validateSchema = function (schemaObject) {
    if (validator.validateSchema(schemaObject)) {
      console.debug('Validator.validateSchema()', validator.errorsText(validator.errors))
      return true
    } else {
      console.debug('Validator.validateSchema()', validator.errorsText(validator.errors))
      throw validator.errors
    }
  }

  this.validate = function (schemaObject, documentObject) {
    console.debug('Validator.validate()')
    var result
    try {
      result = validator.validate(schemaObject, documentObject)
    } catch (e) {
      // Some errors are thrown by Ajv, not wrapped up in its nice validator.errors interface
      console.error('Validator.validate()', e.message)
      // Wrap the exception into our standard format
      throw [{ message: e.message }]
    }
    // Validation completed - check the results
    if (result) {
      console.debug('Validator.validate()', 'success')
      return true
    } else {
      console.error('Validator.validate()', validator.errorsText(validator.errors))
      throw validator.errors
    }
  }
}
