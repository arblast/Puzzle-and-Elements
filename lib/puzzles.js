document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 800;
  canvasEl.height = 800;

  const ctx = canvasEl.getContext("2d");

  const render = (x,y) => {
    ctx.clearRect(0,0,800,800);
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.arc(x,y,50,0,2*Math.PI,false);
    ctx.fill();
  }

  const movemouse = (e) => {
    render(e.x,e.y)
  }
  canvasEl.onmousedown = () => canvasEl.addEventListener("mousemove", movemouse);
  canvasEl.onmouseup = () => canvasEl.removeEventListener("mousemove",movemouse);
});
