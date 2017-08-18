const COLORS = ['water', 'wood', 'fire', 'electric', 'wind', 'psion'];

class Orb {

  constructor(x,y) {
    this.radius = 34;
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.targetY = null;
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  }

  generateNewColor() { //randomly generates a color from the color array
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  }

  draw(ctx) { //animations for the orb
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
    if(this.targetY && this.y <= (this.targetY + 0.1 - 20/3)) {
      this.y = +(this.y + 20/3).toFixed(7);
    } else {
      this.targetY = null;
    }
    ctx.globalAlpha = this.opacity;
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

}

module.exports = Orb;
