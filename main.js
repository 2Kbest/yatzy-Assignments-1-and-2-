/**
 * main.js (CST3106 Assignment 1)
 * Connects the Dice class to the page: rolling, holding, and drawing the dice.
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

const MAX_ROLLS = 3;        // Yatzy allows 3 rolls per turn
const dice = new Dice(5);   // the five dice
let rollsLeft = MAX_ROLLS;  // rolls left in this turn

// Page elements we update
const rollButton = document.getElementById('roll-button');
const message = document.getElementById('message');
const rollsLeftText = document.getElementById('rolls-left');

/**
 * Draws one die on the page: its pips, its gold "held" frame, and its label.
 * @param {number} index - Which die, from 0 to 4.
 */
function drawDie(index) {
  const dieButton = document.getElementById('die-' + index);
  const label = document.getElementById('die-label-' + index);
  const value = dice.values[index];
  const held = dice.held[index];

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
 * Redraws all five dice and the rolls-left counter.
 */
function updateDisplay() {
  for (let i = 0; i < dice.count; i++) {
    drawDie(i);
  }
  rollsLeftText.textContent = 'Rolls left: ' + rollsLeft;
  rollButton.disabled = (rollsLeft === 0);  // grey out the button when no rolls are left
}

// Event listener: Roll button
rollButton.addEventListener('click', function () {
  if (rollsLeft === 0) {
    return;  // no rolls left this turn
  }
  dice.rollAll();  // only re-rolls dice that aren't held
  rollsLeft--;

  if (rollsLeft > 0) {
    message.textContent = 'Click a die to hold it, then roll the rest.';
  } else {
    message.textContent = 'No rolls left. Pick a box in the scorecard.';
  }
  updateDisplay();
});

// Event listeners: clicking a die holds it (or lets it go)
for (let i = 0; i < dice.count; i++) {
  document.getElementById('die-' + i).addEventListener('click', function () {
    if (rollsLeft === MAX_ROLLS) {
      message.textContent = 'Roll the dice first.';
      return;  // nothing to hold before the first roll
    }
    dice.toggleHold(i);
    drawDie(i);
  });
}

// Draw the starting state when the page loads
updateDisplay();