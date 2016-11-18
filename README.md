## Puzzle and Elements

[Live](https://arblast.github.io/Puzzle-and-Elements/)

### Background

This game is based off of games such as Bejeweled and Candy Crush. The game beings with a full board of orbs with different colors. In games like Bejeweled, the player can swap any two orbs given that they are adjacent to each other and the final position will result in a match of 3 orbs with the same color. In Puzzle and Elements, players will be able to pick up a single orb in the beginning of a turn, and move it as much as they want (swapping orbs as it moves), within a given amount of time, and the resulting board will be matched at the end.

###Instructions

To pick up an orb, simply hold down your mouse on the orb you want to pick up. Moving through other orbs will swap them with the position of your current orb. The goal of this game is to make vertical or horizontal matches of three or more orbs of the same color, this will result in the orbs being cleared, and will cause new orbs to fall from the top. The amount of time to move can be adjusted by changing the difficulty at the bottom of the game.

###Tools

This game was designed entirely with VanillaJS, HTML5, and canvas, with use of CSS3 for styling.

###Implementation Details

The game consists of two main classes, the `Board` class and the `Orb` class. `Board` handles the logic behind all the matching, and holds all the `Orb`s. `Orb` contains logic for each individual orb such as the rendering and the animations. One of the initial challenges was handling the swapping of the orbs. To achieve this, each time the mouse moved, I iterate over each orb to check for collision, and if there is a swap is made.

```       
 this.eachOrb( (orb) => {
    if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
      if (this.selectedOrb != orb && !this.timer) {
        this.timer = setTimeout(this.checkMouseUp.bind(this), TIMETOMOVE);
        this.timeLeft = TIMETOMOVE/1000;
        this.timerStart = Date.now();
      } else if (this.selectedOrb != orb) {
        this.swapOrbs(orb);
      }
    }
  })
```

### Future Updates

- [ ] Add levels
- [ ] Add sound and music
