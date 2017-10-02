var value = 0;
var context;
var balls = [
  {active:true,x:200,y:200,dx:3,dy:3,color:"#0000ff"},
  {active:true,x:100,y:100,dx:3,dy:3,color:"#ff0000"},
  {active:true,x:300,y:300,dx:3,dy:3,color:"#00ff00"},
  {active:false,x:400,y:400,dx:3,dy:3,color:"#ffff00"}
]
var y=200;
var dx=3;
var dy=3;
function addValue()
{
  value = value + 1;
  document.getElementById("value").innerHTML = value;
}
function init()
{
  context= myCanvas.getContext('2d');
  setInterval(draw,10);
}

function draw()
{
  context.clearRect(0,0, 500,500);
  for(var i = 0; i<balls.length; i++){
    var ball = balls[i]
    context.beginPath();
    context.fillStyle=ball.color;
    context.arc(ball.x,ball.y,20,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    if(ball.x<=20 || ball.x>=480) ball.dx=-ball.dx;
    if(ball.y<=20 || ball.y>=480) ball.dy=-ball.dy;
    ball.x+=ball.dx;
    ball.y+=ball.dy;
  }
}
