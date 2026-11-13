/**
 * main.js (CST3106 Assignment 2)
 * The page side of the Yatzy game. It runs no game logic:
 * every button asks the server (with fetch), and the page is
 * redrawn from the game state the server sends back.
 */

// Which pip spots to fill for each die value (matches the pip classes in style.css)
const PIP_LAYOUTS = {
  1: ['center'],
  2: ['top-left', 'bottom-right'],
  3: ['top-left', 'center', 'bottom-right'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
};

const GOOD_SCORE = 150;       // a final score at or above this gets "Congratulations"

let state = null;             // the latest game state from the server
let selectedCategory = null;  // the box the player picked, waiting for End turn

// Page elements we update
const rollButton = document.getElementById('roll-button');
const endTurnButton = document.getElementById('end-turn-button');
const endGameButton = document.getElementById('end-game-button');
const newGameButton = document.getElementById('new-game-button');
const message = document.getElementById('message');
const rollsLeftText = document.getElementById('rolls-left');
const turnNumber = document.getElementById('turn-number');

// ===== Talking to the server =====

/**
 * Sends one request to the game API and returns the new game state.
 * @param {string} method - 'GET', 'POST', 'PUT' or 'DELETE'.
 * @param {string} url - The endpoint, for example '/api/roll'.
 * @param {object} [body] - Data to send as JSON (only used for scoring).
 * @returns {Promise<object>} The game state from the server.
 */
async function callApi(method, url, body) {
  const options = { method: method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };  // "the letter inside is JSON"
    options.body = JSON.stringify(body);                       // object → JSON text
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    // The server said no (400): pass its error message along
    throw new Error(data.error || 'Server error: ' + response.status);
  }
  return data;
}

/**
 * Runs one server request, saves the new state and redraws the page.
 * If anything goes wrong, shows a friendly message instead of crashing.
 * @returns {Promise<boolean>} true if it worked, otherwise false.
 */
async function update(method, url, body) {
  try {
    state = await callApi(method, url, body);
    updateDisplay();
    return true;
  } catch (error) {
    console.error(error);
    if (error instanceof TypeError) {
      // fetch throws a TypeError when it can't reach the server at all
      message.textContent = 'Could not reach the server. Is it running?';
    } else {
      message.textContent = error.message;  // the server's own explanation
    }
    return false;
  }
}

// ===== Drawing the page from the state =====

/**
 * Draws one die: its pips, its gold "held" frame, and its label.
 * @param {number} index - Which die, from 0 to 4.
 */
function drawDie(index) {
  const dieButton = document.getElementById('die-' + index);
  const label = document.getElementById('die-label-' + index);
  const value = state.dice[index];
  const held = state.held[index];

  // Pips: remove the old ones, then add one <span> per pip
  dieButton.innerHTML = '';
  if (value > 0) {
    const positions = PIP_LAYOUTS[value];
    for (let p = 0; p < positions.length; p++) {
      const pip = document.createElement('span');
      pip.className = 'pip ' + positions[p];
      dieButton.appendChild(pip);
    }
  }

  // Held or not: gold frame and label text
  if (held) {
    dieButton.classList.add('held');
    label.classList.add('held-label');
    label.textContent = 'HELD';
  } else {
    dieButton.classList.remove('held');
    label.classList.remove('held-label');
    label.textContent = value > 0 ? 'TAP TO HOLD' : '';
  }

  // For screen readers, for example "Die 1 showing 5, held"
  dieButton.setAttribute('aria-pressed', held);
  dieButton.setAttribute('aria-label',
    'Die ' + (index + 1) + (value > 0 ? ' showing ' + value : '') + (held ? ', held' : ''));
}

/**
 * Draws the scorecard: used boxes in bold, open boxes as preview buttons, then the totals.
 */
function drawScorecard() {
  const categories = Object.keys(state.scoreTable);
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const cell = document.getElementById('score-' + category);
    const score = state.scoreTable[category];
    const preview = state.previews[category];  // undefined if this box can't be picked now

    if (score !== null) {
      // Already used: show the score in bold
      cell.innerHTML = '<span class="filled-score">' + score + '</span>';
    } else if (preview === undefined) {
      // No roll yet this turn (or game over): nothing to preview
      cell.innerHTML = '';
    } else {
      // Open: show what the current dice would score here (calculated by the server)
      let classes = 'score-option';
      if (preview === 0) {
        classes += ' zero';
      }
      if (category === selectedCategory) {
        classes += ' selected';   // gold ring on the box the player picked
      }
      const text = preview > 0 ? '+' + preview : '0';
      cell.innerHTML = '<button class="' + classes + '">' + text + '</button>';
    }
  }

  // Totals, calculated by the server
  document.getElementById('upper-total').textContent = state.upperTotal + ' / 63';
  document.getElementById('bonus').textContent = state.bonus;
  document.getElementById('total-score').textContent = state.totalScore;
}

/**
 * Redraws everything: dice, counters, buttons and the scorecard.
 */
function updateDisplay() {
  for (let i = 0; i < state.dice.length; i++) {
    drawDie(i);
  }
  rollsLeftText.textContent = 'Rolls left: ' + state.rollsLeft;
  turnNumber.textContent = state.currentRound;

  // Buttons only work when they make sense
  rollButton.disabled = state.gameOver || state.rollsLeft === 0;
  endTurnButton.disabled = state.gameOver || selectedCategory === null;
  endGameButton.disabled = state.gameOver;

  drawScorecard();
}

/**
 * Shows the final score with a congratulating or consoling message.
 */
function showGameOver() {
  let text = 'Game over! Final score: ' + state.totalScore + '. ';
  if (state.totalScore >= GOOD_SCORE) {
    text += 'Congratulations, great game!';
  } else {
    text += 'Tough luck this time. Click New game to try again!';
  }
  message.textContent = text;
}

/**
 * Picks a scorecard box. Nothing is sent to the server until End turn.
 * @param {string} category - The category name, for example "fives".
 */
function selectCategory(category) {
  if (state === null || state.previews[category] === undefined) {
    message.textContent = 'Roll the dice first, then pick an open box.';
    return;
  }
  selectedCategory = category;
  message.textContent = 'Selected: ' + state.previews[category] + ' points. Click End turn to confirm, or pick another box.';
  updateDisplay();
}

// ===== Buttons =====

// Roll: POST /api/roll
rollButton.addEventListener('click', async function () {
  selectedCategory = null;  // the dice will change, so the player picks again
  if (await update('POST', '/api/roll')) {
    if (state.rollsLeft > 0) {
      message.textContent = 'Hold dice and roll again, or pick a box in the scorecard.';
    } else {
      message.textContent = 'No rolls left. Pick a box in the scorecard.';
    }
  }
});

// Dice: PUT /api/dice/:index/hold (the server decides whether it's allowed)
for (let i = 0; i < 5; i++) {
  document.getElementById('die-' + i).addEventListener('click', async function () {
    await update('PUT', '/api/dice/' + i + '/hold');
  });
}

// End turn: POST /api/score with the picked box
endTurnButton.addEventListener('click', async function () {
  if (selectedCategory === null) {
    message.textContent = 'Pick a box in the scorecard first.';
    return;
  }
  const category = selectedCategory;
  const points = state.previews[category];
  selectedCategory = null;

  if (await update('POST', '/api/score', { category: category })) {
    if (state.gameOver) {
      showGameOver();
    } else {
      message.textContent = 'You scored ' + points + ' points. Roll the dice for turn ' + state.currentRound + '.';
    }
  }
});

// End game: POST /api/end-game
endGameButton.addEventListener('click', async function () {
  selectedCategory = null;
  if (await update('POST', '/api/end-game')) {
    showGameOver();
  }
});

// New game: DELETE /api/game
newGameButton.addEventListener('click', async function () {
  selectedCategory = null;
  if (await update('DELETE', '/api/game')) {
    message.textContent = 'New game! Roll the dice to start your turn.';
  }
});

/**
 * Starts the page: gets the game from the server, then makes the score boxes clickable.
 */
async function start() {
  if (!(await update('GET', '/api/game'))) {
    return;  // server not reachable: the message already says so
  }
  
  // Show a message that matches the game we got back (useful after a refresh)
  if (state.gameOver) {
    showGameOver();
  } else if (Object.keys(state.previews).length > 0) {
    message.textContent = 'Welcome back! Hold dice and roll again, or pick a box in the scorecard.';
  }
  const categoryNames = Object.keys(state.scoreTable);
  for (let i = 0; i < categoryNames.length; i++) {
    const category = categoryNames[i];
    document.getElementById('score-' + category).addEventListener('click', function () {
      selectCategory(category);
    });
  }
}

start();