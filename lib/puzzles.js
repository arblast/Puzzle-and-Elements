const Board = require('./board.js');
const GameView = require('./game_view.js');

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 405;
  canvasEl.height = 405;

  const ctx = canvasEl.getContext("2d");
  const board = new Board(400,400,6,6,36, canvasEl, ctx);
  new GameView(board, ctx).start();

});
