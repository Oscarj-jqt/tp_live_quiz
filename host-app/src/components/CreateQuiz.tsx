// ============================================================
// CreateQuiz - Formulaire de creation d'un quiz
// A IMPLEMENTER : construire le formulaire dynamique
// ============================================================

import { useState } from 'react'
import type { QuizQuestion } from '@shared/index'

interface CreateQuizProps {
  /** Callback appele quand le formulaire est soumis */
  onSubmit: (title: string, questions: QuizQuestion[]) => void
}

/**
 * Composant formulaire pour creer un nouveau quiz.
 *
 * Ce qu'il faut implementer :
 * - Un champ pour le titre du quiz
 * - Une liste dynamique de questions (pouvoir en ajouter/supprimer)
 * - Pour chaque question :
 *   - Un champ texte pour la question
 *   - 4 champs texte pour les choix de reponse
 *   - Un selecteur (radio) pour la bonne reponse (correctIndex)
 *   - Un champ pour la duree du timer en secondes
 * - Un bouton pour ajouter une question
 * - Un bouton pour soumettre le formulaire
 *
 * Astuce : utilisez un state pour stocker un tableau de questions
 * et generez un id unique pour chaque question (ex: crypto.randomUUID())
 *
 * Classes CSS disponibles : .create-form, .form-group, .question-card,
 * .question-card-header, .choices-inputs, .choice-input-group,
 * .btn-add-question, .btn-remove, .btn-primary
 */
function CreateQuiz({ onSubmit }: CreateQuizProps) {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: '',
        choices: ['', '', '', ''],
        correctIndex: 0,
        timerSec: 30,
      },
    ])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, [field]: value } : q))
    )
  }

  const updateChoice = (id: string, idx: number, value: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === id) {
          const choices = [...q.choices]
          choices[idx] = value
          return { ...q, choices }
        }
        return q
      })
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Titre requis')
      return
    }
    if (questions.length === 0) {
      alert('Au moins une question requise')
      return
    }
    if (questions.some(q => !q.text.trim() || q.choices.some(c => !c.trim()))) {
      alert('Remplissez tous les champs')
      return
    }
    onSubmit(title, questions)
  }

  return (
    <div className="phase-container">
      <h1>Creer un Quiz</h1>
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {questions.map((q, i) => (
          <div key={q.id} className="question-card">
            <div className="question-card-header">
              <h3>Question {i + 1}</h3>
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeQuestion(q.id)}
              >
                Supprimer
              </button>
            </div>

            <div className="form-group">
              <label htmlFor={`text-${q.id}`}>Texte</label>
              <textarea
                id={`text-${q.id}`}
                value={q.text}
                onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                rows={2}
              />
            </div>

            <div className="choices-inputs">
              {q.choices.map((choice, idx) => (
                <div key={idx} className="choice-input-group">
                  <input
                    type="radio"
                    id={`radio-${q.id}-${idx}`}
                    name={`correct-${q.id}`}
                    checked={q.correctIndex === idx}
                    onChange={() => updateQuestion(q.id, 'correctIndex', idx)}
                  />
                  <label htmlFor={`radio-${q.id}-${idx}`}>Choix {idx + 1}</label>
                  <input
                    type="text"
                    value={choice}
                    onChange={e => updateChoice(q.id, idx, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor={`timer-${q.id}`}>Durée (s)</label>
              <input
                id={`timer-${q.id}`}
                type="number"
                min="1"
                value={q.timerSec}
                onChange={e =>
                  updateQuestion(q.id, 'timerSec', Math.max(1, +e.target.value || 0))
                }
              />
            </div>
          </div>
        ))}

        <button type="button" className="btn-add-question" onClick={addQuestion}>
          + Ajouter une question
        </button>
        <button type="submit" className="btn-primary">
          Creer
        </button>
      </form>
    </div>
  )
}

export default CreateQuiz