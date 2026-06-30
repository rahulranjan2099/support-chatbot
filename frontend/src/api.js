import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export async function generateChat(messages, sessionData) {
  try {
    const resp = await client.post('/sessions', { messages, sessionData })
    return resp.data
  } catch (err) {
    if (err && err.response && err.response.data) {
      throw new Error(err.response.data.error || JSON.stringify(err.response.data))
    }
    throw err
  }
}

export async function fetchSessions() {
  try {
    const resp = await client.get('/sessions')
    return resp.data
  } catch (err) {
    if (err && err.response && err.response.data) {
      throw new Error(err.response.data.error || JSON.stringify(err.response.data))
    }
    throw err
  }
}

export async function fetchChatSessions(sessionId) {
  try {
    const resp = await client.get(`/sessions/${sessionId}/messages`)
    return resp.data
  } catch (err) {
    if (err && err.response && err.response.data) {
      throw new Error(err.response.data.error || JSON.stringify(err.response.data))
    }
    throw err
  }
}

export default client
