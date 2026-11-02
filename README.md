# Yatzy – CST3106 Assignment 1

Single-player Yatzy game built with HTML, CSS and JavaScript.

## How to play
1. Click **Roll dice**. You get up to 3 rolls per turn.
2. Click a die to **hold** it (gold frame). Held dice keep their value when you roll again.
3. Click a box in the **scorecard** to pick it. Each open box shows what your dice would score there.
4. Click **End turn** to lock in the score.
5. The game ends after 15 turns (one per box), or when you click **End game**. **New game** starts over.

## Scoring
- Ones to Sixes: sum of the matching dice. Bonus of 50 if the upper section totals 63 or more.
- One Pair, Two Pairs, Three of a Kind, Four of a Kind: sum of the matching dice.
- Small Straight (1-2-3-4-5) = 15, Large Straight (2-3-4-5-6) = 20.
- Full House (3 of one number + 2 of another) and Chance: sum of all dice.
- Yatzy (all five the same) = 50.
- Any open box can be picked; if the dice don't fit, it scores 0.

## Design
- Navy and gold colour scheme; Georgia headings, Source Sans 3 body text.
- Game board (dice, buttons, messages) beside the scorecard; they stack on phones.
- Dice drawn with pips; held dice get a gold frame.
- Mockups: the Lab 5 HTML/CSS mockup (cst3106_labs/lab5) was the starting point for this page.

## Files
- `index.html` – page layout
- `style.css` – styling
- `dice.js` – Dice class (roll, hold)
- `yatzyEngine.js` – YatzyEngine class (scoring rules, totals)
- `yatzyGame.js` – YatzyGame class (rounds, rolls, end turn, end game)
- `main.js` – connects the classes to the page

## Run
Open `index.html` in a browser (or use Live Server in VS Code).
