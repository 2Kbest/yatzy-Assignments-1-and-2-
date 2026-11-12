/**
 * YatzyGame module (CST3106 Assignment 1)
 * Manages the state of a single-player Yatzy game:
 * the dice, the score table, the current round, and the rolls left this turn.
 */

   // Load the classes this game uses.
   // (In the browser, <script> tags did this. In Node, we use require.)
   const Dice = require('./dice');
   const YatzyEngine = require('./yatzyEngine');

class YatzyGame {
  /**
   * Sets up a new game.
   */
  constructor() {
    this.maxRounds = 15;      // one round per scorecard box
    this.maxRolls = 3;        // rolls allowed per turn
    this.dice = new Dice(5);  // the five dice
    this.startNewGame();
  }

  /**
   * Starts a new game: round 1, empty score table, fresh dice.
   */
  startNewGame() {
    this.engine = new YatzyEngine();  // a new, empty score table
    this.currentRound = 1;            // which round (turn) we're on, from 1 to 15
    this.rollsLeft = this.maxRolls;   // rolls left in this turn
    this.totalScore = 0;              // the player's total score so far
    this.gameOver = false;
    this.dice.reset();
  }

  /**
   * Checks whether the player has rolled at least once this turn.
   * @returns {boolean} true after the first roll of the turn.
   */
  hasRolled() {
    return this.rollsLeft < this.maxRolls;
  }

  /**
   * Rolls the dice that aren't held, if the player has rolls left.
   * @returns {boolean} true if the dice were rolled, otherwise false.
   */
  roll() {
    if (this.gameOver || this.rollsLeft === 0) {
      return false;
    }
    this.dice.rollAll();
    this.rollsLeft--;
    return true;
  }

  /**
   * Ends the turn by scoring the dice in a category,
   * then moves to the next round (or ends the game after round 15).
   * @param {string} category - The category to score, for example "fives".
   * @returns {number|null} The points scored, or null if the move isn't allowed.
   */
  endTurn(category) {
    if (this.gameOver || !this.hasRolled() || !this.engine.isValidSelection(category)) {
      return null;
    }

    const points = this.engine.calculateScore(category, this.dice.values);
    this.engine.scoreTable[category] = points;          // lock in the score
    this.totalScore = this.engine.calculateTotalScore();

    if (this.currentRound === this.maxRounds) {
      this.endGame();  // that was the last box
    } else {
      this.currentRound++;
      this.rollsLeft = this.maxRolls;
      this.dice.reset();
    }
    return points;
  }

  /**
   * Ends the game, after round 15 or when the player chooses to stop.
   */
  endGame() {
    this.totalScore = this.engine.calculateTotalScore();
    this.gameOver = true;
  }
    /**
   * Packs the whole game into one plain object, ready to send as JSON.
   * The page uses it to draw the dice, the scorecard and the buttons.
   * @returns {object} The current game state.
   */
  getState() {
    // What each open box would score with the current dice (only after a roll)
    const previews = {};
    if (this.hasRolled() && !this.gameOver) {
      const categories = Object.keys(this.engine.scoreTable);
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (this.engine.isValidSelection(category)) {
          previews[category] = this.engine.calculateScore(category, this.dice.values);
        }
      }
    }

    return {
      dice: this.dice.values,
      held: this.dice.held,
      rollsLeft: this.rollsLeft,
      currentRound: this.currentRound,
      maxRounds: this.maxRounds,
      scoreTable: this.engine.scoreTable,
      upperTotal: this.engine.getUpperTotal(),
      bonus: this.engine.getBonus(),
      totalScore: this.engine.calculateTotalScore(),
      previews: previews,
      gameOver: this.gameOver
    };
  }
}

   // Share this class with other files (server.js loads it with require)
   module.exports = YatzyGame;