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
