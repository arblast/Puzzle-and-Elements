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
    this.currentAnimation = 0;
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
    canvas.onmousedown = this.checkMouseDown.bind(this);

  }

  checkMouseDown(e) {
    e.stopPropagation();
    this.mouseX = e.pageX - this.canvas.offsetLeft -10;
    this.mouseY = e.pageY - this.canvas.offsetTop - 10;
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        this.selectedOrb = orb;
        orb.select();
        this.canvas.onmousemove = this.checkMouseMove.bind(this);
        this.canvas.onmouseup = this.checkMouseUp.bind(this);
      }
    })
  }

  checkMouseUp() {
    // this.mouseX = e.clientX - 50;
    // this.mouseY = e.clientY - 50;
    this.canvas.onmousemove = null;
    this.canvas.onmouseup = null;
    this.selectedOrb.unselect();
    this.selectedOrb = null;
    clearTimeout(this.timer);
    if(this.timer){
      this.resolveBoard();
    }
    this.timer = null;
  }

  checkMouseMove(e) {
    e.stopPropagation();
    this.mouseX = e.pageX - this.canvas.offsetLeft -10;
    this.mouseY = e.pageY - this.canvas.offsetTop - 10;
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        if (this.selectedOrb != orb && !this.timer) {
          this.timer = setTimeout(this.checkMouseUp.bind(this), this.timeToMove);
          this.timeLeft = this.timeToMove/1000;
          this.timerStart = Date.now();
        } else if (this.selectedOrb != orb) {
          this.swapOrbs(orb);
        }
      }
    })
    if(this.mouseX < 3 || this.mouseY < 3 || this.mouseX > this.width -3 || this.mouseY > this.height -3 ) {
      this.checkMouseUp();
    }
  }

  checkRow(grid) {
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

  checkCol(grid) {
    let transposedGrid = this.transpose(grid);
    this.checkRow(transposedGrid);
  }

  // checkDisappearing(matches) {
  //   let result = false;
  //   for (let i = 0; i < matches.length; i ++) {
  //     if(matches[i].disappearing) {
  //       result = true;
  //       break;
  //     }
  //   }
  //   return result;
  // }

  populate(){
    this.grid.forEach((row, i) => {
      for ( var j=0; j < row.length; j++) {
        const x = +(j*this.width/this.col + this.offsetX).toFixed(7);
        const y = +(i*this.height/this.row + this.offsetY).toFixed(7);
        this.grid[i][j] = new Orb(x,y);
      }
    });
  }

  draw(ctx) {
    if(this.timeLeft != 0) {
      this.timeLeft = ((this.timeToMove - (Date.now() - this.timerStart))/1000).toFixed(2);
    }
    this.timerDisplay.innerHTML = this.timeLeft;
    if(this.resolving && !this.falling()) {
      this.skyfall();
    }
    ctx.clearRect(0,0,this.width+this.offsetX,this.height+this.offsetY);
    this.eachOrb((orb) => orb.draw(ctx));
    if(this.selectedOrb) {
      let image = document.getElementById(this.selectedOrb.color);
      ctx.drawImage(image,this.mouseX - 30,this.mouseY - 30,70,70);
    }
  }

  falling() {
    let result = false;
    this.eachOrb( (orb) => {
      if (orb.targetY) {
        result = true;
      }
    })
    return result;
  }

  skyfall() {
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

  disappearing() {
    let result = false;
    this.eachOrb( orb => {
      if(orb.disappearing) {
        result = true;
      }
    })
    return result;
  }

  swapOrbs(otherOrb) {
    let tempColor = this.selectedOrb.color;
    this.selectedOrb.color = otherOrb.color;
    this.selectedOrb.unselect();
    otherOrb.color = tempColor;
    this.selectedOrb = otherOrb;
    this.selectedOrb.select();
  }

  matchedAlready(matches) {
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

  dropOrb(orb, disappearedOrb) {
    let oldY = orb.y;
    orb.targetY = disappearedOrb.y;
    disappearedOrb.y = oldY;
  }

  resolveBoard() {
    this.timeLeft = 0;
    this.resolving = true;
    this.canvas.onmousedown = null;
    this.checkRow(this.grid);
    this.checkCol(this.grid);
    if(this.matchedOrbs.length === 0) {
      this.displayScore();
      this.colorMatches = {water: 0, wind: 0, electric: 0, wood: 0, fire: 0, psion: 0};
      this.matchCount = 0;
      this.resolving = false;
      this.canvas.onmousedown = this.checkMouseDown.bind(this);
    }
    // this.matchedOrbs.forEach((set) => {
    //   set.forEach(orb => orb.disappear())
    // });
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
    this.fireDisplay.innerHTML = this.colorMatches['fire'];
    this.waterDisplay.innerHTML = this.colorMatches['water'];
    this.woodDisplay.innerHTML = this.colorMatches['wood'];
    this.electricDisplay.innerHTML = this.colorMatches['electric'];
    this.psionDisplay.innerHTML = this.colorMatches['psion'];
    this.windDisplay.innerHTML = this.colorMatches['wind'];
    this.totalDisplay.innerHTML = this.matchCount;
  }

  transpose(array) {
    return Object.keys(array[0]).map(
      function (c) { return array.map(function (r) { return r[c]; }); }
      );
    }

  eachOrb(callback) {
    this.grid.forEach((row) => {
      row.forEach((orb) => {
        callback(orb);
      });
    });
  }

}

module.exports = Board;
