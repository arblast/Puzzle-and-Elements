const COLORS = ['water', 'wood', 'fire', 'electric', 'wind'];

class Orb {

  constructor(x,y) {
    this.radius = 34;
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.targetY = null;
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  }

  generateNewColor() {
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  }

  draw(ctx) {
    ctx.save();
    this.img = COLORS[this.color]
    if(this.disappearing && this.opacity >= 0.03) {
      this.opacity = this.opacity - 0.03;
    } else if (this.opacity < 0.03){
      this.disappearing = false;
      this.disappeared = true;
    } else {
      this.disappearing = false;
    }
    if(this.targetY && this.y <= (this.targetY + 0.1 - 10/3)) {
      this.y = this.y + 10/3;
    } else {
      this.targetY = null;
    }
    ctx.globalAlpha = this.opacity;
    // ctx.beginPath();
    // ctx.fillStyle = this.img;
    // ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
    // ctx.fill();
    let image = document.getElementById(this.color);
    ctx.drawImage(image,this.x - 34,this.y - 34,this.radius*2,this.radius*2);
    ctx.restore();
  }

  disappear() {
    this.disappearing = true;
  }

  respawn() {
    this.disappeared = false;
    this.opacity = 1;
  }

  select() {
    this.opacity = 0.4;
  }

  unselect() {
    this.opacity = 1;
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
