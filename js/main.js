var width = 1100;
var height = 700;
var value = 0;
var context;
var level = 0;
var balls = [
  {active:false,x:200,y:200,dx:.707,dy:.707,color:"#0000ff",radius:20,bDamage:8,rank:0,cost:10},
  {active:false,x:300,y:300,dx:.707,dy:-.707,color:"#00ff00",radius:30,bDamage:45,rank:0,cost:100},
  {active:false,x:100,y:100,dx:-.707,dy:.707,color:"#ff0000",radius:10,bDamage:200,rank:0,cost:1000},
  {active:false,x:400,y:400,dx:-1,dy:-1,color:"#ffff00",radius:15,bDamage:2012,rank:0,cost:10000}
];
var enemies = [];
function addValue(number) {
  value = value + number;
  document.getElementById("value").innerHTML = value;
}
function levelBall(id){
  var tempBall = balls[id];
  if(value>=Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank))){
    if(tempBall.rank == 0){
      tempBall.active = true;
    }
    value -= Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank));
    tempBall.rank += 1;
    document.getElementById(id+"C").innerHTML = Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank));
    document.getElementById(id+"A").innerHTML = tempBall.rank;
    document.getElementById("value").innerHTML = value;
  }
}
function init() {
  context= myCanvas.getContext('2d');
  newLevel();
  setInterval(draw,10);
}
function newLevel() {
  level++;
  document.getElementById("level").innerHTML = level;
  enemies = [];
  for(i = 0;i<5;i++){
    var healthTemp = Math.floor(100*Math.pow(1.07,level-1));
    enemies.push({x:rand(100, 1000),y:rand(100, 600),health:healthTemp,sHealth:healthTemp,active:true,radius:rand(20,60)});
  }
}
function rand(min,max){
  return min + (Math.floor(Math.random() * (max-min)));
}
function levelCheck(){
  var allDisabled = true;
  for(var l = 0; l<enemies.length; l++){
    enemyCheck = enemies[l];
    if(enemyCheck.active){
      allDisabled = false;
    }
  }
  if(allDisabled){
    newLevel();
  }
}
function draw(){
  context.clearRect(0,0,width,height);
  for(var i = 0; i<enemies.length; i++){
    var enemyDraw = enemies[i];
    if(enemyDraw.active){
      context.beginPath();
      context.fillStyle="#000000";
      context.arc(enemyDraw.x,enemyDraw.y,enemyDraw.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      context.font = Math.floor(enemyDraw.radius/1.7)+"px Arial";
      context.textAlign="center";
      context.textBaseline="middle";
      context.fillStyle="#FFFFFF";
      context.fillText(Math.ceil((enemyDraw.health/enemyDraw.sHealth)*100)+"%",enemyDraw.x,enemyDraw.y);
    }
  }
  for(var i = 0; i<balls.length; i++){
    var ball = balls[i]
    if(ball.active){
      context.beginPath();
      context.fillStyle=ball.color;
      context.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      for(var e = 0; e<enemies.length; e++){
        var enemy = enemies[e];
        if(enemy.active){
          if(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2)<=Math.pow(enemy.radius+ball.radius,2)){
            if(enemy.health>ball.bDamage*ball.rank)
              {
                enemy.health -= ball.bDamage*ball.rank;
              }
            else
              {
                enemy.active = false;
                addValue(Math.floor(100*Math.pow(1.02,level-1)));
                levelCheck();
              }
            ball.dx = (ball.x - enemy.x)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
            ball.dy = (ball.y - enemy.y)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
          }
        }
      }
      if(ball.x<=ball.radius || ball.x>=(width-ball.radius)) ball.dx=-ball.dx;
      if(ball.y<=ball.radius || ball.y>=(height-ball.radius)) ball.dy=-ball.dy;
      ball.x+=ball.dx*4;
      ball.y+=ball.dy*4;
    }
  }
}
