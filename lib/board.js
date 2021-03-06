const Orb = require('./orb.js');

class Board {

  constructor(width, height, row, col, offsetX=0, offsetY=0, canvas) {
    this.timeToMove = 8000;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.row = row;
    this.col = col;
    this.width = width;
    this.height = height;
    this.grid = new Array(row);
    this.canvas = canvas;
    this.matchedOrbs = [];
    this.resolving = false;
    this.timeLeft = 0;
    this.colorMatches = {water: 0, wind: 0, electric: 0, wood: 0, fire: 0, psion: 0};
    this.matchCount = 0;
    this.turnCount = 0;
    this.currentAnimation = 0;
    this.swapping = false;
    this.timerDisplay = document.getElementById("timer");
    this.fireDisplay = document.getElementById("fire-matches");
    this.waterDisplay = document.getElementById("water-matches");
    this.woodDisplay = document.getElementById("wood-matches");
    this.electricDisplay = document.getElementById("electric-matches");
    this.psionDisplay = document.getElementById("psion-matches");
    this.windDisplay = document.getElementById("wind-matches");
    this.totalDisplay = document.getElementById("total-matches");
    for (var i = 0; i < row; i++) {
      this.grid[i] = new Array(col);
    }

  }

  checkMouseDown(e) { //on mouse down
    e.stopPropagation();
    this.mouseX = e.pageX - this.canvas.offsetLeft -10;
    this.mouseY = e.pageY - this.canvas.offsetTop - 10;
    this.canvas.className = 'grabbing';
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        this.selectedOrb = orb;
        orb.select();
        this.canvas.onmousemove = this.checkMouseMove.bind(this);
        this.canvas.onmouseup = this.checkMouseUp.bind(this);
      }
    })
  }

  checkMouseUp() { //on mouse up
    this.canvas.className = '';
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.selectedOrb.unselect();
    this.selectedOrb = null;
    this.swapping = false;
    if(this.nextOrb) {
      this.nextOrb.unselect();
    }
    clearTimeout(this.timer);
    if(this.timer){
      this.resolveBoard();
    }
    this.timer = null;
  }

  checkMouseMove(e) { //on mouse move
    e.stopPropagation();
    this.mouseX = e.pageX - this.canvas.offsetLeft -10;
    this.mouseY = e.pageY - this.canvas.offsetTop - 10;
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        if (this.selectedOrb != orb && !this.timer) {
          this.timer = setTimeout(this.checkMouseUp.bind(this), this.timeToMove);
          this.timeLeft = this.timeToMove/1000;
          this.timerStart = Date.now();
          this.swapOrbs(orb);
        } else if (this.selectedOrb != orb && !this.swapping) {
          this.swapOrbs(orb);
        } else if (this.selectedOrb != orb && this.swapping && this.nextOrb != orb) {
          this.completeSwap();
          this.swapOrbs(orb);
        }
      }
    })
    if(this.mouseX < 3 || this.mouseY < 3 || this.mouseX > this.width -3 || this.mouseY > this.height -3 ) {
      this.checkMouseUp();
    }
  }

  checkRow(grid) { //row check when resolving board
    grid.forEach((row) => {
      let matches = [];
      let lastColor = null;
      row.forEach((orb) => {
        if(lastColor) {
          if(lastColor === orb.color) {
            matches.push(orb);
          } else if(lastColor != orb.color && matches.length > 2) {
            if(this.matchedAlready(matches)){}
            else {
              this.matchCount++;
              this.matchedOrbs.push(matches);
            }
            matches = [];
            matches.push(orb);
            lastColor = orb.color;
          } else {
            matches = [];
            matches.push(orb);
            lastColor = orb.color;
          }
        } else {
          lastColor = orb.color;
          matches.push(orb);
        }
      })
      if(matches.length > 2) {
        if(this.matchedAlready(matches)){}
        else {
          this.matchCount++;
          this.matchedOrbs.push(matches);
        }
      }
    })
  }

  checkCol(grid) {  //column check for resvoling board
    let transposedGrid = this.transpose(grid);
    this.checkRow(transposedGrid);
  }

  populate(){ //generates random orbs
    this.grid.forEach((row, i) => {
      for ( var j=0; j < row.length; j++) {
        const x = +(j*this.width/this.col + this.offsetX).toFixed(7);
        const y = +(i*this.height/this.row + this.offsetY).toFixed(7);
        this.grid[i][j] = new Orb(x,y);
      }
    });
    this.resolveBoard();
  }

  draw(ctx) { //handles graphics and animations
    if(this.timeLeft != 0) {
      this.timeLeft = ((this.timeToMove - (Date.now() - this.timerStart))/1000).toFixed(2);
    }
    this.timerDisplay.innerHTML = this.timeLeft;
    if(this.resolving && !this.falling()) {
      this.skyfall();
    }
    ctx.clearRect(0,0,this.width+this.offsetX,this.height+this.offsetY);
    this.eachOrb((orb) => orb.draw(ctx));
    if(this.swapping && this.swapping < 5) {
      let image = document.getElementById(this.swapColor)
      ctx.drawImage(image, this.currentX - 34, this.currentY - 34 ,68 ,68);
      this.currentX = this.currentX - this.xDiff;
      this.currentY = this.currentY - this.yDiff;
      this.swapping ++;
    } else if(this.swapping == 5 && this.selectedOrb) {
      this.completeSwap();
    };
    if(this.selectedOrb) {
      let image = document.getElementById(this.selectedOrb.color);
      ctx.drawImage(image, this.mouseX - 34, this.mouseY - 34, 68, 68);
    }
  }

  falling() { //returns true if any orbs are currently falling
    let result = false;
    this.eachOrb( (orb) => {
      if (orb.targetY) {
        result = true;
      }
    })
    return result;
  }

  skyfall() { //generates new orbs from the top after matches are made
    if(!this.disappearing()){
      this.skyfalling = false;
      this.grid[0].forEach( orb => {
        if(orb.disappeared) {
          orb.generateNewColor();
          orb.respawn();
        }
      })
      for(let i=this.grid.length-1; i >= 1; i--) {
        for(let j=this.grid.length-1; j >= 0; j--) {
          if(this.grid[i][j].disappeared && !this.grid[i-1][j].disappeared) {
            this.skyfalling = true;
            let tempOrb = this.grid[i][j];
            this.dropOrb(this.grid[i-1][j], this.grid[i][j]);
            this.grid[i][j] = this.grid[i-1][j];
            this.grid[i-1][j] = tempOrb;
          }
        }
      }
      if(!this.skyfalling) {
        clearInterval(this.animation);
        this.currentAnimation = 0;
        this.matchedOrbs = [];
        this.resolveBoard();
      }
    }
  }

  disappearing() { //returns true if orbs are currently being matched
    let result = false;
    this.eachOrb( orb => {
      if(orb.disappearing) {
        result = true;
      }
    })
    return result;
  }

  swapOrbs(otherOrb) { //function to swap two orbs
    this.swapping = 1;
    this.xDiff = (otherOrb.x - this.selectedOrb.x)/10;
    this.yDiff = (otherOrb.y - this.selectedOrb.y)/10;
    this.currentX = otherOrb.x - this.xDiff;
    this.currentY = otherOrb.y - this.yDiff;
    this.swapColor = otherOrb.color;
    otherOrb.select();
    this.nextOrb = otherOrb;
  }

  completeSwap() { //function that is called when animations are finished, or when another orb is being moved
    let tempColor = this.selectedOrb.color;
    this.selectedOrb.color = this.nextOrb.color;
    this.selectedOrb.unselect();
    this.nextOrb.color = tempColor;
    this.selectedOrb = this.nextOrb;
    this.swapping = false;
  }

  matchedAlready(matches) { //checks if there are duplicate matches
    let found = false;
    for (let i = 0; i < this.matchedOrbs.length; i++) {
      for (let j = 0; j < matches.length; j++) {
        if (this.matchedOrbs[i].includes(matches[j])) {
          matches.splice(j,1);
          this.matchedOrbs[i] = this.matchedOrbs[i].concat(matches)
          found = true;
          break;
        }
      }
      if(found) {break;}
    }
    return found;
  }

  dropOrb(orb, disappearedOrb) { //function that transfers matched orbs Y position to the new one
    let oldY = orb.y;
    orb.targetY = disappearedOrb.y;
    disappearedOrb.y = oldY;
  }

  resolveBoard() { //function to resolve the board at end of every round
    this.timeLeft = 0;
    this.resolving = true;
    this.canvas.onmousedown = null;
    this.checkRow(this.grid);
    this.checkCol(this.grid);
    if(this.matchedOrbs.length === 0) {
      this.displayScore();
      this.turnCount ++;
      this.colorMatches = {water: 0, wind: 0, electric: 0, wood: 0, fire: 0, psion: 0};
      this.matchCount = 0;
      this.resolving = false;
      this.canvas.onmousedown = this.checkMouseDown.bind(this);
    }
    if(this.matchedOrbs.length > 0) {
      this.matchedOrbs.forEach( (set) => {
        this.colorMatches[set[0].color] ++;
      });
      this.matchedOrbs[0].forEach(orb => orb.disappear());
      this.animation = setInterval(() => {
        this.currentAnimation ++;
        if (this.currentAnimation < this.matchedOrbs.length) {
          this.matchedOrbs[this.currentAnimation].forEach(orb => orb.disappear());
        }
      }, 500)
    }
  }

  displayScore() {
    if(this.turnCount === 0) {
      this.colorMatches = {water: 0, wind: 0, electric: 0, wood: 0, fire: 0, psion: 0};
      this.matchCount = 0;
    }
    this.fireDisplay.innerHTML = this.colorMatches['fire'];
    this.waterDisplay.innerHTML = this.colorMatches['water'];
    this.woodDisplay.innerHTML = this.colorMatches['wood'];
    this.electricDisplay.innerHTML = this.colorMatches['electric'];
    this.psionDisplay.innerHTML = this.colorMatches['psion'];
    this.windDisplay.innerHTML = this.colorMatches['wind'];
    this.totalDisplay.innerHTML = this.matchCount;
  }

  transpose(array) { //helper function for transposing the array
    return Object.keys(array[0]).map(
      function (c) { return array.map(function (r) { return r[c]; }); }
      );
    }

  eachOrb(callback) { //helper function to iterate over each orb
    this.grid.forEach((row) => {
      row.forEach((orb) => {
        callback(orb);
      });
    });
  }

}

module.exports = Board;
