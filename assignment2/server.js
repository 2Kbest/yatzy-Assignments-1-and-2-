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

// Start the server
app.listen(PORT, function () {
  console.log('Yatzy server running at http://localhost:' + PORT);
});