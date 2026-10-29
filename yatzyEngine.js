/**
 * YatzyEngine module (CST3106 Lab 6)
 * Handles the rules and score calculation for the Yatzy game.
 * Skeleton version: structure and intended behaviour only.
 */
class YatzyEngine {
  /**
   * Sets up an empty score table.
   * null means the category hasn't been scored yet.
   */
  constructor() {
    this.scoreTable = {
      // Upper section
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      // Lower section
      onePair: null,
      twoPairs: null,
      threeOfAKind: null,
      fourOfAKind: null,
      smallStraight: null,
      largeStraight: null,
      fullHouse: null,
      chance: null,
      yatzy: null
    };
  }

  /**
   * Returns the score for a category, based on the dice.
   * Planned rules:
   *  - Ones to Sixes: add up the dice that match the number.
   *  - One Pair / Two Pairs / Three or Four of a Kind: add up the matching dice.
   *  - Small Straight (1-2-3-4-5) = 15, Large Straight (2-3-4-5-6) = 20.
   *  - Full House and Chance: add up all five dice.
   *  - Yatzy (all five the same) = 50.
   * @param {string} category - The category name, for example "fours".
   * @param {number[]} diceValues - The five dice, for example [2, 4, 4, 4, 6].
   * @returns {number} The score for that category.
   */
  calculateScore(category, diceValues) {
    //looks at a category and the dice values and returns the score for that category.
    // TODO: implement the scoring rules above (Assignment 1)
    return 0;
  }

  /**
   * Checks whether the dice can be scored in this category.
   * Planned checks:
   *  - The category exists and hasn't been used yet (still null in the score table).
   *  - The dice fit the category's pattern (for example, a Full House needs
   *    three of one number and two of another).
   * @param {string} category - The category name.
   * @param {number[]} diceValues - The five dice.
   * @returns {boolean} true if the selection is valid, otherwise false.
   */
  isValidSelection(category, diceValues) {
    // TODO: implement the checks above (Assignment 1)
    return true;
  }
}