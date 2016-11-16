const COLORS = {water: '#3498DB',wood: '#3AF508', fire: '#F51A08', electric: '#FDFE00', wind: '#ABAB9E'};
const Orb = require('./orb.js');

const CSSOFFSET = 50;

class Board {

  constructor(width, height, row, col, offset=0, canvas) {
    this.offset = offset;
    this.row = row;
    this.col = col;
    this.width = width;
    this.height = height;
    this.grid = new Array(row);
    this.canvas = canvas;
    for (var i = 0; i < row; i++) {
      this.grid[i] = new Array(col);
    }
    canvas.onmousedown = this.checkMouseDown.bind(this);
    canvas.onmouseup = this.checkMouseUp.bind(this);

  }

  checkMouseDown(e) {
    this.mouseX = e.clientX - 50;
    this.mouseY = e.clientY - 50;
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        this.selectedOrb = orb;
        orb.select();
        this.canvas.onmousemove = this.checkMouseMove.bind(this);
      }
    })
  }

  checkMouseUp(e) {
    this.mouseX = e.clientX - 50;
    this.mouseY = e.clientY - 50;
    this.canvas.onmousemove = null;
    this.selectedOrb.unselect();
    this.selectedOrb = null;
  }

  checkMouseMove(e) {
    let tempColor;
    this.mouseX = e.clientX - 50;
    this.mouseY = e.clientY - 50;
    this.eachOrb( (orb) => {
      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
        tempColor = this.selectedOrb.color;
        this.selectedOrb.color = orb.color;
        this.selectedOrb.unselect();
        orb.color = tempColor;
        this.selectedOrb = orb;
        this.selectedOrb.select();
      }
    })
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
      ctx.beginPath();
      ctx.fillStyle = COLORS[this.selectedOrb.color];
      ctx.arc(this.mouseX,this.mouseY,this.selectedOrb.radius,0,2*Math.PI,false);
      ctx.fill();
    }
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
