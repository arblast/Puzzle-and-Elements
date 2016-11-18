## Puzzle and Elements

### Background

This game is based off of games such as Bejeweled and Candy Crush. The game beings with a full board of orbs with different colors. In games like Bejeweled, the player can swap any two orbs given that they are adjacent to each other and the final position will result in a match of 3 orbs with the same color. In Puzzle and Elements, players will be able to pick up a single orb in the beginning of a turn, and move it as much as they want (swapping orbs as it moves), within a given amount of time, and the resulting board will be matched at the end. The game will have many levels, each with an objective (such as matching 2 of a given color, or achieving 5 different matches).

### Functionality & MVP

With Puzzle and Elements, players will be able to:

- [ ] Move an orb around while swapping with any orbs it moves through.
- [ ] Matching three or more orbs will cause the set to disappear.
- [ ] Orbs will drop through any empty spaces, and new random orbs will spawn from top.
- [ ] Select the difficulty (time to move)
- [ ] Display time to move and match statistics after each round.

In addition, this project will include:

- [ ] A rules modal
- [ ] A production Readme

Wireframes

This game will consist of a single screen with a link to to the controls/rules, as well as Github. In the center will be the game board that displays the current orbs. On the left there will be the criteria for advancing to the next level as well as the current status. On the right will be buttons to restart and skip a level.

![wireframes](docs/wireframes/Puzzles.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript for overall structure and game logic.
- `HTML5 Canvas` for rendering, and possibly `Easel.js` depending on the detail of orbs.
- Webpack to bundle and serve up the various scripts.

`board.js`: this script will handle the logic for creating the game board and handling any orb movements and matches.
`orb.js`: this script will handle the logic and rendering behind each individual orb.
`level.js`: this script will handle the logic behind each levels and the conditions for advancing.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules and getting webpack running. Begin working on rendering a board of orbs. Decide whether or not `Easel.js` is required. Goals for the day:

- Get a green bundle with `webpack`
- Have an object rendered

**Day 2**: This day will be continuing rendering the board from Day 1. Goals for the day:

- Have a complete board of 5 different colors, generated randomly each time.

**Day 3**: Creating and implementing the movement logic. Goals for the day:

- Each orb should be able to be picked up using the mouse, and moving the orb around will swap it with any orb that it passes through.

**Day 4**: Creating the logic for matching and resolving the board. Goals for the day:

- Players should be able to move orbs around and have the resulting board changed based on matches that were made. Stats on what orbs were matched should be displayed on the left side.

### Bonus features

Upcoming updates:

- [ ] Adding levels that players can advance by meeting a criteria with the resolving board.
- [ ] Adding options for more orb colors.
