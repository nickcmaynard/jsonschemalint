'use strict'

// Ajv
import * as Ajv from 'ajv/dist/ajv.js'
import * as Ajv2019 from 'ajv/dist/2019.js'
import * as Ajv2020 from 'ajv/dist/2020.js'

// Ajv's meta schema for draft-06
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json'

export default function (schemaUrl) {
  console.debug('Validator() schemaUrl:', schemaUrl)

  this.schemaUrl = schemaUrl

  const opts = {
    verbose: true,
    allErrors: true,
    addUsedSchema: false, // Don't cache schemas
  }

  let validator
  switch (schemaUrl) {
    // draft4 is not supported because we'd need an old version of Ajv
    case 'https://json-schema.org/draft-06/schema':
      opts.meta = draft6MetaSchema
      validator = new Ajv(opts)
      break
    case 'https://json-schema.org/draft-07/schema':
      validator = new Ajv(opts)
      break
    case 'https://json-schema.org/draft/2019-09/schema':
      validator = new Ajv2019(opts)
      break
    case 'https://json-schema.org/draft/2020-12/schema':
      validator = new Ajv2020(opts)
      break
    default:
      console.error('Validator: Unsupported schema URL:', schemaUrl)
  }

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
