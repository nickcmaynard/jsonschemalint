const GITHUB_GISTS_ENDPOINT = 'https://api.github.com/gists'

// Same-origin paths, reverse-proxied to github.com so the browser never makes a cross-origin OAuth request
const DEVICE_CODE_ENDPOINT = '/github-oauth/device/code'
const ACCESS_TOKEN_ENDPOINT = '/github-oauth/access_token'
const GITHUB_OAUTH_CLIENT_ID = 'Ov23liGeylZQ9zRtnV4Z'
const GIST_SCOPE = 'gist'
const DEVICE_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code'
const GIST_TOKEN_STORAGE_KEY = 'jsonschemalint.github.gist.token'


export class GistFormatError extends Error {
  constructor(message = 'Invalid jsonschemalint gist format') {
    super(message)
    this.name = 'GistFormatError'
  }
}

export class DeviceFlowError extends Error {
  constructor(code, description) {
    super(description || code)
    this.name = 'DeviceFlowError'
    this.code = code
  }
}

class GistApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'GistApiError'
    this.status = status
  }
}

const postJson = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })
  return response.json()
}

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DeviceFlowError('aborted', 'Device authorization cancelled'))
      },
      { once: true },
    )
  })

const requestDeviceCode = async () => {
  const payload = await postJson(DEVICE_CODE_ENDPOINT, { client_id: GITHUB_OAUTH_CLIENT_ID, scope: GIST_SCOPE })

  if (payload.error) {
    throw new DeviceFlowError(payload.error, payload.error_description)
  }

  return payload
}

// Polls GitHub per the device flow spec until the user authorizes, cancels, or the code expires
const pollForAccessToken = async (deviceCode, { interval, expiresIn }, { signal } = {}) => {
  const deadline = Date.now() + expiresIn * 1000
  let waitSeconds = interval

  while (Date.now() < deadline) {
    await sleep(waitSeconds * 1000, signal)

    const payload = await postJson(ACCESS_TOKEN_ENDPOINT, {
      client_id: GITHUB_OAUTH_CLIENT_ID,
      device_code: deviceCode,
      grant_type: DEVICE_GRANT_TYPE,
    })

    if (payload.access_token) {
      return payload.access_token
    }
    if (payload.error === 'authorization_pending') {
      continue
    }
    if (payload.error === 'slow_down') {
      waitSeconds += 5
      continue
    }
    throw new DeviceFlowError(payload.error, payload.error_description)
  }

  throw new DeviceFlowError('expired_token', 'Device authorization expired')
}

const clearStoredGistToken = () => localStorage.removeItem(GIST_TOKEN_STORAGE_KEY)

// Returns { promise, cancel }: promise resolves with a gist-scoped token (from storage, or via
// device flow authorization); cancel() aborts an in-flight device flow authorization.
const fetchGistToken = ({ onDeviceCode } = {}) => {
  const storedToken = localStorage.getItem(GIST_TOKEN_STORAGE_KEY)
  if (storedToken) {
    return { promise: Promise.resolve(storedToken), cancel: () => {} }
  }

  const controller = new AbortController()

  const promise = (async () => {
    const { device_code: deviceCode, user_code: userCode, verification_uri: verificationUri, interval, expires_in: expiresIn } =
      await requestDeviceCode()

    onDeviceCode?.({ userCode, verificationUri })
    window.open(verificationUri, '_blank', 'noopener,noreferrer')

    const token = await pollForAccessToken(deviceCode, { interval, expiresIn }, { signal: controller.signal })
    localStorage.setItem(GIST_TOKEN_STORAGE_KEY, token)
    return token
  })()

  return { promise, cancel: () => controller.abort() }
}

const extractErrorMessage = async (response) => {
  try {
    const payload = await response.json()
    return payload?.message || response.statusText
  } catch {
    return response.statusText
  }
}

const extractGistTextPair = (payload) => {
  const schema = payload?.files?.schema?.content
  const document = payload?.files?.document?.content

  if (typeof schema !== 'string' || typeof document !== 'string') {
    throw new GistFormatError()
  }

  return { schema, document }
}

const savePublicGist = async ({ schema, document, token }) => {
  const response = await fetch(GITHUB_GISTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: ['token', token].join(' '),
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      description: `jsonschemalint-${new Date().toISOString()}`,
      public: true,
      files: {
        schema: { content: schema },
        document: { content: document },
      },
    }),
  })

  if (!response.ok) {
    throw new GistApiError(await extractErrorMessage(response), response.status)
  }

  const payload = await response.json()
  return payload.id
}

// Full save flow: obtains a token (cached or via device flow), then creates the gist.
// Returns { promise, cancel } so callers can offer a cancel button while device auth is pending.
export const saveGistWithAuth = ({ schema, document, onDeviceCode }) => {
  const { promise: tokenPromise, cancel } = fetchGistToken({ onDeviceCode })

  const promise = (async () => {
    try {
      const token = await tokenPromise
      return await savePublicGist({ schema, document, token })
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearStoredGistToken()
      }
      throw error
    }
  })()

  return { promise, cancel }
}

export const retrieveGist = async (gistId) => {
  const response = await fetch(`${GITHUB_GISTS_ENDPOINT}/${gistId}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response))
  }

  return extractGistTextPair(await response.json())
}

// Internal building blocks, exposed only for unit testing - not part of the public API
export const __internal = {
  requestDeviceCode,
  pollForAccessToken,
  clearStoredGistToken,
  fetchGistToken,
  savePublicGist,
}
