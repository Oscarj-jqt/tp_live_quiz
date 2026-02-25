// ============================================================
// JoinScreen - Formulaire pour rejoindre un quiz
// A IMPLEMENTER : champs code et nom, bouton rejoindre
// ============================================================

import { useState } from 'react'

interface JoinScreenProps {
  /** Callback appele quand le joueur soumet le formulaire */
  onJoin: (code: string, name: string) => void
  /** Message d'erreur optionnel (ex: "Code invalide") */
  error?: string
}

/**
 * Composant formulaire pour rejoindre un quiz existant.
 *
 * Ce qu'il faut implementer :
 * - Un champ pour le code du quiz (6 caracteres, majuscules)
 *   avec la classe .code-input pour le style monospace
 * - Un champ pour le pseudo du joueur
 * - Un bouton "Rejoindre" (classe .btn-primary)
 * - Afficher le message d'erreur s'il existe (classe .error-message)
 * - Valider que les deux champs ne sont pas vides avant d'appeler onJoin
 *
 * Classes CSS disponibles : .join-form, .form-group, .code-input,
 * .error-message, .btn-primary
 */
function JoinScreen({ onJoin, error }: JoinScreenProps) {
  // TODO: State pour le code du quiz
  const [code, setCode] = useState('')
  // TODO: State pour le pseudo
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Valider que les champs ne sont pas vides
    if (!code.trim() || !name.trim()) return
    // TODO: Appeler onJoin(code.toUpperCase(), name)
    onJoin(code.toUpperCase(), name.trim())
  }

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <h1>Rejoindre un Quiz</h1>
      {/* TODO: Afficher l'erreur si elle existe */}
      {error && <div className="error-message">{error}</div>}
      {/* TODO: Champ code du quiz avec classe .code-input */}
      <div className="form-group">
        <label>Code du quiz</label>
        <input
          className="code-input"
          type="text"
          placeholder="ABC123"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </div>
      {/* TODO: Champ pseudo */}
      <div className="form-group">
        <label>Pseudo</label>
        <input
          type="text"
          placeholder="Ton pseudo"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      {/* TODO: Bouton Rejoindre */}
      <button className="btn-primary" type="submit" disabled={!code.trim() || !name.trim()}>
        Rejoindre
      </button>
    </form>
  )
}

export default JoinScreen