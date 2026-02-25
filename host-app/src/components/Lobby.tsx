// ============================================================
// Lobby - Salle d'attente avant le quiz
// A IMPLEMENTER : affichage du code et liste des joueurs
// ============================================================

interface LobbyProps {
  /** Code du quiz a afficher pour que les joueurs rejoignent */
  code: string
  /** Liste des noms de joueurs connectes */
  players: string[]
  /** Callback quand le host clique sur "Demarrer" */
  onStart: () => void
}

/**
 * Composant salle d'attente affiche cote host.
 *
 * Ce qu'il faut implementer :
 * - Le code du quiz affiche en grand (classe .quiz-code) avec le label "Code du quiz"
 * - Le nombre de joueurs connectes
 * - La liste des joueurs (puces avec classe .player-chip dans un .player-list)
 * - Un bouton "Demarrer le quiz" (classe .btn-start)
 *   desactive s'il n'y a aucun joueur
 *
 * Classes CSS disponibles : .phase-container, .quiz-code-label, .quiz-code,
 * .player-count, .player-list, .player-chip, .btn-start
 */
function Lobby({ code, players, onStart }: LobbyProps) {
  return (
    <div className="phase-container">
      <h2>Code du quiz</h2>
      <div className="quiz-code">{code || '****'}</div>

      <div className="players-list">
        <h3>Joueurs connectes ({players.length})</h3>
        {players.length === 0 ? (
          <p>En attente de joueurs...</p>
        ) : (
          players.map((name, i) => (
            <div key={i} className="player-item">
              {name}
            </div>
          ))
        )}
      </div>

      <button className="btn-start" onClick={onStart} disabled={players.length === 0}>
        Demarrer
      </button>
    </div>
  )
}

export default Lobby