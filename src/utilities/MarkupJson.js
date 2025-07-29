/**
 * MarkupJson - Utility functions for working with YAML markup.
 */
const MarkupJson = {
  /**
   * Converts a JavaScript object to a pretty-printed JSON string.
   * @param {Object} data - The JavaScript object to convert.
   * @returns {Promise<string>} - A Promise that resolves with the pretty-printed JSON string.
   */
  async prettyPrint(data) {
    return JSON.stringify(data, null, '  ')
  },

  /**
   * Parses a JSON string and returns a Promise that resolves with the parsed object.
   * If the JSON is invalid, it rejects with an error message.
   * @param {string} text - The JSON string to parse.
   * @param {string} doctype - The type of document being parsed, used for error messages. Default is 'document'.
   * @returns {Promise<Object>} - A Promise that resolves with the parsed object or rejects with an error.
   */
  async parse(text, doctype = 'document') {
    try {
      return JSON.parse(text)
    } catch {
      throw [
        {
          message_tid: 'ERROR_INVALID_JSON',
          message_params: { doctype: doctype?.toUpperCase() },
        },
      ]
    }
  },
}

export default MarkupJson
