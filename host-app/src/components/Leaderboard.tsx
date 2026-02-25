interface LeaderboardProps {
  rankings: { name: string; score: number }[]
}

export default function Leaderboard({ rankings }: LeaderboardProps) {
  return (
    <div className="phase-container">
      <h2 className="leaderboard-title">Classement</h2>
      <div className="leaderboard">
        {rankings.map((player, i) => (
          <div key={i} className="leaderboard-item">
            <div className="leaderboard-rank">{i + 1}</div>
            <div className="leaderboard-name">{player.name}</div>
            <div className="leaderboard-score">{player.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
