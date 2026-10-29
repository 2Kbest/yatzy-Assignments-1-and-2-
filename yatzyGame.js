/**
 * YatzyGame module (CST3106 Lab 6)
 * Manages the current state of the Yatzy game.
 * Skeleton version: structure and intended behaviour only.
 */
class YatzyGame {
  /**
   * Sets up the game state.
   */
  constructor() {
    this.currentPlayer = 1;  // whose turn it is (single-player game, so always player 1 for now)
    this.currentRound = 1;   // which round (turn) we're on, from 1 to 15
    this.totalScore = 0;     // the player's total score so far
  }

  /**
   * Starts a new game.
   * Planned: reset the round to 1, the total score to 0,
   * and clear the score table.
   */
  startNewGame() {
    // TODO: reset the game state (Assignment 1)
  }

  /**
   * Ends the current player's turn.
   * Planned: add the turn's score to the total, move to the next round,
   * and switch to the next player (if there is more than one).
   */
  endTurn() {
    // TODO: move to the next round / player (Assignment 1)
  }

  /**
   * Ends the game.
   * Planned: after round 15, add up the final score
   * and determine the winner.
   */
  endGame() {
    // TODO: finalize the score and determine the winner (Assignment 1)
  }
}