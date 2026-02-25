export interface QuizQuestion {
  id: string
  text: string
  choices: string[]
  correctIndex: number
  timerSec: number
}

/** Les differentes phases d'un quiz */
export type QuizPhase = 'lobby' | 'question' | 'results' | 'leaderboard' | 'ended'

/** Messages envoyes par les clients (host ou player) vers le serveur */
export type ClientMessage =
  | { type: 'join'; quizCode: string; name: string }
  | { type: 'answer'; questionId: string; choiceIndex: number }
  | { type: 'host:create'; title: string; questions: QuizQuestion[] }
  | { type: 'host:start' }
  | { type: 'host:next' }
  | { type: 'host:end' }

/** Messages envoyes par le serveur vers les clients */
export type ServerMessage =
  | { type: 'joined'; playerId: string; players: string[] }
  | { type: 'question'; question: Omit<QuizQuestion, 'correctIndex'>; index: number; total: number }
  | { type: 'tick'; remaining: number }
  | { type: 'results'; correctIndex: number; distribution: number[]; scores: Record<string, number> }
  | { type: 'leaderboard'; rankings: { name: string; score: number }[] }
  | { type: 'ended' }
  | { type: 'error'; message: string }
  | { type: 'sync'; phase: QuizPhase; data: unknown }