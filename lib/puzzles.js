const Board = require('./board.js');
const GameView = require('./game_view.js');

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 400;
  canvasEl.height = 400;

  const ctx = canvasEl.getContext("2d");
  const board = new Board(400,400,6,6, 30, canvasEl, ctx);
  new GameView(board, ctx).start();

});
