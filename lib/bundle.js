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
	  canvasEl.width = 400;
	  canvasEl.height = 400;
	
	  const ctx = canvasEl.getContext("2d");
	  const board = new Board(400,400,6,6, 30, canvasEl, ctx);
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	const COLORS = {water: '#3498DB',wood: '#3AF508', fire: '#F51A08', electric: '#FDFE00', wind: '#ABAB9E'};
	
	class Orb {
	
	  constructor(x,y) {
	    this.radius = 30;
	    this.x = x;
	    this.y = y;
	    const colorArray = Object.keys(COLORS);
	    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
	  }
	
	  draw(ctx) {
	    this.img = COLORS[this.color]
	    if(this.selected) {
	      this.img = '#ffffff';
	    }
	    ctx.beginPath();
	    ctx.fillStyle = this.img;
	    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
	    ctx.fill();
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