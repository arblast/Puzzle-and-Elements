/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	const GameView = __webpack_require__(3);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = 405;
	  canvasEl.height = 405;
	
	  const ctx = canvasEl.getContext("2d");
	  const board = new Board(400,400,6,6, 35, canvasEl, ctx);
	  new GameView(board, ctx).start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const COLORS = {water: '#3498DB',wood: '#3AF508', fire: '#F51A08', electric: '#FDFE00', wind: '#ABAB9E'};
	const Orb = __webpack_require__(2);
	
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
	  }
	
	  checkMouseMove(e) {
	    this.mouseX = e.clientX - 50;
	    this.mouseY = e.clientY - 50;
	
	    this.eachOrb( (orb) => {
	      if(Math.sqrt((this.mouseX-orb.x)*(this.mouseX-orb.x) + (this.mouseY-orb.y)*(this.mouseY-orb.y)) < orb.radius) {
	        if (this.selectedOrb != orb && !this.timer) {
	          this.timer = setTimeout(this.checkMouseUp.bind(this), 4000);
	        } else if (this.selectedOrb != orb) {
	          this.swapOrbs(orb);
	        }
	      }
	    })
	    if(this.mouseX < 2 || this.mouseY < 2 || this.mouseX > this.width -3 || this.mouseY > this.height -3 ) {
	      this.checkMouseUp();
	    }
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
	      ctx.drawImage(image,this.mouseX - 30,this.mouseY - 30,60,60);
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
	
	  eachOrb(callback) {
	    this.grid.forEach((row) => {
	      row.forEach((orb) => {
	        callback(orb);
	      });
	    });
	  }
	
	}
	
	module.exports = Board;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const COLORS = ['water', 'wood', 'fire', 'electric', 'wind'];
	
	class Orb {
	
	  constructor(x,y) {
	    this.radius = 30;
	    this.x = x;
	    this.y = y;
	    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
	  }
	
	  draw(ctx) {
	    ctx.save();
	    this.img = COLORS[this.color]
	    if(this.selected) {
	      ctx.globalAlpha = 0.4;
	    }
	    // ctx.beginPath();
	    // ctx.fillStyle = this.img;
	    // ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
	    // ctx.fill();
	    let image = document.getElementById(this.color);
	    ctx.drawImage(image,this.x - 30,this.y - 30,60,60);
	    ctx.restore();
	  }
	
	  select() {
	    this.selected = true;
	  }
	
	  unselect() {
	    this.selected = false;
	  }
	
	  // move(x,y) {
	  //   this.x = x;
	  //   this.y = y;
	  // }
	
	  // drag(x,y) {
	  //   if(this.selected) {
	  //     this.x = x;
	  //     this.y = y;
	  //   }
	  // }
	
	
	}
	
	module.exports = Orb;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
	class GameView {
	  constructor(board, ctx) {
	    this.ctx = ctx;
	    this.board = board;
	    this.board.populate();
	  }
	
	  start() {
	    this.lastTime = 0;
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    this.board.draw(this.ctx);
	    this.lastTime = time;
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map