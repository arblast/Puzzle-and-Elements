
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
