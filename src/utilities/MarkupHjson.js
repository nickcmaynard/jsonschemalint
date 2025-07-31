import { parse, stringify } from 'hjson'

/**
 * MarkupHjson - Utility functions for working with Hjson markup.
 * https://hjson.github.io/
 * This is a Hjson equivalent of MarkupJson.js.
 */
const MarkupHjson = {
  /**
   * Converts a JavaScript object to a pretty-printed HJSON string.
   * @param {Object} data - The JavaScript object to convert.
   * @returns {Promise<string>} - A Promise that resolves with the pretty-printed JSON string.
   */
  async prettyPrint(data) {
    return stringify(data, { space: 2, condense: 60, bracesSameLine: true, quotes: 'all', keepWsc: true })
  },

  /**
   * Parses a HJSON string and returns a Promise that resolves with the parsed object.
   * If the HJSON is invalid, it rejects with an error message.
   * @param {string} text - The YAML string to parse.
   * @param {string} doctype - The type of document being parsed, used for error messages. Default is 'document'.
   * @returns {Promise<Object>} - A Promise that resolves with the parsed object or rejects with an error.
   */
  async parse(text, doctype = 'document') {
    try {
      return parse(text, { keepWsc: true })
    } catch {
      throw [
        {
          message_tid: 'ERROR_INVALID_HJSON',
          message_params: { doctype: doctype?.toUpperCase() },
        },
      ]
    }
  },
}

export default MarkupHjson
