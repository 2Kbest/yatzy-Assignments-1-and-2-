/**
 * YatzyEngine module (CST3106 Assignment 1)
 * Handles the rules and score calculation for the Yatzy game.
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
   * Adds up the dice that show a given number. Used by Ones to Sixes.
   * @param {number[]} diceValues - The five dice.
   * @param {number} number - The number to look for, from 1 to 6.
   * @returns {number} The sum of the matching dice, for example three 4s = 12.
   */
  sumOf(diceValues, number) {
    let total = 0;
    for (let i = 0; i < diceValues.length; i++) {
      if (diceValues[i] === number) {
        total += number;
      }
    }
    return total;
  }

  // Upper section: one scoring function per category (slide 13).
  // Each one adds up the dice that match its number.
  scoreOnes(diceValues)   { return this.sumOf(diceValues, 1); }
  scoreTwos(diceValues)   { return this.sumOf(diceValues, 2); }
  scoreThrees(diceValues) { return this.sumOf(diceValues, 3); }
  scoreFours(diceValues)  { return this.sumOf(diceValues, 4); }
  scoreFives(diceValues)  { return this.sumOf(diceValues, 5); }
  scoreSixes(diceValues)  { return this.sumOf(diceValues, 6); }

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
    // Looks at a category and the dice values and returns the score for that category.
    switch (category) {
      case 'ones':   return this.scoreOnes(diceValues);
      case 'twos':   return this.scoreTwos(diceValues);
      case 'threes': return this.scoreThrees(diceValues);
      case 'fours':  return this.scoreFours(diceValues);
      case 'fives':  return this.scoreFives(diceValues);
      case 'sixes':  return this.scoreSixes(diceValues);
      default:       return 0;  // lower section comes in Step 3B
    }
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
    // TODO: implement the checks above (Step 3B)
    return true;
  }
}