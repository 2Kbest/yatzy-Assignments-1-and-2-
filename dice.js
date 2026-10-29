/**
 * Dice module (CST3106 Assignment 1)
 * Rolls the dice and keeps track of which dice are held.
 */
class Dice {
  /**
   * Sets up a new set of dice.
   * @param {number} count - How many dice are in the set (5 for Yatzy).
   */
  constructor(count) {
    this.count = count;  // how many dice are in this set
    this.values = [];    // the current value of each die (0 = not rolled yet)
    this.held = [];      // true = the player is keeping this die
    for (let i = 0; i < count; i++) {
      this.values.push(0);
      this.held.push(false);
    }
  }

  /**
   * Rolls one die.
   * @returns {number} A random whole number from 1 to 6.
   */
  roll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Rolls every die that is NOT held. Held dice keep their value.
   * @returns {number[]} The new values, for example [5, 5, 5, 2, 6].
   */
  rollAll() {
    for (let i = 0; i < this.count; i++) {
      if (!this.held[i]) {
        this.values[i] = this.roll();  // only re-roll dice the player didn't keep
      }
    }
    return this.values;
  }

  /**
   * Holds a die, or lets it go if it was already held.
   * @param {number} index - Which die, from 0 to 4.
   */
  toggleHold(index) {
    this.held[index] = !this.held[index];
  }

  /**
   * Clears the dice for a new turn: no values, nothing held.
   */
  reset() {
    for (let i = 0; i < this.count; i++) {
      this.values[i] = 0;
      this.held[i] = false;
    }
  }
}