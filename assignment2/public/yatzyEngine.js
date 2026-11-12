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

  // ===== Helpers =====

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

  /**
   * NEW: Adds up all five dice. Used by Full House and Chance.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} The total of all the dice.
   */
  sumAll(diceValues) {
    let total = 0;
    for (let i = 0; i < diceValues.length; i++) {
      total += diceValues[i];
    }
    return total;
  }

  /**
   * NEW: Counts how many dice show each number.
   * @param {number[]} diceValues - The five dice.
   * @returns {number[]} counts[n] = how many dice show n (counts[0] is not used).
   *   For example [5, 5, 5, 2, 6] gives [0, 0, 1, 0, 0, 3, 1].
   */
  countDice(diceValues) {
    const counts = [0, 0, 0, 0, 0, 0, 0];  // spots 0 to 6
    for (let i = 0; i < diceValues.length; i++) {
      counts[diceValues[i]]++;
    }
    return counts;
  }

  /**
   * NEW: Finds the highest number that shows up at least "howMany" times.
   * Used by One Pair (2), Three of a Kind (3) and Four of a Kind (4).
   * @param {number[]} diceValues - The five dice.
   * @param {number} howMany - How many matching dice are needed.
   * @returns {number} That number times howMany, or 0 if there isn't one.
   */
  ofAKind(diceValues, howMany) {
    const counts = this.countDice(diceValues);
    for (let n = 6; n >= 1; n--) {   // start at 6 so we find the highest first
      if (counts[n] >= howMany) {
        return n * howMany;
      }
    }
    return 0;
  }

  // ===== Upper section: one scoring function per category (slide 13) =====
  scoreOnes(diceValues)   { return this.sumOf(diceValues, 1); }
  scoreTwos(diceValues)   { return this.sumOf(diceValues, 2); }
  scoreThrees(diceValues) { return this.sumOf(diceValues, 3); }
  scoreFours(diceValues)  { return this.sumOf(diceValues, 4); }
  scoreFives(diceValues)  { return this.sumOf(diceValues, 5); }
  scoreSixes(diceValues)  { return this.sumOf(diceValues, 6); }

  // ===== NEW: Lower section =====

  // One Pair, Three of a Kind, Four of a Kind: the highest matching group
  scoreOnePair(diceValues)      { return this.ofAKind(diceValues, 2); }
  scoreThreeOfAKind(diceValues) { return this.ofAKind(diceValues, 3); }
  scoreFourOfAKind(diceValues)  { return this.ofAKind(diceValues, 4); }

  /**
   * Two Pairs: two different pairs, for example 3-3-5-5-6 = 16.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} The sum of both pairs, or 0.
   */
  scoreTwoPairs(diceValues) {
    const counts = this.countDice(diceValues);
    let pairsFound = 0;
    let total = 0;
    for (let n = 6; n >= 1; n--) {
      if (counts[n] >= 2) {
        pairsFound++;
        total += n * 2;
      }
    }
    return pairsFound === 2 ? total : 0;
  }

  /**
   * Small Straight: 1-2-3-4-5 in any order = 15.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} 15, or 0.
   */
  scoreSmallStraight(diceValues) {
    const counts = this.countDice(diceValues);
    for (let n = 1; n <= 5; n++) {
      if (counts[n] !== 1) {
        return 0;  // a number is missing (or doubled), so no straight
      }
    }
    return 15;
  }

  /**
   * Large Straight: 2-3-4-5-6 in any order = 20.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} 20, or 0.
   */
  scoreLargeStraight(diceValues) {
    const counts = this.countDice(diceValues);
    for (let n = 2; n <= 6; n++) {
      if (counts[n] !== 1) {
        return 0;
      }
    }
    return 20;
  }

  /**
   * Full House: three of one number and two of another = sum of all dice.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} The total of all dice, or 0.
   */
  scoreFullHouse(diceValues) {
    const counts = this.countDice(diceValues);
    let hasThree = false;
    let hasTwo = false;
    for (let n = 1; n <= 6; n++) {
      if (counts[n] === 3) {
        hasThree = true;
      }
      if (counts[n] === 2) {
        hasTwo = true;
      }
    }
    return (hasThree && hasTwo) ? this.sumAll(diceValues) : 0;
  }

  // Chance: any dice, add them all up
  scoreChance(diceValues) { return this.sumAll(diceValues); }

  /**
   * Yatzy: all five dice the same = 50.
   * @param {number[]} diceValues - The five dice.
   * @returns {number} 50, or 0.
   */
  scoreYatzy(diceValues) {
    const counts = this.countDice(diceValues);
    for (let n = 1; n <= 6; n++) {
      if (counts[n] === 5) {
        return 50;
      }
    }
    return 0;
  }

  // ===== Main methods =====

  /**
   * Returns the score for a category, based on the dice.
   * @param {string} category - The category name, for example "fours".
   * @param {number[]} diceValues - The five dice, for example [2, 4, 4, 4, 6].
   * @returns {number} The score for that category.
   */
  calculateScore(category, diceValues) {
    // Looks at a category and the dice values and returns the score for that category.
    switch (category) {
      case 'ones':          return this.scoreOnes(diceValues);
      case 'twos':          return this.scoreTwos(diceValues);
      case 'threes':        return this.scoreThrees(diceValues);
      case 'fours':         return this.scoreFours(diceValues);
      case 'fives':         return this.scoreFives(diceValues);
      case 'sixes':         return this.scoreSixes(diceValues);
      case 'onePair':       return this.scoreOnePair(diceValues);
      case 'twoPairs':      return this.scoreTwoPairs(diceValues);
      case 'threeOfAKind':  return this.scoreThreeOfAKind(diceValues);
      case 'fourOfAKind':   return this.scoreFourOfAKind(diceValues);
      case 'smallStraight': return this.scoreSmallStraight(diceValues);
      case 'largeStraight': return this.scoreLargeStraight(diceValues);
      case 'fullHouse':     return this.scoreFullHouse(diceValues);
      case 'chance':        return this.scoreChance(diceValues);
      case 'yatzy':         return this.scoreYatzy(diceValues);
      default:              return 0;  // unknown category
    }
  }

  /**
   * Checks whether the player can score in this category:
   * it has to exist and not be used yet (still null in the score table).
   * Dice that don't fit the pattern are still allowed; they just score 0.
   * @param {string} category - The category name.
   * @returns {boolean} true if the category is open, otherwise false.
   */


    isValidSelection(category) {
    return this.scoreTable[category] === null;
  }

  // ===== Totals =====

  /**
   * Adds up the upper section (Ones to Sixes). Unused boxes count as 0.
   * @returns {number} The upper section total.
   */
  getUpperTotal() {
    const upper = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    let total = 0;
    for (let i = 0; i < upper.length; i++) {
      const score = this.scoreTable[upper[i]];
      if (score !== null) {
        total += score;
      }
    }
    return total;
  }

  /**
   * Upper section bonus: 50 points if Ones to Sixes add up to 63 or more.
   * @returns {number} 50 or 0.
   */
  getBonus() {
    return this.getUpperTotal() >= 63 ? 50 : 0;
  }

  /**
   * Adds up every scored box plus the bonus (slide 14).
   * @returns {number} The player's total score.
   */
  calculateTotalScore() {
    const categories = Object.keys(this.scoreTable);
    let total = 0;
    for (let i = 0; i < categories.length; i++) {
      const score = this.scoreTable[categories[i]];
      if (score !== null) {
        total += score;
      }
    }
    return total + this.getBonus();
  }

}