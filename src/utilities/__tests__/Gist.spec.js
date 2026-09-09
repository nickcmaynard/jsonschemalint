import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GistFormatError, retrieveGist, savePublicGist } from '../Gist'

describe('Gist utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('saves as a public gist', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'abc123' }),
    })

    const gistId = await savePublicGist({ schema: '{"type":"object"}', document: '{}', token: 'demo-token' })

    expect(gistId).toBe('abc123')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/gists',
      expect.objectContaining({
        method: 'POST',
      }),
    )

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.public).toBe(true)
    expect(body.files.schema.content).toBe('{"type":"object"}')
    expect(body.files.document.content).toBe('{}')
  })

  it('retrieves schema and document from gist files', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        files: {
          schema: { content: '{"type":"string"}' },
          document: { content: '"value"' },
        },
      }),
    })

    await expect(retrieveGist('abc123')).resolves.toEqual({
      schema: '{"type":"string"}',
      document: '"value"',
    })
  })

  it('rejects invalid gist structure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        files: {
          schema: { content: '{"type":"string"}' },
        },
      }),
    })

    await expect(retrieveGist('abc123')).rejects.toBeInstanceOf(GistFormatError)
  })
})
