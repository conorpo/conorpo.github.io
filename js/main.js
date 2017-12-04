var width = 1200;
var height = 900;
var value = 0;
var context;
var level = 1;
var click = {multi: 1.07,rank: 1, bCost: 10,bDamage:10}
var baseCostMulti = 1.07;
var baseHealthMulti = 1.07;
var startingBalls = 10;
var balls = [
  {active:false,x:200,y:200,dx:.707,dy:.707,color:"#5555ff",radius:20,bDamage:8,rank:0,cost:10,id:0,clone:false,speed:4},
  {active:false,x:300,y:300,dx:.707,dy:-.707,color:"#00ff00",radius:30,bDamage:300,rank:0,cost:1000,id:1,clone:false,speed:4},
  {active:false,x:100,y:100,dx:-.707,dy:.707,color:"#ff0000",radius:10,bDamage:50000,rank:0,cost:100000,id:2,clone:false,speed:3},
  {active:false,x:400,y:400,dx:-.707,dy:-.707,color:"#ffff00",radius:15,bDamage:800000,rank:0,cost:10000000,id:3,clone:false,speed:6},
  {active:false,x:900,y:300,dx:-.707,dy:.707,color:"#FFA500",radius:48,bDamage:40000000,rank:0,cost:1000000000,id:4,clone:false,speed:2},
  {active:false,x:1000,y:200,dx:-.707,dy:-.707,color:"#800080",radius:5,bDamage:5000000000,rank:0,cost:100000000000,id:5,clone:false,speed:8},
  {active:false,x:1200,y:300,dx:.707,dy:.707,color:"#00C7D1",radius:15,bDamage:185000000000,rank:0,cost:10000000000000,id:6,clone:false,speed:4},
  {active:false,x:1100,y:400,dx:-.707,dy:-.707,color:"#EE33A1",radius:40,bDamage:4000000000000,rank:0,cost:1000000000000000,id:7,clone:false,speed:8},
  {active:false,x:300,y:500,dx:.707,dy:-.707,color:"#2ED371",radius:20,bDamage:800000000000000,rank:0,cost:100000000000000000,id:8,clone:false,speed:4},
  {active:false,x:600,y:200,dx:-.707,dy:.707,color:"#800000",radius:2,bDamage:400000000000000000,rank:0,cost:10000000000000000000,id:9,clone:false,speed:4}
];
var clickBalls = [
  {active:false,x:300,y:200,dx:-.707,dy:.707,color:"#666666",radius:20,bDamage:10,rank:1,cost:10,id:100,clone:false,speed:4},
  {active:false,x:200,y:200,dx:-.707,dy:.707,color:"#666666",radius:20,bDamage:10,rank:1,cost:10,id:101,clone:false,speed:4},
  {active:false,x:500,y:200,dx:-.707,dy:.707,color:"#666666",radius:20,bDamage:10,rank:1,cost:10,id:102,clone:false,speed:4},
  {active:false,x:700,y:200,dx:-.707,dy:.707,color:"#666666",radius:20,bDamage:10,rank:1,cost:10,id:103,clone:false,speed:4},
  {active:false,x:100,y:200,dx:-.707,dy:.707,color:"#666666",radius:20,bDamage:10,rank:1,cost:10,id:104,clone:false,speed:4}
]
var enemies = [];
var shrink = false;
var nightMode = false;
var ballPoints = 0;
var prestiged = 0;
var normalWidth = 1200;
var zoomed = false;
var pUpgrades = [0,0,0,0,0,0,0,0,0,0,0,0];
var pCountMulti = 1;
var strengthBoost = 10;
var speedMulti = 1;
var radiusMulti = 1;
var animationSpeed = 0;
var strengthBoostReq = 100;
var cloneReq = 50;
var enemyRadiusMulti = 1;
var ballPointMulti = 1;
var notationScientfic = false;
var bondRate = 0.001;
var exciteRate = 0.001;
var autoBonds;
var autoExcites;
//CPS stuff
var cps = document.getElementById("cps");
var count = 0;
var numSec = 1;
var start = 0;
getCPS();
function getCPS() {
  setTimeout(function() {
    if(count>=20){
      clickBalls[0].active = true;
      clickBalls[1].active = true;
      clickBalls[2].active = true;
      clickBalls[3].active = true;
      clickBalls[4].active = true;
    }
    else if(count>=15){
      clickBalls[0].active = true;
      clickBalls[1].active = true;
      clickBalls[2].active = true;
      clickBalls[3].active = true;
      clickBalls[4].active = false;
    }
    else if(count>=10){
      clickBalls[0].active = true;
      clickBalls[1].active = true;
      clickBalls[2].active = true;
      clickBalls[3].active = false;
      clickBalls[4].active = false;
    }
    else if(count>=5){
      clickBalls[0].active = true;
      clickBalls[1].active = true;
      clickBalls[2].active = false;
      clickBalls[3].active = false;
      clickBalls[4].active = false;
    }
    else if(count>=1){
      clickBalls[0].active = true;
      clickBalls[1].active = false;
      clickBalls[2].active = false;
      clickBalls[3].active = false;
      clickBalls[4].active = false;
    }
    else{
      clickBalls[0].active = false;
      clickBalls[1].active = false;
      clickBalls[2].active = false;
      clickBalls[3].active = false;
      clickBalls[4].active = false;
    }
    cps.innerHTML = count;
    count = 0;
    getCPS();
  }, numSec*1000);
}
function bond(){
  count++;
  start++;
}
function excite(){
  for(var e = 0; e<balls.length+clickBalls.length; e++){
    if(e>(balls.length-1)){
      var eBall = clickBalls[e-balls.length];
    }
    else{
      var eBall = balls[e];
    }
    if(eBall.active){
      if(Math.abs(eBall.dx)<0.05 || Math.abs(eBall.dy)<0.05){
        if(rand(1,100)>50){
          eBall.dx=.707;
        }
        else{
          eBall.dx=-.707;
        }
        if(rand(1,100)>50){
          eBall.dy=.707;
        }
        else{
          eBall.dy=-.707;
        }
      }
    }
  }
}
function clickLevel(){
  if(value>=Math.floor(click.bCost*Math.pow(click.multi,click.rank))){
    value-=Math.floor(click.bCost*Math.pow(click.multi,click.rank));
    valueSet();
    click.rank++;
    if(click.rank%strengthBoostReq == 0){
      click.bDamage *= 5 * strengthBoost;
    }
    for(var y = 0; y < 5;y++){
      clickBalls[y].rank = click.rank;
      clickBalls[y].bDamage = click.bDamage;
    }
    if(notationScientfic){
        document.getElementById("CC").innerHTML = numberformat.format(Math.floor(click.bCost*Math.pow(click.multi,click.rank)),{format: 'scientific'});
    }
    else{
        document.getElementById("CC").innerHTML = numberformat.format(Math.floor(click.bCost*Math.pow(click.multi,click.rank)));
    }
    document.getElementById("CA").innerHTML = click.rank;
  }
}
function levelBall(id){
  var tempBall = balls[id];
  strengthBoost = 10+pUpgrades[3];
  strengthBoostReq = 100-pUpgrades[2];
  cloneReq = 50-pUpgrades[7];
  if(value>=Math.floor(tempBall.cost*Math.pow(baseCostMulti,tempBall.rank))){
    if(tempBall.rank == 0){
      tempBall.active = true;
      document.getElementById(id+"T").innerHTML = "Upgrade";
    }
    value -= Math.floor(tempBall.cost*Math.pow(baseCostMulti,tempBall.rank));
    tempBall.rank += 1;
    if(tempBall.rank%strengthBoostReq == 0){
      tempBall.bDamage *= strengthBoost;
    }
    if(tempBall.rank%cloneReq == 0){
      balls.push({active:true,x:rand(100,width-100),y:rand(100,height-100),dx:.707,dy:-.707,color:tempBall.color,
        radius:tempBall.radius,id:tempBall.id,clone:true,speed:tempBall.speed});
    }
    if(notationScientfic){
        document.getElementById(id+"C").innerHTML = numberformat.format(Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank)),{format: 'scientific'});
    }
    else{
        document.getElementById(id+"C").innerHTML = numberformat.format(Math.floor(tempBall.cost*Math.pow(1.07,tempBall.rank)));
    }
    document.getElementById(id+"A").innerHTML = tempBall.rank;
    valueSet();
  }
  var deactiveBalls = 0;
  for(var k = 0; k<startingBalls;k++){
    if (balls[k].active == false){
      deactiveBalls++;
    }
  }
  pCountMulti = (((Math.floor((balls.length-deactiveBalls)/5))*(0.3*pUpgrades[1]))+1);
}
function init(){
  context= myCanvas.getContext('2d');
  document.getElementById("defaultOpen").click();
  var savegame = JSON.parse(localStorage.getItem("save"));
  if(savegame){
    if (typeof savegame.pUpgrades !== "undefined"){
      pUpgrades = savegame.pUpgrades;
      var deactiveBalls = 0;
      for(var k = 0; k<startingBalls;k++){
        if (balls[k].active == false){
          deactiveBalls++;
        }
      }
      bondRate = pUpgrades[0];
      if(bondRate == 0){
        bondRate = 0.01;
      }
      pCountMulti = (((Math.floor((balls.length-deactiveBalls)/5))*(0.3*pUpgrades[1]))+1);
      strengthBoostReq = 100-pUpgrades[2];
      strengthBoost = 10+pUpgrades[3];
      speedMulti = (0.1*pUpgrades[4])+1;
      radiusMulti = 1 +(0.1*pUpgrades[5]);
      exciteRate = pUpgrades[6];
      if(exciteRate == 0){
        exciteRate = 0.01;
      }
      cloneReq = 50-pUpgrades[7];
      enemyRadiusMulti = 1 + (0.1 * pUpgrades[9]);
      ballPointMulti = 1 + (0.1 * pUpgrades[11]);
      document.getElementById("1p").innerHTML = bondRate;
      document.getElementById("2p").innerHTML = Math.round(((0.3*pUpgrades[1])+1)*100);
      document.getElementById("3p").innerHTML = strengthBoostReq;
      document.getElementById("4p").innerHTML = strengthBoost;
      document.getElementById("5p").innerHTML = Math.round(100*speedMulti);
      document.getElementById("6p").innerHTML = Math.round(100*radiusMulti);
      document.getElementById("7p").innerHTML = exciteRate;
      document.getElementById("8p").innerHTML = cloneReq;
      document.getElementById("9p").innerHTML = numberformat.format(10*(Math.pow(10,pUpgrades[8])));
      document.getElementById("10p").innerHTML = Math.round(100*enemyRadiusMulti);
      document.getElementById("11p").innerHTML = 5*pUpgrades[10];
      document.getElementById("12p").innerHTML = Math.round(100*ballPointMulti);
    }
    if (typeof savegame.nightMode !== "undefined" && savegame.nightMode){
      toggleNightMode();
    }
    if (typeof savegame.notation !== "undefined" && savegame.notation){
      changeNotation();
    }
    if (typeof savegame.value !== "undefined") value = Math.round(savegame.value);
    if (typeof savegame.level !== "undefined") level = savegame.level;
    if (typeof savegame.clickObject !== "undefined"){
      click.rank = savegame.clickObject.rank;
      for(var n = 1; n <= (click.rank/strengthBoostReq); n++){
        click.bDamage *= 5*strengthBoost;
      }
      for(var y = 0; y < 5;y++){
        clickBalls[y].rank = click.rank;
        clickBalls[y].bDamage = click.bDamage;
      }
      if(notationScientfic){
          document.getElementById("CC").innerHTML = numberformat.format(Math.floor(click.bCost*Math.pow(click.multi,click.rank)),{format: 'scientific'});
      }
      else{
          document.getElementById("CC").innerHTML = numberformat.format(Math.floor(click.bCost*Math.pow(click.multi,click.rank)));
      }
      document.getElementById("CA").innerHTML = click.rank;
    }
    for(var l = 0; l < startingBalls;l++){
      if (typeof savegame.ranks[l] !== "undefined"){
        var loadBall = balls[l];
        var loadData = savegame.ranks[l];
        loadBall.rank = loadData;
        if(loadData > 0){
          loadBall.active = true;
          document.getElementById(loadBall.id+"T").innerHTML = "Upgrade";
        }
        for(var r = 1; r <= (loadData/strengthBoostReq); r++){
          loadBall.bDamage *= strengthBoost;
        }
        for(var c = 1; c <= (loadData/50); c++){
          balls.push({active:true,x:rand(100,width-100),y:rand(100,height-100),dx:.707,dy:-.707,color:loadBall.color,
            radius:loadBall.radius,id:loadBall.id,clone:true,speed:loadBall.speed});
        }
        if(notationScientfic){
            document.getElementById(loadBall.id+"C").innerHTML = numberformat.format(Math.floor(loadBall.cost*Math.pow(1.07,loadBall.rank)),{format: 'scientific'});
        }
        else{
            document.getElementById(loadBall.id+"C").innerHTML = numberformat.format(Math.floor(loadBall.cost*Math.pow(1.07,loadBall.rank)));
        }
        document.getElementById(loadBall.id+"A").innerHTML = loadBall.rank;
      }
    }
    if (typeof savegame.zoomed !== "undefined"){
      zoomed = savegame.zoomed;
      if(!savegame.zoomed){
        alert("Press Ctrl + and Ctrl - until the 'Ball Area' and the menu fit nicely together.");
        zoomed = true;
      }
    }
    else{
        alert("Press Ctrl + and Ctrl - until the 'Ball Area' and the menu fit nicely together.");
        zoomed = true;
    }
    if (typeof savegame.prestiged !== "undefined") prestiged = savegame.prestiged;
    if (typeof savegame.ballPoints !== "undefined") ballPoints = savegame.ballPoints;
    if(notationScientfic){
      document.getElementById("BP").innerHTML = numberformat.format(ballPoints);
      document.getElementById("IncomeMulti").innerHTML = numberformat.format(ballPoints*100*ballPointMulti);
    }
    else{
      document.getElementById("BP").innerHTML = numberformat.format(ballPoints, {format: 'scientific'});
      document.getElementById("IncomeMulti").innerHTML = numberformat.format(ballPoints*100, {format: 'scientific'});
    }
    if(typeof savegame.clicks !== "undefined"){
      start = savegame.clicks;
    }
    valueSet();
  }
  level--;
  newLevel(false);
  spawnEnemies();
  autoBonds = setInterval(function(){ bond() },1000/bondRate);
  autoExcites = setInterval(function(){ excite() },60000/exciteRate);
  setInterval(function(){ draw() },20);
  setInterval(function(){ save() },60000);
}
function newLevel(prest) {
  level++;
  document.getElementById("level").innerHTML = level;
  enemies = [];
  if(prest){
    spawnEnemies();
  }
  else{
      if(level%10 == 0){
    shrink = true;
  }
  else if(level%10 == 1){
    shrink = false;
  }
  else{
    spawnEnemies();
  }
  }
}
function spawnEnemies(){
  if(level%10 == 0){
    var healthTemp = Math.floor(10000*Math.pow(baseHealthMulti,level-1));
    enemies.push({x:width/2,y:height/2,health:healthTemp,sHealth:healthTemp,active:true,radius:(height/2)-100});
    var boss = enemies[0];
    for(var b = 0; b<balls.length;b++){
      if(balls[b].active){
        if(rand(0,100)>=50){
          balls[b].x = 50;
        }
        else{
          balls[b].x = width-50;
        }
      }
    }
  }
  else{
    for(i = 0;i<5;i++){
      var healthTemp = Math.floor(100*Math.pow(baseHealthMulti,level-1));
      enemies.push({x:rand(100, width-100),y:rand(100, height-100),health:healthTemp,sHealth:healthTemp,active:true,radius:rand(20,60)*enemyRadiusMulti});
    }
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
    newLevel(false);
  }
}
function draw(){
  if(shrink == true&&myCanvas.width > height){
    myCanvas.width *= 0.995 - (0.05*Math.min(ballPoints/50,1));
    width *= 0.995 - (0.05*Math.max(ballPoints/50,1));
  }
  else if(shrink == true&&myCanvas.width < height){
    myCanvas.width = height;
    width = height;
    spawnEnemies();
  }
  else if(shrink == false&&myCanvas.width < normalWidth){
    myCanvas.width *= 1.005 + (0.05*Math.min(ballPoints/50,1));
    width *= 1.005 + (0.05*Math.min(ballPoints/50,1));
  }
  else if(shrink == false&&myCanvas.width > normalWidth){
    myCanvas.width = normalWidth;
    width = normalWidth;
    spawnEnemies();
  }
  context.clearRect(0,0,width,height);
  for(var i = 0; i<enemies.length; i++){
    var enemyDraw = enemies[i];
    if(enemyDraw.active){
      context.beginPath();
      if(nightMode){
        context.fillStyle="#ffffff";
      }
      else{
        context.fillStyle="#000000";
      }
      context.arc(enemyDraw.x,enemyDraw.y,enemyDraw.radius,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      context.font = Math.floor(enemyDraw.radius/1.7)+"px Arial";
      context.textAlign="center";
      context.textBaseline="middle";
      if(nightMode){
        context.fillStyle="#000000";
      }
      else{
        context.fillStyle="#ffffff";
      }
      context.fillText(Math.ceil((enemyDraw.health/enemyDraw.sHealth)*100)+"%",enemyDraw.x,enemyDraw.y);
    }
  }
  for(var i = 0; i<balls.length+clickBalls.length; i++){
    if(i>(balls.length-1)){
      var ball = clickBalls[i-balls.length];
    }
    else{
      var ball = balls[i];
    }
    if(ball.active){
      context.beginPath();
      context.fillStyle=ball.color;
      context.arc(ball.x,ball.y,ball.radius*radiusMulti,0,Math.PI*2,true);
      context.closePath();
      context.fill();
      for(var e = 0; e<enemies.length; e++){
        var enemy = enemies[e];
        if(enemy.active){
          if(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2)<=Math.pow(enemy.radius+(ball.radius*radiusMulti),2)){
            if(ball.clone){
              ball = balls[ball.id];
            }
            if(enemy.health>ball.bDamage*ball.rank*pCountMulti)
              {
                enemy.health -= ball.bDamage*ball.rank*pCountMulti;
              }
            else
              {
                enemy.active = false;
                value += Math.round(enemy.sHealth * Math.round((ballPoints+1)*ballPointMulti));
                valueSet();
                levelCheck();
              }
            if(ball.id<100){
              var ball = balls[i]
            }
            ball.dx = (ball.x - enemy.x)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
            ball.dy = (ball.y - enemy.y)/Math.sqrt(Math.pow(ball.x-enemy.x,2)+Math.pow(ball.y-enemy.y,2));
          }
        }
      }
      if(ball.x<=(ball.radius*radiusMulti) || ball.x>=(width-(ball.radius*radiusMulti))) ball.dx=-ball.dx;
      if(ball.y<=(ball.radius*radiusMulti) || ball.y>=(height-(ball.radius*radiusMulti))) ball.dy=-ball.dy;
      if(ball.x<(ball.radius*radiusMulti)){
        ball.x = ball.radius*radiusMulti;
      }
      else if (ball.x>(width-(ball.radius*radiusMulti))){
        ball.x = width-ball.radius*radiusMulti;
      }
      if(ball.y<(ball.radius*radiusMulti)){
        ball.y = ball.radius*radiusMulti;
      }
      else if (ball.y>(height-(ball.radius*radiusMulti))){
        ball.y = height-ball.radius*radiusMulti;
      }
      ball.x+=ball.dx*ball.speed*speedMulti*2;
      ball.y+=ball.dy*ball.speed*speedMulti*2;
    }
  }
}
function save(){
  var ranks = [];
  for(var s = 0; s < startingBalls; s++){
    ranks.push(balls[s].rank)
  }
  var save = {
    value: value,
    level: level,
    ranks: ranks,
    nightMode: nightMode,
    ballPoints: ballPoints,
    zoomed: zoomed,
    prestiged: prestiged,
    pUpgrades: pUpgrades,
    clickObject: click,
    clicks: start,
    notation: notationScientfic
  }
  localStorage.setItem("save",JSON.stringify(save));
  document.getElementById("save").innerHTML = "Saved!";
  window.setTimeout(reAddSave,3000);
}
function reAddSave(){
  document.getElementById("save").innerHTML = "Save Game";
}
function toggleNightMode(){
  if(nightMode){
    nightMode = false;
    document.getElementById("body").style.backgroundColor = "#ffffff";
    document.getElementById("p1").style.color = "#000000";
    document.getElementById("p2").style.color = "#000000";
    document.getElementById("p3").style.color = "#000000";
    document.getElementById("p4").style.color = "#000000";
    document.getElementById("p5").style.color = "#000000";
    document.getElementById("p6").style.color = "#000000";
    document.getElementById("p7").style.color = "#000000";
    document.getElementById("p8").style.color = "#000000";
    document.getElementById("p8").style.color = "#000000";
    document.getElementById("myCanvas").style.border = "3px solid #000000";
    document.getElementById("Balls").style.border = "1px solid #000000";
    document.getElementById("Tutorial").style.border = "1px solid #000000";
    document.getElementById("Prestige").style.border = "1px solid #000000";
    document.getElementById("Options").style.border = "1px solid #000000";
    document.getElementById("Changelog").style.border = "1px solid #000000";
    document.getElementById("Leaderboard").style.border = "1px solid #000000";
  }
  else{
    nightMode = true;
    document.getElementById("body").style.backgroundColor = "#000000";
    document.getElementById("p1").style.color = "#ffffff";
    document.getElementById("p2").style.color = "#ffffff";
    document.getElementById("p3").style.color = "#ffffff";
    document.getElementById("p4").style.color = "#ffffff";
    document.getElementById("p5").style.color = "#ffffff";
    document.getElementById("p6").style.color = "#ffffff";
    document.getElementById("p7").style.color = "#ffffff";
    document.getElementById("p8").style.color = "#ffffff";
    document.getElementById("myCanvas").style.border = "3px solid #ffffff";
    document.getElementById("Balls").style.border = "1px solid #ffffff";
    document.getElementById("Tutorial").style.border = "1px solid #ffffff";
    document.getElementById("Prestige").style.border = "1px solid #ffffff";
    document.getElementById("Options").style.border = "1px solid #ffffff";
    document.getElementById("Changelog").style.border = "1px solid #ffffff";
    document.getElementById("Leaderboard").style.border = "1px solid #ffffff";
  }
}
function wipeSave(){
  if(confirm("Are you sure you want to wipe your save? THIS WILL RESET EVERYTHING AND YOU WILL HAVE NOTING") == true){
    localStorage.setItem("save",null);
    location.reload();
  }
}
function prestige(){
  if(level >= 400){
    if(confirm("Are you sure you want to Prestige? This will get rid of all your numbers, all your levels and all your ball upgrades/clones. It will not get rid of Achievements or Prestige Upgrades. By prestiging you will get 1 Ball Point which gives you 100% more income (additive)") == true){
      ballPoints += Math.pow(2,(Math.floor((level-400)/100)));
      prestiged++;
      level = (5*pUpgrades[10]);
      click.rank = 1;
      click.bDamage = 10;
      value = 10 * Math.pow(10,pUpgrades[8]);
      balls = [
        {active:false,x:200,y:200,dx:.707,dy:.707,color:"#5555ff",radius:20,bDamage:8,rank:0,cost:10,id:0,clone:false,speed:4},
        {active:false,x:300,y:300,dx:.707,dy:-.707,color:"#00ff00",radius:30,bDamage:300,rank:0,cost:1000,id:1,clone:false,speed:4},
        {active:false,x:100,y:100,dx:-.707,dy:.707,color:"#ff0000",radius:10,bDamage:50000,rank:0,cost:100000,id:2,clone:false,speed:3},
        {active:false,x:400,y:400,dx:-.707,dy:-.707,color:"#ffff00",radius:15,bDamage:800000,rank:0,cost:10000000,id:3,clone:false,speed:6},
        {active:false,x:900,y:300,dx:-.707,dy:.707,color:"#FFA500",radius:48,bDamage:40000000,rank:0,cost:1000000000,id:4,clone:false,speed:2},
        {active:false,x:1000,y:200,dx:-.707,dy:-.707,color:"#800080",radius:5,bDamage:5000000000,rank:0,cost:100000000000,id:5,clone:false,speed:8},
        {active:false,x:1200,y:300,dx:.707,dy:.707,color:"#00C7D1",radius:15,bDamage:185000000000,rank:0,cost:10000000000000,id:6,clone:false,speed:4},
        {active:false,x:1100,y:400,dx:-.707,dy:-.707,color:"#EE33A1",radius:40,bDamage:4000000000000,rank:0,cost:1000000000000000,id:7,clone:false,speed:8},
        {active:false,x:300,y:500,dx:.707,dy:-.707,color:"#2ED371",radius:20,bDamage:800000000000000,rank:0,cost:100000000000000000,id:8,clone:false,speed:4},
        {active:false,x:600,y:200,dx:-.707,dy:.707,color:"#800000",radius:2,bDamage:400000000000000000,rank:0,cost:10000000000000000000,id:9,clone:false,speed:4}
      ];
      if(notationScientfic){
          for(var p = 0; p < startingBalls; p++){
              document.getElementById(p+"T").innerHTML = "Buy";
              document.getElementById(p+"C").innerHTML = numberformat.format((Math.pow(100,p+1))/10,{format: 'scientific'});
              document.getElementById(p+"A").innerHTML = 0;
          }
      }
      else{
          for(var p = 0; p < startingBalls; p++){
              document.getElementById(p+"T").innerHTML = "Buy";
              document.getElementById(p+"C").innerHTML = numberformat.format((Math.pow(100,p+1))/10);
              document.getElementById(p+"A").innerHTML = 0;
          }
      }
      document.getElementById("CC").innerHTML = 10;
      document.getElementById("CA").innerHTML = 1;
      document.getElementById("BP").innerHTML = ballPoints;
      document.getElementById("IncomeMulti").innerHTML = ballPoints*100;
      document.getElementById("level").innerHTML = 5*pUpgrades[10];
      valueSet();
      newLevel(true);
    }
  }
  else{
    alert("You need to be at level 400 to Prestige.")
  }
}
function switchTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
function prestigeUpgrade(id){
  switch(id){
    case 1:
        if(ballPoints >= 3 && pUpgrades[id-1] < 25){
            pUpgrades[id-1]++;
            ballPoints -= 3;
            bondRate = pUpgrades[id-1];
            clearInterval(autoBonds);
            autoBonds = 0;
            autoBonds = setInterval(function(){ bond() },1000/bondRate);
            document.getElementById(id+"p").innerHTML = bondRate;
        }
        break;
    case 2:
        if(ballPoints >= 1){
            pUpgrades[id-1]++;
            ballPoints -= 1;
            var deactiveBalls = 0;
            for(var k = 0; k<startingBalls;k++){
              if (balls[k].active == false){
                deactiveBalls++;
              }
            }
            pCountMulti = (((Math.floor((balls.length-deactiveBalls)/5))*(0.3*pUpgrades[id-1]))+1);
            document.getElementById(id+"p").innerHTML = Math.round(((0.3*pUpgrades[id-1])+1)*100);
        }
        break;
    case 3:
        if(ballPoints >= 3 && pUpgrades[id-1]<50){
            pUpgrades[id-1]++;
            ballPoints -= 3;
            strengthBoostReq = 100-pUpgrades[id-1];
            document.getElementById(id+"p").innerHTML = strengthBoostReq;
        }
        break;
    case 4:
        if(ballPoints >= 4){
            pUpgrades[id-1]++;
            ballPoints -= 4;
            strengthBoost = 10+pUpgrades[id-1];
            document.getElementById(id+"p").innerHTML = 10*strengthBoost;
        }
        break;
    case 5:
        if(ballPoints >= 1 && pUpgrades[id-1]<20){
            pUpgrades[id-1]++;
            ballPoints -= 1;
            speedMulti = (0.1*pUpgrades[id-1])+1;
            document.getElementById(id+"p").innerHTML = Math.round(100*speedMulti);
        }
        break;
    case 6:
        if(ballPoints >= 1 && pUpgrades[id-1]<20){
            pUpgrades[id-1]++;
            ballPoints -= 1;
            radiusMulti = 1 +(0.1*pUpgrades[id-1]);
            document.getElementById(id+"p").innerHTML = Math.round(100*radiusMulti);
        }
        break;
    case 7:
        if(ballPoints >= 2 && pUpgrades[id-1]<60){
            pUpgrades[id-1]++;
            ballPoints -= 2;
            exciteRate = pUpgrades[id-1];
            clearInterval(autoExcites);
            autoExcites = 0;
            autoExcites = setInterval(function(){ excite() },60000/exciteRate);
            document.getElementById(id+"p").innerHTML = exciteRate;
        }
        break;
    case 8:
        if(ballPoints >= 5 && pUpgrades[id-1]<25){
            pUpgrades[id-1]++;
            ballPoints -= 5;
            cloneReq = 50-pUpgrades[id-1];
            document.getElementById(id+"p").innerHTML = cloneReq;
        }
        break;
    case 9:
        if(ballPoints >= Math.pow(2,pUpgrades[id-1])){
            ballPoints -= Math.pow(2,pUpgrades[id-1])
            pUpgrades[id-1]++;;
            document.getElementById(id+"p").innerHTML = numberformat.format(10*(Math.pow(10,pUpgrades[id-1])));
            document.getElementById(id+"b").innerHTML = Math.pow(2,pUpgrades[id-1]);
        }
        break;
    case 10:
        if(ballPoints >= 1 && pUpgrades[id-1]<10){
            pUpgrades[id-1]++;
            ballPoints -= 1;
            enemyRadiusMulti = 1 + (0.1 * pUpgrades[id-1]);
            document.getElementById(id+"p").innerHTML = Math.round(100*enemyRadiusMulti);
        }
        break;
    case 11:
        if(ballPoints >= 10){
            pUpgrades[id-1]++;
            ballPoints -= 10;
            document.getElementById(id+"p").innerHTML = 5*pUpgrades[id-1];
        }
        break;
    case 12:
        if(ballPoints >= 5){
            pUpgrades[id-1]++;
            ballPoints -= 5;
            ballPointMulti = 1 + (0.1 * pUpgrades[id-1]);
            document.getElementById(id+"p").innerHTML = Math.round(100*ballPointMulti);
        }
    }
    document.getElementById("BP").innerHTML = ballPoints;
    document.getElementById("IncomeMulti").innerHTML = Math.round(ballPoints*100*ballPointMulti);
}
function valueSet(){
  if(notationScientfic){
      document.getElementById("value").innerHTML = numberformat.format(value, {format: 'scientific'})
  }
  else{
      document.getElementById("value").innerHTML = numberformat.format(value);
  }
}
function changeNotation(){
  if(notationScientfic){
    notationScientfic = false;
    document.getElementById("notation").innerHTML = "Change Notation to Scientific";
  }
  else{
    notationScientfic = true;
    document.getElementById("notation").innerHTML = "Change Notation to Standard";
  }
}
