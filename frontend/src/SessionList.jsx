import { useEffect, useState } from 'react'
import { fetchSessions } from './api'

export default function SessionList({ currentSession, onNewChat, onSelect }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSessions()
      .then((data) => {
        if (!mounted) return
        // assume data is array or { sessions: [] }
        const list = Array.isArray(data) ? data : data.sessions || []
        setSessions(list)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!currentSession?.id) {
      return
    }

    setSessions((currentSessions) => {
      const existingSession = currentSessions.some((session) => session.id === currentSession.id)
      if (existingSession) {
        return currentSessions.map((session) =>
          session.id === currentSession.id ? { ...session, ...currentSession } : session,
        )
      }

      return [currentSession, ...currentSessions]
    })
  }, [currentSession])

  return (
    <aside className="sessions-panel">
      <div className="sessions-header">
        <h2>Conversations</h2>
        <button type="button" className="new-chat-button" onClick={onNewChat}>
          New chat
        </button>
      </div>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : error ? (
        <p className="muted error">{error}</p>
      ) : sessions.length === 0 ? (
        <p className="muted">No sessions yet</p>
      ) : (
        <ul className="sessions-list">
          {sessions.map((s) => (
            <li
              key={s.id}
              className={`session-item ${currentSession?.id === s.id ? 'active' : ''}`}
              onClick={() => onSelect?.(s)}
            >
              <div className="session-title" >{s.title || 'Conversation'}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
