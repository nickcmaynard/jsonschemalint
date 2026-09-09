import { beforeEach, describe, expect, it, vi } from 'vitest'

import { __internal, DeviceFlowError, GistFormatError, retrieveGist, saveGistWithAuth } from '../Gist'
const { requestDeviceCode, pollForAccessToken, savePublicGist } = __internal

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
    expect(body.description).toMatch(/^jsonschemalint-\d{4}-\d{2}-\d{2}T/)
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

describe('Gist device flow', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers()
  })

  it('requests a device code', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({
        device_code: 'devcode123',
        user_code: 'ABCD-1234',
        verification_uri: 'https://github.com/login/device',
        expires_in: 900,
        interval: 5,
      }),
    })

    const payload = await requestDeviceCode()

    expect(fetchMock).toHaveBeenCalledWith(
      '/github-oauth/device/code',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(payload.user_code).toBe('ABCD-1234')
  })

  it('throws a DeviceFlowError when the device code request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ error: 'device_flow_disabled', error_description: 'Device flow is not enabled' }),
    })

    await expect(requestDeviceCode()).rejects.toBeInstanceOf(DeviceFlowError)
  })

  it('polls until an access token is granted, tolerating authorization_pending', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({ json: async () => ({ error: 'authorization_pending' }) })
      .mockResolvedValueOnce({ json: async () => ({ access_token: 'gho_abc123' }) })

    const tokenPromise = pollForAccessToken('devcode123', { interval: 5, expiresIn: 900 })
    await vi.advanceTimersByTimeAsync(5000)
    await vi.advanceTimersByTimeAsync(5000)

    await expect(tokenPromise).resolves.toBe('gho_abc123')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('rejects with a DeviceFlowError when the code expires', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json: async () => ({ error: 'authorization_pending' }) })

    const tokenPromise = pollForAccessToken('devcode123', { interval: 5, expiresIn: 5 })

    await Promise.all([expect(tokenPromise).rejects.toBeInstanceOf(DeviceFlowError), vi.advanceTimersByTimeAsync(5000)])
  })

  it('rejects when the poll is cancelled via AbortSignal', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ json: async () => ({ error: 'authorization_pending' }) })

    const controller = new AbortController()
    const tokenPromise = pollForAccessToken('devcode123', { interval: 5, expiresIn: 900 }, { signal: controller.signal })
    controller.abort()

    await expect(tokenPromise).rejects.toBeInstanceOf(DeviceFlowError)
  })
})

describe('saveGistWithAuth', () => {
  const TOKEN_STORAGE_KEY = 'jsonschemalint.github.gist.token'

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('uses a cached token without running the device flow', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'cached-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'abc123' }),
    })

    const { promise } = saveGistWithAuth({ schema: '{}', document: '{}' })

    await expect(promise).resolves.toBe('abc123')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/gists',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'token cached-token' }),
      }),
    )
  })

  it('runs the device flow and caches the resulting token when none is stored', async () => {
    vi.useFakeTimers()
    vi.spyOn(window, 'open').mockImplementation(() => {})

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        json: async () => ({
          device_code: 'devcode123',
          user_code: 'ABCD-1234',
          verification_uri: 'https://github.com/login/device',
          expires_in: 900,
          interval: 5,
        }),
      })
      .mockResolvedValueOnce({ json: async () => ({ access_token: 'gho_new123' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'def456' }) })

    const onDeviceCode = vi.fn()
    const { promise } = saveGistWithAuth({ schema: '{}', document: '{}', onDeviceCode })

    await vi.advanceTimersByTimeAsync(5000)
    await expect(promise).resolves.toBe('def456')

    expect(onDeviceCode).toHaveBeenCalledWith({ userCode: 'ABCD-1234', verificationUri: 'https://github.com/login/device' })
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('gho_new123')
    expect(fetchMock).toHaveBeenCalledTimes(3)

    vi.useRealTimers()
  })

  it('clears the cached token when GitHub reports bad credentials', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stale-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Bad credentials' }),
    })

    const { promise } = saveGistWithAuth({ schema: '{}', document: '{}' })

    await expect(promise).rejects.toThrow('Bad credentials')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
  })

  it('clears the cached token on a 403 response regardless of message wording', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stale-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: async () => ({ message: 'Resource not accessible by personal access token' }),
    })

    const { promise } = saveGistWithAuth({ schema: '{}', document: '{}' })

    await expect(promise).rejects.toThrow('Resource not accessible by personal access token')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull()
  })

  it('keeps the cached token when the failure is unrelated to authorization', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'still-good-token')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity',
      json: async () => ({ message: 'Validation Failed' }),
    })

    const { promise } = saveGistWithAuth({ schema: '{}', document: '{}' })

    await expect(promise).rejects.toThrow('Validation Failed')
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('still-good-token')
  })
})
