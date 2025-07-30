import { describe, it, expect } from 'vitest'
import MarkupHjson from '../MarkupHjson'

describe('MarkupHjson', () => {
  describe('prettyPrint', () => {
    it('should pretty-print a simple object', async () => {
      const obj = { a: 1, b: 'test' }
      const result = await MarkupHjson.prettyPrint(obj)
      await expect(result).toBe('{\n  "a": 1\n  "b": "test"\n}')
    })

    it('should pretty-print an array', async () => {
      const arr = [1, 2, 3]
      const result = await MarkupHjson.prettyPrint(arr)
      await expect(result).toBe('[\n  1\n  2\n  3\n]')
    })

    it('should pretty-print nested objects', async () => {
      const obj = { a: { b: { c: 2 } } }
      const result = await MarkupHjson.prettyPrint(obj)
      await expect(result).toBe('{\n  "a": {\n    "b": {\n      "c": 2\n    }\n  }\n}')
    })
  })

  describe('parse', () => {
    it('should parse a valid JSON string', async () => {
      const json = '{"a":1,"b":"test"}'
      const result = await MarkupHjson.parse(json)
      await expect(result).toEqual({ a: 1, b: 'test' })
    })

    it('should parse a valid JSON array', async () => {
      const json = '[1,2,3]'
      const result = await MarkupHjson.parse(json)
      await expect(result).toEqual([1, 2, 3])
    })

    it('should reject with error for invalid JSON', async () => {
      const invalidJson = '{]'
      await expect(MarkupHjson.parse(invalidJson, 'foo')).rejects.toEqual([{ message_tid: 'ERROR_INVALID_HJSON', message_params: { doctype: 'FOO' } }])
    })

    it('should assume a default doctype of "document" if not provided', async () => {
      const invalidJson = '{]'
      await expect(MarkupHjson.parse(invalidJson)).rejects.toEqual([{ message_tid: 'ERROR_INVALID_HJSON', message_params: { doctype: 'DOCUMENT' } }])
    })
  })
})
