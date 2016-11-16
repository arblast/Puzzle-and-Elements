class Orb {

  constructor(x,y) {
    this.radius = 25;
    this.x = x;
    this.y = y;
    this.gridX = x;
    this.gridY = y;
    this.selected = false;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
    ctx.fill();
  }

  move(x,y) {
    this.x = x;
    this.y = y;
  }

  drag(x,y) {
    if(this.selected) {
      this.x = x;
      this.y = y;
    }
  }

  clicked() {
    console.log("clicked");
    this.selected = true;
  }

  unclicked() {
    console.log("unclicked");
    this.selected = false;
  }

}

module.exports = Orb;
