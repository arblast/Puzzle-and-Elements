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
    this.gridPos = new Array(row);
    this.canvas = canvas;
    for (var i = 0; i < row; i++) {
      this.grid[i] = new Array(col);
      this.gridPos[i] = new Array(col);
    }
    canvas.onmousedown = this.checkMouseDown.bind(this);
    canvas.onmousemove = this.checkMouseMove.bind(this);
    canvas.onmouseup = this.checkMouseUp.bind(this);

  }

  checkMouseDown(e) {
    const mouseX = e.clientX - 50;
    const mouseY = e.clientY - 50;
    this.eachOrb( (orb) => {
      if(Math.sqrt((mouseX-orb.x)*(mouseX-orb.x) + (mouseY-orb.y)*(mouseY-orb.y)) < orb.radius) {
        orb.clicked();
        orb.move(mouseX, mouseY);
      }
    })
  }

  checkMouseUp(e) {
    const mouseX = e.clientX - 50;
    const mouseY = e.clientY - 50;
    this.eachOrb( (orb) => {
      if(Math.sqrt((mouseX-orb.x)*(mouseX-orb.x) + (mouseY-orb.y)*(mouseY-orb.y)) < orb.radius) {
        orb.unclicked();
      }
    })
  }

  checkMouseMove(e) {
    const mouseX = e.clientX - 50;
    const mouseY = e.clientY - 50;
    this.eachOrb( (orb) => {
      orb.drag(mouseX, mouseY);
    })
  }

  populate(){
    this.grid.forEach((row, i) => {
      for ( var j=0; j < row.length; j++) {
        const x = i*this.height/this.row + this.offset;
        const y = j*this.width/this.col + this.offset;
        this.grid[i][j] = new Orb(x,y);
        this.gridPos[i][j] = [x,y];
      }
    });
  }

  draw(ctx) {
    ctx.clearRect(0,0,this.width+this.offset,this.height+this.offset);
    this.eachOrb((orb) => orb.draw(ctx));
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
