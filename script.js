/* Invader game

derek @ Ao Tawhiti
*/
//page elements
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var message = document.getElementById("alert");
//variables
var x = canvas.width / 2;
var y = canvas.height - 30;
var speed = 10;
var shipSize = 30;
var score = 0;
var lives = 3;
var bullets = []; // list of bullets shot that are still on canvas.


//keyboard
var rightPressed = false;
var leftPressed = false;
//event handlers
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


function drawScore() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px monospace";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 85, 20);
}

function drawSpaceShip(x,y,size,fillColour){
  // draw ship centered on xy
  ctx.beginPath();
  ctx.rect(x-size/2, y-size/2, size, size);
  ctx.fillStyle = fillColour;
  ctx.fill();
  ctx.closePath();
}

function drawBullet(x,y,fillColour){
  // draw ship centered on xy
  ctx.beginPath();
  ctx.rect(x, y, 2, 5);
  ctx.fillStyle = fillColour;
  ctx.fill();
  ctx.closePath();
}

function fireBullet(){
  // add a delay that prevents rapidfire bullets.
  bullets.push({x: x, y: y, colour: "#0095DD" });
}

function drawBullets(){
  // draws bullets after incrementing x value.
  // if off top of screen remove them.
  for(var i = 0; i < bullets.length; i++) {
      bullets[i].y -= speed;
      if (bullets[i].y <= 0) {
        bullets.splice(i,1);
      }else {
        drawBullet(bullets[i].x, bullets[i].y, bullets[i].colour);
    }
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    x = relativeX - speed / 4;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
  if (e.key === ' ' || e.key === 'Spacebar') {
    fireBullet();
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}


// game loop
function draw() {
  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // main functions run each animation frame
  drawScore();
  drawLives();
  drawSpaceShip(x,y,shipSize,"#0095DD");
  drawBullets();

  // paddle movement logic
  if (rightPressed && x < canvas.width) {
    x += speed;
  } else if (leftPressed && x > 0) {
    x -= speed;
  }
  requestAnimationFrame(draw);

}
draw();
