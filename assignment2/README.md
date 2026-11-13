# Yatzy – CST3106 Assignment 2

Single-player Yatzy game, upgraded from Assignment 1 to a **client-server** app
with **Node.js** and **Express**. The server stores the game state and runs all
the game logic (dice, scoring, turns). The page only shows the game and sends
the player's actions to the server with the **Fetch API**.

Author: Rouvier Mervius

## Server setup

1. Install [Node.js](https://nodejs.org) (includes npm).
2. Open a terminal in the `assignment2` folder.
3. Install the packages listed in `package.json` (Express):
   ```
   npm install
   ```
4. Start the server:
   ```
   node server.js
   ```
   You should see: `Yatzy server running at http://localhost:3000`
5. Open **http://localhost:3000** in a browser and play.

> Open the game through the server (localhost:3000), not with Live Server,
> because the page needs the server's API.

## How to play

1. Click **Roll dice** (up to 3 rolls per turn).
2. Click a die to **hold** it. Held dice keep their value when you roll again.
3. Click a box in the **scorecard** to pick it. Open boxes show what your dice would score.
4. Click **End turn** to lock in the score.
5. The game ends after 15 turns (one per box), or when you click **End game**.
   **New game** starts over.

Scoring follows the Yatzy rules from Assignment 1 (upper section with a 50-point
bonus at 63+, pairs, three/four of a kind, straights, full house, chance, Yatzy).
Any open box can be picked; if the dice don't fit, it scores 0.

## Project structure

```
assignment2/
├── server.js          Express server: serves the page and the game API
├── package.json       Project info and dependencies (Express)
├── game/              Server side: the game logic
│   ├── dice.js          Dice class: rolls dice, remembers held dice
│   ├── yatzyEngine.js   YatzyEngine class: scoring rules, totals, bonus
│   └── yatzyGame.js     YatzyGame class: rounds, rolls, turns, game state
└── public/            Client side: sent to the browser
    ├── index.html       Page layout
    ├── style.css        Styling
    └── main.js          Calls the API with fetch and draws the game
```

## How it works

1. The page asks the server for something, for example `POST /api/roll`.
2. The server updates the game it keeps in memory (`game.roll()`).
3. The server answers with the whole **game state** as JSON.
4. The page redraws the dice, scorecard and buttons from that state.

If the server can't be reached, the page shows
"Could not reach the server. Is it running?" instead of crashing. If the server
refuses an action (for example, rolling after 3 rolls), it answers with
status **400** and an error message, which the page displays.

## API endpoints

All endpoints answer with the game state as JSON (see below), or with status
`400` and `{ "error": "..." }` when the action isn't allowed.

| Action | Method | URL | Body | Refused (400) when |
|---|---|---|---|---|
| Get the game | `GET` | `/api/game` | — | — |
| Roll the dice | `POST` | `/api/roll` | — | no rolls left, or game over |
| Hold / release a die | `PUT` | `/api/dice/:index/hold` | — | no roll yet, game over, or index not 0–4 |
| Score a box (ends the turn) | `POST` | `/api/score` | `{ "category": "sixes" }` | no roll yet, box already used, or unknown box |
| End the game | `POST` | `/api/end-game` | — | game already over |
| New game | `DELETE` | `/api/game` | — | — |

Category names: `ones`, `twos`, `threes`, `fours`, `fives`, `sixes`,
`onePair`, `twoPairs`, `threeOfAKind`, `fourOfAKind`, `smallStraight`,
`largeStraight`, `fullHouse`, `chance`, `yatzy`.

### Example: game state

```json
{
  "dice": [5, 5, 4, 2, 4],
  "held": [true, true, false, false, false],
  "rollsLeft": 1,
  "currentRound": 2,
  "maxRounds": 15,
  "scoreTable": { "ones": null, "twos": null, "chance": 20, "...": null },
  "upperTotal": 0,
  "bonus": 0,
  "totalScore": 20,
  "previews": { "fives": 10, "fours": 8, "twoPairs": 18, "...": 0 },
  "gameOver": false
}
```

- `null` in `scoreTable` means the box is still open.
- `previews` shows what each open box would score with the current dice
  (only after a roll).

### Example: scoring a box

```
POST http://localhost:3000/api/score
Content-Type: application/json

{ "category": "chance" }
```

## Testing

- Every endpoint was tested in **Postman** (collection "Yatzy Assignment 2 API",
  variable `baseUrl = http://localhost:3000`), including the error cases:
  rolling a 4th time, holding before rolling, holding die 7, scoring a used
  box, scoring "banana", and ending a game twice.
- Full games were played in the browser through the server: holding, scoring,
  scratching (0 points), the turn counter, automatic game over after 15 turns,
  End game, New game, and the "server not running" message.
- Refreshing the page keeps the game, because the state lives on the server.

## Notes

- The server keeps **one game in memory**. Restarting the server starts a new
  game, and every browser tab shares the same game.
- Built with: Node.js, npm, Express, JavaScript (classes, async/await, Fetch API),
  HTML and CSS.