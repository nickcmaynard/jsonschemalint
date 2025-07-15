import { parse, stringify } from 'yaml'

/**
 * MarkupYaml - Utility functions for working with YAML markup.
 * This is a YAML equivalent of MarkupJson.js.
 */
const MarkupYaml = {
  /**
   * Converts a JavaScript object to a pretty-printed JSON string.
   * @param {Object} data - The JavaScript object to convert.
   * @returns {Promise<string>} - A Promise that resolves with the pretty-printed JSON string.
   */
  async prettyPrint(data) {
    return stringify(data, { indent: 2 })
  },

  /**
   * Parses a YAML string and returns a Promise that resolves with the parsed object.
   * If the YAML is invalid, it rejects with an error message.
   * @param {string} text - The YAML string to parse.
   * @returns {Promise<Object>} - A Promise that resolves with the parsed object or rejects with an error.
   */
  async parse(text) {
    try {
      return parse(text)
    } catch {
      throw [
        {
          message_tid: 'ERROR_INVALID_YAML',
        },
      ]
    }
  },
}

export default MarkupYaml
