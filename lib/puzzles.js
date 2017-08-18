const Board = require('./board.js');
const GameView = require('./game_view.js');

const modal = document.getElementById('rulesModal');
const rulesLink = document.getElementById("rules");
const close = document.getElementsByClassName("close")[0];

//modal functions
rulesLink.onclick = () => {
    modal.style.display = "block";
}
close.onclick = () => {
    modal.style.display = "none";
}
window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 400;
  canvasEl.height = 400;

  const difficulty = document.getElementById("difficulty");
  const ctx = canvasEl.getContext("2d");
  const board = new Board(400,400,6,6,34,33, canvasEl, ctx);
  difficulty.onchange = (e) => board.timeToMove = e.target.value;
  new GameView(board, ctx).start();

});
