var width = 1100;
var height = 700;
var value = 0;
var context;
var balls = [
  {active:true,x:200,y:200,dx:.707,dy:.707,color:"#0000ff",radius:20,damage:0},
  {active:true,x:100,y:100,dx:-.707,dy:.707,color:"#ff0000",radius:10,damage:0},
  {active:true,x:300,y:300,dx:.707,dy:-.707,color:"#00ff00",radius:30,damage:0},
  {active:false,x:400,y:400,dx:-1,dy:-1,color:"#ffff00",radius:15,damage:0}
]
var enemies = [
  {x:50,y:50,health:100,active:true,color:"00ffff",radius:30},
  {x:50,y:120,health:200,active:false,color:"00ffff",radius:30},
  {x:50,y:200,health:100,active:true,color:"00ffff",radius:30},
  {x:650,y:50,health:100,active:true,color:"00ffff",radius:30},
  {x:650,y:200,health:100,active:true,color:"00ffff",radius:30},
]
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
  context.clearRect(0,0,width,height);
  for(var i = 0; i<enemies.length; i++){
    var enemyDraw = enemies[i];
    if(enemyDraw.active)
    {
      context.beginPath();
      context.fillStyle=enemyDraw.color;
      context.arc(enemyDraw.x,enemyDraw.y,enemyDraw.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
    }
  }
  for(var i = 0; i<balls.length; i++){
    var ball = balls[i]
    if(ball.active)
    {
      context.beginPath();
      context.fillStyle=ball.color;
      context.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      for(var e = 0; e<enemies.length; e++){
        var enemy = enemies[e];
        if(((ball.x-enemy.x)^2)+((ball.y-enemy.y)^2)<=((enemy.radius+ball.radius)^2){
          console.log("Collision");
          ball.dx = (ball.x - enemy.x)/(((ball.x-enemy.x)^2)+((ball.y-enemy.y)^2));
          ball.dy = (ball.y - enemy.y)/(((ball.x-enemy.x)^2)+((ball.y-enemy.y)^2));
        }
      }
      if(ball.x<=ball.radius || ball.x>=(width-ball.radius)) ball.dx=-ball.dx;
      if(ball.y<=ball.radius || ball.y>=(height-ball.radius)) ball.dy=-ball.dy;
      ball.x+=ball.dx*4;
      ball.y+=ball.dy*4;
    }
  }
}
