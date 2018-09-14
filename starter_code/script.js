var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var frames = 0;
var pipes = [];
var interval;
var gravity = 2;
//Clases
class Background{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./images/bg.png";
  }

  draw(){
    this.x --;
    if(this.x < -canvas.width) this.x = 0;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    ctx.drawImage(this.image,this.x+this.width,this.y,this.width,this.height);
  }
}
class Flappy{
  constructor(){
    this.x = 100;
    this.y = 190;
    this.width = 30;
    this.height = 30;
    this.image = new Image();
    this.image.src = "./images/flappy.png";
  }
  draw(){
    if(this.y < canvas.height-this.height) this.y += gravity;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
  collision(item){
    return (this.x < item.x + item.width) &&
    (this.x + this.width > item.x) &&
    (this.y < item.y + item.height) &&
    (this.y + this.height > item.y);
  }
}
class Pipes{
  constructor(pos, y , height){
    this.x = canvas.width;
    this.y = y;
    this.width = 60;
    this.height = height;
    this.image = new Image();
    this.image.src = pos === "top" ? "./images/obstacle_top.png" : "./images/obstacle_bottom.png";
  }
  draw(){
    this.x -= 2;
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}

//Instacnias
var fondo = new Background();
var flappy = new Flappy();

function drawPoints(){
  ctx.font = "30px Avenir";
  ctx.fillText(Math.round(frames/60), 800,20);
}
//Helpers
function start(){
  interval = setInterval(update,1000/60);
}
function update(){
  frames ++;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  fondo.draw();
  flappy.draw();
  generatePipes();
  drawPipes();
  drawPoints();
}

function gameOver(){
  clearInterval(interval);
  interval = undefined;
  ctx.font = "30px Avernir";
  ctx.fillText("Llama más temprano", 250,250);
  ctx.fillText("Pícale R para reiniciar",250,280);
}

function drawPipes(){
  pipes.forEach((pipe, index)=>{
    if(pipe.x < -canvas.width - pipe.width ) return pipes.splice(index,2);
    pipe.draw();
    if(flappy.collision(pipe)){
     gameOver(); 
    }
  });
}

function generatePipes(){
  if(!(frames % 150 === 0)) return;
  let height = Math.floor(Math.random() * (canvas.height * .6) + 40);  
  var pipe1 = new Pipes("top",0,height);
  var pipe2 = new Pipes(",",pipe1.height+120,canvas.height-pipe1.height-120);
  pipes.push(pipe1);
  pipes.push(pipe2);
}
function restar(){
  if(interval !== undefined) return;
  pipes = [];
  interval = undefined;
  frames = 0;
  start();
}

addEventListener("keydown",function(e){
  if(e.keyCode === 32 || e.keyCode === 38 ){
    if(flappy.y < 0) flappy.y = 0
    else flappy.y -= 100;
  }else if(e.keyCode === 82){
    restar();
  }
});

generatePipes();
start();