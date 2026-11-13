/**
 * Assignment 2: Yatzy server
 * Serves the game page and the game API (Node.js + Express).
 * The game state lives here, on the server.
 */
const express = require('express');
const YatzyGame = require('./game/yatzyGame');

const app = express();
const PORT = 3000;

// Serve the files in the "public" folder (the game page) to the browser
app.use(express.static('public'));

// Read JSON sent by the page (needed later for POST requests like scoring)
app.use(express.json());

// The one game, stored on the server
const game = new YatzyGame();

// ===== API endpoints =====

// GET /api/game: send the current game state
app.get('/api/game', function (req, res) {
  res.json(game.getState());
});

// POST /api/roll: roll the dice that aren't held
app.post('/api/roll', function (req, res) {
  if (!game.roll()) {
    return res.status(400).json({ error: 'Cannot roll: no rolls left, or the game is over.' });
  }
  res.json(game.getState());
});

// PUT /api/dice/:index/hold: hold a die, or let it go (index 0 to 4)
app.put('/api/dice/:index/hold', function (req, res) {
  const index = Number(req.params.index);  // "2" from the address becomes the number 2
  if (!game.toggleHold(index)) {
    return res.status(400).json({ error: 'Cannot hold that die: roll first, and use an index from 0 to 4.' });
  }
  res.json(game.getState());
});

// POST /api/score: score the dice in a category, then start the next turn
// The page sends JSON like { "category": "sixes" }
app.post('/api/score', function (req, res) {
  const category = req.body && req.body.category;  // undefined if nothing was sent
  const points = game.endTurn(category);
  if (points === null) {
    return res.status(400).json({ error: 'Cannot score there: roll first, and pick an open category.' });
  }
  res.json(game.getState());
});

// Start the server
app.listen(PORT, function () {
  console.log('Yatzy server running at http://localhost:' + PORT);
});