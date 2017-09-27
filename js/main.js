var value = 0;
var context;
var x=100;
var y=200;
var dx=3;
var dy=3;
function addValue(){
  value = value + 1;
  document.getElementById("value").innerHTML = value;
  if(dx<0){
    dx = -3 * (1.001*value);
  }
  else{
    dx = 3 * (1.001*value);
  }
  if(dy<0){
    dy = -3 * (1.001*value);
  }
  else{
    dy = 3 * (1.001*value);
  }
}
function init()
{
  context= myCanvas.getContext('2d');
  setInterval(draw,10);
}

function draw()
{
  context.clearRect(0,0, 500,400);
  context.beginPath();
  context.fillStyle="#0000ff";
  // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
  context.arc(x,y,20,0,Math.PI*2,true);
  context.closePath();
  context.fill();
  // Boundary Logic
if( x<=20 || x>=480) dx=-dx;
if( y<=20 || y>=380) dy=-dy;
x+=dx;
y+=dy;
}
