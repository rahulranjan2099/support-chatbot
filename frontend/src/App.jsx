import { useEffect, useRef, useState } from 'react'
import './App.css'
import { generateChat, fetchChatSessions } from './api'
import SessionList from './SessionList'

const initialMessages = [
  {
    role: 'assistant',
    content:
      'Hello! I can help with support requests or return/shipping policy. What would you like help with today?',
  },
]

const examplePrompts = [
  'Tell me about your return policy',
  'What are the support hours?',
  'Tell me about the Shipping policy',
]

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [currentSession, setCurrentSession] = useState()
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (content) => {
    const userMessage = { role: 'user', content }
    const conversation = [...messages, userMessage]

    setMessages(conversation)
    setDraft('')
    setError('')
    setIsTyping(true)

    try {
      const chatUpdate = await generateChat(userMessage, currentSession)

      if (chatUpdate.session) {
        setCurrentSession(chatUpdate.session)
      }

      if (Array.isArray(chatUpdate.messages)) {
        setMessages((currentMessages) => [...currentMessages, ...chatUpdate.messages.slice(1)])
      } else {
        setMessages((currentMessages) => [
          ...currentMessages,
          { role: 'assistant', content: 'I could not generate a response right now.' },
        ])
      }
    } catch (err) {
      const details = err instanceof Error ? err.message : 'Please try again.'
      setError(details)
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: 'Sorry, I hit a snag. Please try again in a moment.' },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedDraft = draft.trim()
    if (!trimmedDraft || isTyping) {
      return
    }

    await sendMessage(trimmedDraft)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSubmit(event)
    }
  }

  const handleNewChat = () => {
    setMessages(initialMessages)
    setDraft('')
    setCurrentSession()
    setError('')
    setIsTyping(false)
  }
  const handleSelectSession = async (session) => {
    setCurrentSession(session)
    const gotChatResponse = await fetchChatSessions(session.id)
    setMessages(gotChatResponse)
  }

  return (
    <div className="chat-shell">
      <div className="chat-card">
        <div className="layout">
          <SessionList
            currentSession={currentSession}
            onNewChat={handleNewChat}
            onSelect={(s) => handleSelectSession(s)}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <header className="chat-header">
              <div>
                <p className="eyebrow">Live support</p>
                <h1>AI assistant chat</h1>
              </div>
              <span className="status-pill">Online</span>
            </header>

            <div className="message-list">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`message-row ${message.role === 'user' ? 'user' : 'assistant'}`}
                >
                  <div className="message-bubble">{message.content}</div>
                </div>
              ))}

              {isTyping ? (
                <div className="message-row assistant">
                  <div className="message-bubble typing" aria-live="polite">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : null}

              <div ref={endOfMessagesRef} />
            </div>

            <div className="examples" aria-label="Suggested prompts">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="example-pill"
                  onClick={() => setDraft(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <form className="composer" onSubmit={handleSubmit}>
              <textarea
                aria-label="Message input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
              />
              <button type="submit" disabled={!draft.trim() || isTyping}>
                {isTyping ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
