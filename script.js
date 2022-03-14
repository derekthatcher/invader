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
var speed = 3;
var dx = (Math.random()*speed - speed/2)*speed;
var dy = -speed;
var ballRadius = 10;
var score = 0;
var lives = 3;



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

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//collision dection
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          drawBrick(b.x, b.y, "#ff564a");
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            message.innerHTML = "You Won!";
            speed = 0;
            dx = 0;
            dy = 0;

          }
        }
      }
    }
  }
}



// game loop
function draw() {
  //clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawScore();
  drawLives();


  //move the ball
  x += dx;
  y += dy;
  // paddle movement logic
  if (rightPressed) {

  } else if (leftPressed) {

  }
  requestAnimationFrame(draw);

}
draw();
