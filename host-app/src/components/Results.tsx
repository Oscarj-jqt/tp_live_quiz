// ============================================================
// Results - Affichage des resultats d'une question
// A IMPLEMENTER : barres animees et bonne reponse
// ============================================================

import { useEffect, useState } from 'react'

interface ResultsProps {
  /** Index de la bonne reponse (0-3) */
  correctIndex: number
  /** Distribution des reponses [nb_choix_0, nb_choix_1, nb_choix_2, nb_choix_3] */
  distribution: number[]
  /** Texte des choix de reponse */
  choices: string[]
  /** Callback quand le host clique sur "Question suivante" */
  onNext: () => void
}

function Results({ correctIndex, distribution, choices, onNext }: ResultsProps) {
  const [widths, setWidths] = useState<number[]>([])
  const maxCount = Math.max(...distribution, 1)

  useEffect(() => {
    setTimeout(() => {
      setWidths(distribution.map(count => (count / maxCount) * 100))
    }, 50)
  }, [distribution, maxCount])

  return (
    <div className="phase-container">
      <div className="results-container">
        <h2>Resultats</h2>

        {choices.map((choice, i) => (
          <div key={i} className="result-item">
            <div className="result-label" style={{ color: i === correctIndex ? '#51cf66' : '#666' }}>
              <span>
                {choice}
                {i === correctIndex && ' ✓'}
              </span>
              <span>{distribution[i]}</span>
            </div>
            <div
              className={`result-bar ${i === correctIndex ? 'correct' : 'incorrect'}`}
              style={{ width: `${widths[i] || 0}%` }}
            />
          </div>
        ))}

        <button className="btn-primary" onClick={onNext} style={{ marginTop: '2rem' }}>
          Suivant
        </button>
      </div>
    </div>
  )
}

export default Results