import axios from 'axios'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const client = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

function throwApiError(err) {
  if (err && err.response && err.response.data) {
    throw new Error(err.response.data.error || JSON.stringify(err.response.data))
  }

  throw err
}

export async function generateChat(messages, sessionData) {
  try {
    const resp = await client.post('/sessions', { messages, sessionData })
    return resp.data
  } catch (err) {
    throwApiError(err)
  }
}

export async function fetchSessions() {
  try {
    const resp = await client.get('/sessions')
    return resp.data
  } catch (err) {
    throwApiError(err)
  }
}

export async function fetchChatSessions(sessionId) {
  try {
    const resp = await client.get(`/sessions/${sessionId}/messages`)
    return resp.data
  } catch (err) {
    throwApiError(err)
  }
}

export default client
