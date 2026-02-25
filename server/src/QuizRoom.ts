// ============================================================
// QuizRoom - Logique d'une salle de quiz
// A IMPLEMENTER : remplir le corps de chaque methode
// ============================================================

import WebSocket from 'ws'
import type { QuizQuestion, QuizPhase, ServerMessage } from '../../packages/shared-types'
import { send, broadcast } from './utils'

/** Represente un joueur connecte */
interface Player {
  id: string
  name: string
  ws: WebSocket
}

export class QuizRoom {
  /** Identifiant unique de la salle */
  readonly id: string

  /** Code a 6 caracteres que les joueurs utilisent pour rejoindre */
  readonly code: string

  /** Phase actuelle du quiz */
  phase: QuizPhase = 'lobby'

  /** WebSocket du host (presentateur) */
  hostWs: WebSocket | null = null

  /** Map des joueurs : playerId -> Player */
  players: Map<string, Player> = new Map()

  /** Liste des questions du quiz */
  questions: QuizQuestion[] = []

  /** Titre du quiz */
  title: string = ''

  /** Index de la question en cours (0-based) */
  currentQuestionIndex: number = -1

  /** Map des reponses pour la question en cours : playerId -> choiceIndex */
  answers: Map<string, number> = new Map()

  /** Map des scores cumules : playerId -> score total */
  scores: Map<string, number> = new Map()

  /** Timer ID pour le compte a rebours (pour pouvoir l'annuler) */
  timerId: ReturnType<typeof setInterval> | null = null

  /** Temps restant pour la question en cours */
  remaining: number = 0

  constructor(id: string, code: string) {
    this.id = id
    this.code = code
  }

  /**
   * Ajoute un joueur a la salle.
   * - Creer un objet Player avec un ID unique
   * - L'ajouter a this.players
   * - Initialiser son score a 0 dans this.scores
   * - Envoyer un message 'joined' a TOUS les clients (host + players)
   *   avec la liste des noms de joueurs
   * @returns l'ID du joueur cree
   */
  addPlayer(name: string, ws: WebSocket): string {
    // TODO: Generer un ID unique (ex: crypto.randomUUID() ou Math.random())
    const playerId = Math.random().toString(36).substring(2, 10)
    // TODO: Creer le Player et l'ajouter a this.players
    const player: Player = { id: playerId, name, ws }
    this.players.set(playerId, player)
    // TODO: Initialiser le score a 0
    this.scores.set(playerId, 0)
    // TODO: Envoyer 'joined' a tous les clients
    // On va Utiliser directement broadcast() pour les joueurs + send pour le host
    const playerNames = Array.from(this.players.values()).map(p => p.name)
    broadcast(this.getPlayerWsList(), { type: 'joined', playerId, players: playerNames })
    // TODO: Retourner l'ID du joueur
    return playerId
  }

  /**
   * Demarre le quiz.
   * - Verifier qu'on est en phase 'lobby'
   * - Verifier qu'il y a au moins 1 joueur
   * - Passer a la premiere question en appelant nextQuestion()
   */
  start(): void {
    // TODO: Verifier la phase et le nombre de joueurs
    if (this.phase !== 'lobby') {
      throw new Error('Le quiz ne peut être démarré que depuis le lobby')
    }
    // vérifier qu'il y a au moins 1 joueur
    if (this.players.size === 0) {
      throw new Error('Il doit y avoir au moins un joueur pour démarrer le quiz')
    }
    // TODO: Appeler nextQuestion()
    this.nextQuestion()
  }

  /**
   * Passe a la question suivante.
   * - Annuler le timer precedent s'il existe
   * - Incrementer currentQuestionIndex
   * - Si on a depasse la derniere question, appeler broadcastLeaderboard() et return
   * - Vider la map answers
   * - Passer en phase 'question'
   * - Appeler broadcastQuestion()
   * - Demarrer le timer (setInterval toutes les secondes)
   *   qui decremente remaining et envoie un 'tick' a tous
   *   Quand remaining atteint 0, appeler timeUp()
   */
  nextQuestion(): void {
    // TODO: Annuler le timer existant (clearInterval)
    if (this.timerId) {
      clearInterval(this.timerId)
    }
    // TODO: Incrementer l'index
    this.currentQuestionIndex++
    // TODO: Verifier si le quiz est termine
    if (this.currentQuestionIndex >= this.questions.length) {
      this.broadcastLeaderboard()
      return
    }
    // TODO: Reinitialiser answers
    this.answers.clear()
    // TODO: Changer la phase
    this.phase = 'question'
    // TODO: Envoyer la question
    this.broadcastQuestion()
    // TODO: Demarrer le compte a rebours
    const currentQuestion = this.questions[this.currentQuestionIndex]
    this.remaining = currentQuestion.timerSec
    this.timerId = setInterval(() => this.tick(), 1000) 
  }

  /**
   * Traite la reponse d'un joueur.
   * - Verifier qu'on est en phase 'question'
   * - Verifier que le joueur n'a pas deja repondu
   * - Enregistrer la reponse dans this.answers
   * - Si la reponse est correcte, calculer et ajouter les points :
   *   score = 1000 + Math.round(500 * (this.remaining / question.timerSec))
   * - Si tous les joueurs ont repondu, appeler timeUp() immediatement
   */
  handleAnswer(playerId: string, choiceIndex: number): void {
    // TODO: Verifier la phase
    if (this.phase !== 'question') {
      throw new Error('Les réponses ne sont acceptées que pendant la phase de question')
    }
    // TODO: Verifier que le joueur n'a pas deja repondu
    if (this.answers.has(playerId)) {
      throw new Error('Ce joueur a déjà répondu à cette question')
    }
    // TODO: Enregistrer la reponse
    this.answers.set(playerId, choiceIndex)
    // TODO: Calculer le score si correct
    const currentQuestion = this.questions[this.currentQuestionIndex]
    if (choiceIndex === currentQuestion.correctIndex) {
      const score = 1000 + Math.round(500 * (this.remaining / currentQuestion.timerSec))
      this.scores.set(playerId, (this.scores.get(playerId) || 0) + score)
    }
    // TODO: Si tout le monde a repondu, terminer la question
    if (this.answers.size === this.players.size) {
      this.timeUp()
    }
  }

  /**
   * Appelee toutes les secondes par le timer.
   * - Decrementer this.remaining
   * - Envoyer un 'tick' a tous les clients avec le temps restant
   * - Si remaining <= 0, appeler timeUp()
   */
  private tick(): void {
    // TODO: Decrementer remaining
    this.remaining--
    // TODO: Envoyer 'tick' a tous
    broadcast(this.getPlayerWsList(), { type: 'tick', remaining: this.remaining })
    // TODO: Si temps ecoule, appeler timeUp()
    if (this.remaining <= 0) {
      this.timeUp()
    }
  }

  /**
   * Appelee quand le temps est ecoule (ou que tout le monde a repondu).
   * - Annuler le timer
   * - Passer en phase 'results'
   * - Appeler broadcastResults()
   */
  private timeUp(): void {
    // TODO: Annuler le timer
    // TODO: Changer la phase
    // TODO: Envoyer les resultats
  }

  /**
   * Retourne la liste de tous les WebSocket des joueurs.
   * Utile pour broadcast.
   */
  private getPlayerWsList(): WebSocket[] {
    // TODO: Extraire les ws de this.players.values()
    return []
  }

  /**
   * Envoie un message a tous les clients : host + tous les joueurs.
   */
  private broadcastToAll(message: ServerMessage): void {
    // TODO: Envoyer au host si connecte
    // TODO: Envoyer a tous les joueurs via broadcast()
  }

  /**
   * Envoie la question en cours a tous les clients.
   * IMPORTANT : ne pas envoyer correctIndex aux clients !
   * Le message 'question' contient : question (sans correctIndex), index, total
   */
  private broadcastQuestion(): void {
    // TODO: Recuperer la question courante
    // TODO: Creer l'objet question SANS correctIndex (utiliser destructuring)
    // TODO: Envoyer a tous via broadcastToAll()
  }

  /**
   * Envoie les resultats de la question en cours.
   * - correctIndex : l'index de la bonne reponse
   * - distribution : tableau du nombre de reponses par choix [0, 5, 2, 1]
   * - scores : objet { nomJoueur: scoreTotal } pour tous les joueurs
   */
  private broadcastResults(): void {
    // TODO: Recuperer la question courante
    // TODO: Calculer la distribution des reponses
    // TODO: Construire l'objet scores { nom: score }
    // TODO: Envoyer 'results' a tous
  }

  /**
   * Envoie le classement final.
   * - Trier les joueurs par score decroissant
   * - Envoyer un message 'leaderboard' avec rankings: { name, score }[]
   * - Passer en phase 'leaderboard'
   */
  broadcastLeaderboard(): void {
    // TODO: Construire le tableau rankings trie par score decroissant
    // TODO: Changer la phase
    // TODO: Envoyer 'leaderboard' a tous
  }

  /**
   * Termine le quiz.
   * - Annuler le timer
   * - Passer en phase 'ended'
   * - Envoyer 'ended' a tous les clients
   */
  end(): void {
    // TODO: Annuler le timer
    // TODO: Changer la phase
    // TODO: Envoyer 'ended' a tous
  }
}