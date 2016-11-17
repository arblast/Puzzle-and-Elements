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
    for (var i = 0; i < row; i++) {
      this.grid[i] = new Array(col);
    }
    canvas.onmousedown = this.checkMouseDown.bind(this);

  }

  checkMouseDown(e) {
    this.mouseX = e.clientX - 50;
    this.mouseY = e.clientY - 50;
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
    this.timer = null;
    this.resolveBoard();
  }

  checkMouseMove(e) {
    this.mouseX = e.clientX - 50;
    this.mouseY = e.clientY - 50;

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

  checkRow() {
    this.grid.forEach((row) => {
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

  checkColumn() {

  }

  populate(){
    this.grid.forEach((row, i) => {
      for ( var j=0; j < row.length; j++) {
        const x = i*this.height/this.row + this.offset;
        const y = j*this.width/this.col + this.offset;
        this.grid[i][j] = new Orb(x,y);
      }
    });
  }

  draw(ctx) {
    ctx.clearRect(0,0,this.width+this.offset,this.height+this.offset);
    this.eachOrb((orb) => orb.draw(ctx));
    if(this.selectedOrb) {
      let image = document.getElementById(this.selectedOrb.color);
      ctx.drawImage(image,this.mouseX - 30,this.mouseY - 30,70,70);
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

  resolveBoard() {
    this.canvas.onmousedown = null;
    this.checkRow();
    this.matchedOrbs.forEach((orb) => orb.select())
    this.matchedOrbs = [];
    this.canvas.onmousedown = this.checkMouseDown.bind(this);
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
