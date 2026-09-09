const GITHUB_GISTS_ENDPOINT = 'https://api.github.com/gists'

export class GistFormatError extends Error {
  constructor(message = 'Invalid jsonschemalint gist format') {
    super(message)
    this.name = 'GistFormatError'
  }
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

export const savePublicGist = async ({ schema, document, token }) => {
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
    throw new Error(await extractErrorMessage(response))
  }

  const payload = await response.json()
  return payload.id
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
