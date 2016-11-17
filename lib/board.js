const COLORS = {water: '#3498DB',wood: '#3AF508', fire: '#F51A08', electric: '#FDFE00', wind: '#ABAB9E'};
const Orb = require('./orb.js');

const CSSOFFSET = 50;
const TIMETOMOVE = 6000;
class Board {

  constructor(width, height, row, col, offset=0, canvas) {
    this.offset = offset;
    this.row = row;
    this.col = col;
    this.width = width;
    this.height = height;
    this.grid = new Array(row);
    this.canvas = canvas;
    this.matchedOrbs = [];
    this.resolving = false;
    for (var i = 0; i < row; i++) {
      this.grid[i] = new Array(col);
    }
    canvas.onmousedown = this.checkMouseDown.bind(this);

  }

  checkMouseDown(e) {
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
    this.mouseX = e.pageX - this.canvas.offsetLeft -10;
    this.mouseY = e.pageY - this.canvas.offsetTop - 10;

    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        if (this.selectedOrb != orb && !this.timer) {
          this.timer = setTimeout(this.checkMouseUp.bind(this), TIMETOMOVE);
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
            this.matchedOrbs = this.matchedOrbs.concat(matches);
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
        this.matchedOrbs = this.matchedOrbs.concat(matches);
      }
    })
  }

  checkCol(grid) {
    let transposedGrid = this.transpose(grid);
    this.checkRow(transposedGrid);
  }

  populate(){
    this.grid.forEach((row, i) => {
      for ( var j=0; j < row.length; j++) {
        const x = j*this.width/this.col + this.offset;
        const y = i*this.height/this.row + this.offset;
        this.grid[i][j] = new Orb(x,y);
      }
    });
  }

  draw(ctx) {
    if(this.resolving && !this.falling()) {
      this.skyfall();
    }
    ctx.clearRect(0,0,this.width+this.offset,this.height+this.offset);
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
      this.resolveBoard();
    }
  }

  swapOrbs(otherOrb) {
    let tempColor = this.selectedOrb.color;
    this.selectedOrb.color = otherOrb.color;
    this.selectedOrb.unselect();
    otherOrb.color = tempColor;
    this.selectedOrb = otherOrb;
    this.selectedOrb.select();
  }

  dropOrb(orb, disappearedOrb) {
    let oldY = orb.y;
    orb.targetY = disappearedOrb.y;
    disappearedOrb.y = oldY;
  }

  resolveBoard() {
    this.resolving = true;
    this.canvas.onmousedown = null;
    this.checkRow(this.grid);
    this.checkCol(this.grid);
    if(this.matchedOrbs.length === 0) {
      this.resolving = false;
      this.canvas.onmousedown = this.checkMouseDown.bind(this);
    }
    this.matchedOrbs.forEach((orb) => orb.disappear())
    this.matchedOrbs = [];
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
