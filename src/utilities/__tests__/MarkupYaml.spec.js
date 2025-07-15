import { describe, it, expect } from 'vitest'
import MarkupYaml from '../MarkupYaml'

describe('MarkupYaml', () => {
  describe('prettyPrint', () => {
    it('should pretty print a simple object', async () => {
      const obj = { foo: 'bar', baz: 42 }
      const yaml = await MarkupYaml.prettyPrint(obj)
      await expect(yaml).toContain('foo: bar')
      await expect(yaml).toContain('baz: 42')
    })

    it('should pretty print an array', async () => {
      const arr = [1, 2, 3]
      const yaml = await MarkupYaml.prettyPrint(arr)
      await expect(yaml).toContain('- 1')
      await expect(yaml).toContain('- 2')
      await expect(yaml).toContain('- 3')
    })

    it('should pretty print nested objects', async () => {
      const obj = { foo: { bar: [1, 2] } }
      const yaml = await MarkupYaml.prettyPrint(obj)
      await expect(yaml).toContain('foo:')
      await expect(yaml).toContain('bar:')
      await expect(yaml).toContain('- 1')
      await expect(yaml).toContain('- 2')
    })
  })

  describe('parse', () => {
    it('should parse a simple YAML object', async () => {
      const yaml = 'foo: bar\nbaz: 42'
      const result = await MarkupYaml.parse(yaml)
      await expect(result).toEqual({ foo: 'bar', baz: 42 })
    })

    it('should parse a YAML array', async () => {
      const yaml = '- 1\n- 2\n- 3'
      const result = await MarkupYaml.parse(yaml)
      await expect(result).toEqual([1, 2, 3])
    })

    it('should parse nested YAML', async () => {
      const yaml = 'foo:\n  bar:\n    - 1\n    - 2'
      const result = await MarkupYaml.parse(yaml)
      await expect(result).toEqual({ foo: { bar: [1, 2] } })
    })

    it('should reject invalid YAML', async () => {
      const invalidYaml = 'foo: bar:'
      await expect(MarkupYaml.parse(invalidYaml)).rejects.toEqual([
        { message_tid: 'ERROR_INVALID_YAML' },
      ])
    })
  })
})
