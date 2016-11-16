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
