/**
 * Assignment 2: Yatzy server
 * Serves the game page and the game API (Node.js + Express).
 */
const express = require('express');
const app = express();
const PORT = 3000;

// Serve the files in the "public" folder (the game page) to the browser
app.use(express.static('public'));

// Start the server
app.listen(PORT, function () {
  console.log('Yatzy server running at http://localhost:' + PORT);
});