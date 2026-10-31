/**
 * main.js (CST3106 Assignment 1)
 * Connects the game to the page: draws the dice and the scorecard,
 * and handles the buttons. The game state lives in YatzyGame.
 */

// Which pip spots to fill for each die value.
// The names match the pip classes in style.css (from the Lab 5 design).
const PIP_LAYOUTS = {
  1: ['center'],
  2: ['top-left', 'bottom-right'],
  3: ['top-left', 'center', 'bottom-right'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
};

const GOOD_SCORE = 150;       // a final score at or above this gets "Congratulations"

const game = new YatzyGame(); // dice, score table, round and rolls
let selectedCategory = null;  // the box the player picked, waiting for End turn

// Page elements we update
const rollButton = document.getElementById('roll-button');
const endTurnButton = document.getElementById('end-turn-button');
const endGameButton = document.getElementById('end-game-button');
const newGameButton = document.getElementById('new-game-button');
const message = document.getElementById('message');
const rollsLeftText = document.getElementById('rolls-left');
const turnNumber = document.getElementById('turn-number');

/**
 * Draws one die on the page: its pips, its gold "held" frame, and its label.
 * @param {number} index - Which die, from 0 to 4.
 */
function drawDie(index) {
  const dieButton = document.getElementById('die-' + index);
  const label = document.getElementById('die-label-' + index);
  const value = game.dice.values[index];
  const held = game.dice.held[index];

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
 * Draws the scorecard.
 * Used boxes show their score in bold. Open boxes show a button with
 * what the current dice would score there. Then the totals are updated.
 */
function drawScorecard() {
  const categories = Object.keys(game.engine.scoreTable);
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const cell = document.getElementById('score-' + category);
    const score = game.engine.scoreTable[category];

    if (score !== null) {
      // Already used: show the score in bold
      cell.innerHTML = '<span class="filled-score">' + score + '</span>';
    } else if (!game.hasRolled() || game.gameOver) {
      // No roll yet this turn (or game over): nothing to preview
      cell.innerHTML = '';
    } else {
      // Open: show what the current dice would score here
      const preview = game.engine.calculateScore(category, game.dice.values);
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

  // Totals (slide 14)
  document.getElementById('upper-total').textContent = game.engine.getUpperTotal() + ' / 63';
  document.getElementById('bonus').textContent = game.engine.getBonus();
  document.getElementById('total-score').textContent = game.engine.calculateTotalScore();
}

/**
 * Redraws everything: dice, counters, buttons and the scorecard.
 */
function updateDisplay() {
  for (let i = 0; i < game.dice.count; i++) {
    drawDie(i);
  }
  rollsLeftText.textContent = 'Rolls left: ' + game.rollsLeft;
  turnNumber.textContent = game.currentRound;

  // Buttons only work when they make sense
    // Buttons only work when they make sense
  rollButton.disabled = game.gameOver || game.rollsLeft === 0;
  endTurnButton.disabled = game.gameOver || selectedCategory === null;
  endGameButton.disabled = game.gameOver;

  drawScorecard();
}

/**
 * Picks a scorecard box. The score isn't locked in until End turn.
 * @param {string} category - The category name, for example "fives".
 */
function selectCategory(category) {
  if (game.gameOver) {
    return;
  }
  if (!game.hasRolled()) {
    message.textContent = 'Roll the dice first.';
    return;
  }
  if (!game.engine.isValidSelection(category)) {
    return;  // this box is already used
  }

  selectedCategory = category;
  const points = game.engine.calculateScore(category, game.dice.values);
  message.textContent = 'Selected: ' + points + ' points. Click End turn to confirm, or pick another box.';
  updateDisplay();
}

/**
 * Locks in the selected box and moves to the next turn (or ends the game).
 */
function endTurn() {
  if (selectedCategory === null) {
    message.textContent = 'Pick a box in the scorecard first.';
    return;
  }

  const points = game.endTurn(selectedCategory);
  selectedCategory = null;

  if (game.gameOver) {
    showGameOver();
  } else {
    message.textContent = 'You scored ' + points + ' points. Roll the dice for turn ' + game.currentRound + '.';
  }
  updateDisplay();
}

/**
 * Shows the final score with a congratulating or consoling message.
 */
function showGameOver() {
  let text = 'Game over! Final score: ' + game.totalScore + '. ';
  if (game.totalScore >= GOOD_SCORE) {
    text += 'Congratulations, great game!';
  } else {
    text += 'Tough luck this time. Click New game to try again!';
  }
  message.textContent = text;
}

// Event listener: Roll button
rollButton.addEventListener('click', function () {
  if (!game.roll()) {
    return;  // no rolls left, or the game is over
  }
  selectedCategory = null;  // the dice changed, so the player picks again

  if (game.rollsLeft > 0) {
    message.textContent = 'Hold dice and roll again, or pick a box in the scorecard.';
  } else {
    message.textContent = 'No rolls left. Pick a box in the scorecard.';
  }
  updateDisplay();
});

// Event listeners: clicking a die holds it (or lets it go)
for (let i = 0; i < game.dice.count; i++) {
  document.getElementById('die-' + i).addEventListener('click', function () {
    if (game.gameOver) {
      return;
    }
    if (!game.hasRolled()) {
      message.textContent = 'Roll the dice first.';
      return;  // nothing to hold before the first roll
    }
    game.dice.toggleHold(i);
    drawDie(i);
  });
}

// Event listeners: clicking a box in the scorecard selects it
const categoryNames = Object.keys(game.engine.scoreTable);
for (let i = 0; i < categoryNames.length; i++) {
  const category = categoryNames[i];
  document.getElementById('score-' + category).addEventListener('click', function () {
    selectCategory(category);
  });
}

// Event listener: End turn button locks in the selected box
endTurnButton.addEventListener('click', endTurn);

// Event listener: End game button stops the game early (requirement 4)
endGameButton.addEventListener('click', function () {
  if (game.gameOver) {
    return;
  }
  selectedCategory = null;
  game.endGame();
  showGameOver();
  updateDisplay();
});

// Event listener: New game button starts over
newGameButton.addEventListener('click', function () {
  game.startNewGame();
  selectedCategory = null;
  message.textContent = 'New game! Roll the dice to start your turn.';
  updateDisplay();
});

// Draw the starting state when the page loads
updateDisplay();