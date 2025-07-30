import { describe, it, expect } from 'vitest'
import MarkupYaml from '../MarkupYaml'

describe('MarkupYaml', () => {
  describe('prettyPrint', () => {
    it('should pretty print a simple object', async () => {
      const obj = { foo: 'bar', baz: 42 }
      const yaml = await MarkupYaml.prettyPrint(obj)
      expect(yaml).toContain('foo: bar')
      expect(yaml).toContain('baz: 42')
    })

    it('should pretty print an array', async () => {
      const arr = [1, 2, 3]
      const yaml = await MarkupYaml.prettyPrint(arr)
      expect(yaml).toContain('- 1')
      expect(yaml).toContain('- 2')
      expect(yaml).toContain('- 3')
    })

    it('should pretty print nested objects', async () => {
      const obj = { foo: { bar: [1, 2] } }
      const yaml = await MarkupYaml.prettyPrint(obj)
      expect(yaml).toContain('foo:')
      expect(yaml).toContain('bar:')
      expect(yaml).toContain('- 1')
      expect(yaml).toContain('- 2')
    })
  })

  describe('parse', () => {
    it('should parse a simple YAML object', async () => {
      const yaml = 'foo: bar\nbaz: 42'
      const result = await MarkupYaml.parse(yaml)
      expect(result).toEqual({ foo: 'bar', baz: 42 })
    })

    it('should parse a YAML array', async () => {
      const yaml = '- 1\n- 2\n- 3'
      const result = await MarkupYaml.parse(yaml)
      expect(result).toEqual([1, 2, 3])
    })

    it('should parse nested YAML', async () => {
      const yaml = 'foo:\n  bar:\n    - 1\n    - 2'
      const result = await MarkupYaml.parse(yaml)
      expect(result).toEqual({ foo: { bar: [1, 2] } })
    })

    it('should reject invalid YAML', async () => {
      const invalidYaml = 'foo: bar:'
      const result = MarkupYaml.parse(invalidYaml, 'foo')
      expect(result).rejects.toEqual([{ message_tid: 'ERROR_INVALID_YAML', message_params: { doctype: 'FOO' } }])
    })

    it('should assume a default doctype of "document" if not provided', async () => {
      const invalidYaml = 'foo: bar:'
      const result = MarkupYaml.parse(invalidYaml)
      expect(result).rejects.toEqual([{ message_tid: 'ERROR_INVALID_YAML', message_params: { doctype: 'DOCUMENT' } }])
    })
  })
})
