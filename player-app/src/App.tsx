import { useEffect, useState } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import type { ServerMessage } from '@shared/index'
import JoinScreen from './components/JoinScreen'
import WaitingLobby from './components/WaitingLobby'
import AnswerScreen from './components/AnswerScreen'
import FeedbackScreen from './components/FeedbackScreen'
import ScoreScreen from './components/ScoreScreen'

type Phase = 'join' | 'lobby' | 'question' | 'results' | 'leaderboard' | 'ended'

function App() {
  const { status, sendMessage, lastMessage } = useWebSocket('ws://localhost:3001')

  const [phase, setPhase] = useState<Phase>('join')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [error, setError] = useState<string | undefined>()
  const [question, setQuestion] = useState<{ id: number; text: string; choices: string[]; timerSec: number } | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [feedbackCorrect, setFeedbackCorrect] = useState(false)
  const [feedbackScore, setFeedbackScore] = useState(0)
  const [rankings, setRankings] = useState<{ name: string; score: number }[]>([])
  const [myScore, setMyScore] = useState(0)

  useEffect(() => {
    if (!lastMessage) return

    switch (lastMessage.type) {
      case 'joined':
        setPlayers(lastMessage.players)
        setPhase('lobby')
        setError(undefined)
        break

      case 'question':
        setQuestion({
          id: lastMessage.id,
          text: lastMessage.text,
          choices: lastMessage.choices,
          timerSec: lastMessage.timerSec,
        })
        setRemaining(lastMessage.timerSec)
        setHasAnswered(false)
        setPhase('question')
        break

      case 'tick':
        setRemaining(lastMessage.remaining)
        break

      case 'results': {
        const wasCorrect = lastMessage.correctIndex !== undefined
        setFeedbackCorrect(wasCorrect)
        setPhase('results')
        break
      }

      case 'leaderboard':
        setRankings(lastMessage.scores)
        const me = lastMessage.scores.find(s => s.name === playerName)
        if (me) setMyScore(me.score)
        setPhase('leaderboard')
        break

      case 'ended':
        setPhase('ended')
        break

      case 'error':
        setError(lastMessage.message)
        break

      case 'sync':
        setPlayers(lastMessage.state.players)
        if (lastMessage.state.currentQuestion) {
          setQuestion(lastMessage.state.currentQuestion)
        }
        if (lastMessage.state.remaining !== undefined) {
          setRemaining(lastMessage.state.remaining)
        }
        if (lastMessage.state.scores) {
          setRankings(lastMessage.state.scores)
        }
        if (lastMessage.state.phase === 'lobby') setPhase('lobby')
        else if (lastMessage.state.phase === 'question') setPhase('question')
        else if (lastMessage.state.phase === 'results') setPhase('results')
        else if (lastMessage.state.phase === 'leaderboard') setPhase('leaderboard')
        else if (lastMessage.state.phase === 'ended') setPhase('ended')
        break
    }
  }, [lastMessage])

  const handleJoin = (code: string, name: string) => {
    setPlayerName(name)
    sendMessage({ type: 'join', quizCode: code, name })
  }

  const handleAnswer = (choiceIndex: number) => {
    if (!question || hasAnswered) return
    setHasAnswered(true)
    sendMessage({ type: 'answer', questionId: question.id, choiceIndex })
  }

  const renderPhase = () => {
    switch (phase) {
      case 'join':
        return <JoinScreen onJoin={handleJoin} error={error} />

      case 'lobby':
        return <WaitingLobby players={players} />

      case 'question':
        if (!question) return null
        return (
          <AnswerScreen
            question={question}
            remaining={remaining}
            onAnswer={handleAnswer}
            hasAnswered={hasAnswered}
          />
        )

      case 'results':
        return <FeedbackScreen correct={feedbackCorrect} score={myScore} />

      case 'leaderboard':
        return <ScoreScreen rankings={rankings} playerName={playerName} />

      case 'ended':
        return (
          <div className="phase-container">
            <h1>Quiz termine !</h1>
            <p className="ended-message">Merci d'avoir participe</p>
            <ScoreScreen rankings={rankings} playerName={playerName} />
          </div>
        )
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h2>Quiz Player</h2>
        <span className={`status-badge status-${status}`}>{status}</span>
      </header>
      <main className="app-main">
        {renderPhase()}
      </main>
    </div>
  )
}

export default App
