quiz-app/
├── packages/
│ └── shared-types/ # Types TypeScript partages (COMPLET)
├── server/ # Serveur WebSocket Node.js
│ └── src/
│ ├── utils.ts # Utilitaires d'envoi WS (COMPLET)
│ ├── QuizRoom.ts # Logique d'une salle de quiz (A IMPLEMENTER)
│ └── index.ts # Point d'entree du serveur (A IMPLEMENTER)
├── host-app/ # Application React pour le presentateur
│ └── src/
│ ├── hooks/
│ │ └── useWebSocket.ts # Hook WebSocket (COMPLET)
│ ├── App.tsx # Routeur principal (A IMPLEMENTER)
│ ├── App.css # Styles (COMPLET)
│ └── components/ # Composants UI (A IMPLEMENTER)
│ ├── CreateQuiz.tsx
│ ├── Lobby.tsx
│ ├── QuestionView.tsx
│ ├── Results.tsx
│ └── Leaderboard.tsx
└── player-app/ # Application React pour les joueurs
└── src/
├── hooks/
│ └── useWebSocket.ts # Hook WebSocket (COMPLET)
├── App.tsx # Routeur principal (A IMPLEMENTER)
├── App.css # Styles (COMPLET)
└── components/ # Composants UI (A IMPLEMENTER)
├── JoinScreen.tsx
├── WaitingLobby.tsx
├── AnswerScreen.tsx
├── FeedbackScreen.tsx
└── ScoreScreen.tsx
