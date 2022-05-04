/* Invader game

derek @ Ao Tawhiti
*/
//page elements
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var message = document.getElementById("alert");
var bulletCount = document.getElementById("bullets");
var alienCount = document.getElementById("aliens");
//variables
var x = canvas.width / 2;
var y = canvas.height - 30;
var speed = 5;

var shipSize = 30;
var score = 0;
var lives = 3;
var shipHit = 0;
var deathCount = -10;
var lastBullet = +new Date;
var bullets = []; // list of bullets shot that are still on canvas.
var stars = []; // list of stars that are still on canvas. need to randomly genertate or rotate
var aliens = [];
var img = new Image();
img.src = "rocket.png"; //transparent png
var imgHit = new Image();
imgHit.src = "rocketHit.png"; //transparent png
var explosion = new Image();
explosion.src = "explosion.png"; //transparent png
var alienShip = new Image();
alienShip.src = "alien.png"; //transparent png

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

function drawSpaceShip(x, y, size, fillColour) {
  // draw ship centered on xy
   if (deathCount >= 0){
     var sHeight = 7-Math.floor((deathCount-1)/8);
     var swidth = deathCount%8 == 0 ? 0 : deathCount%8;
     ctx.drawImage(explosion, swidth * 100, sHeight * 100, 100, 80, x-40, y-50, 100, 100);
   }else {
    if (shipHit == 0) {
      ctx.drawImage(img, x - size / 2, y - size);
    } else {
      ctx.drawImage(imgHit, x - size / 2, y - size);
      shipHit -= 1;
    }
  }
}

function drawBullet(x, y, fillColour) {
  // draw ship centered on xy
  ctx.beginPath();
  ctx.rect(x, y, 3, 17);
  ctx.fillStyle = fillColour;
  ctx.fill();
  ctx.closePath();
}

function fireBullet() {
  // add a delay that prevents rapidfire bullets - 500 milliseconds
  let timeNow = +new Date;
  if(lastBullet + 500 < timeNow) {
    lastBullet = timeNow;
    bullets.push({
      x: x,
      y: y,
      colour: "#fc033d"
    });
    score -= 1;
}
}

function drawBullets() {
  // draws bullets after incrementing x value.
  // if off top of screen remove them.
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].y -= speed;
    if (bullets[i].y <= 0) {
      bullets.splice(i, 1);
    } else {
      drawBullet(bullets[i].x, bullets[i].y, bullets[i].colour);
    }
  }
}

function drawStar(star) {
  // draw star centered on xy
  ctx.beginPath();
  ctx.rect(star.x, star.y, star.size, star.size);
  ctx.fillStyle = star.colour;
  ctx.fill();
  ctx.closePath();
}

function drawStars() {
  // draws starss after incrementing x value.
  // if off bottom of screen remove them.
  for (var i = 0; i < stars.length; i++) {
    stars[i].y += speed / 2;
    if (stars[i].y >= canvas.height) {
      stars[i].y = 0;
    } else {
      drawStar(stars[i]);
    }
  }
}

function generateStars() {
  for (var i = 0; i <= 100; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      colour: "#ffffff",
      size: Math.floor(Math.random() * 3 + 1)
    });
  }
}

function drawAlien(x, y, fillColour) {
  // draw alien xy
  ctx.drawImage(alienShip, x, y);

}

function drawExlpodingAlien(x, y, radius) {
  // credit to explosions images https://opengameart.org/
  //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  var sHeight = 7-Math.floor((radius-1)/8);
  var swidth = radius%8 == 0 ? 0 : radius%8;
  ctx.drawImage(explosion, swidth * 100, sHeight * 100, 100, 80, x-20, y-50, 100, 100);
}

function drawAliens() {
  // draws aliens after incrementing y value.
  // could randomly change x?
  // if off bottom of screen remove them.
  for (var i = 0; i < aliens.length; i++) {
    aliens[i].y += 1;
    aliens[i].x += Math.random() < 0.1 ? 1 : (Math.random() > 0.9 ? -1 : 0)
    if (aliens[i].y >= canvas.height || aliens[i].explode <= 0) {
      aliens.splice(i, 1);
      score -= 2;
    } else {
      if (aliens[i].explode == 64) {
        drawAlien(aliens[i].x, aliens[i].y, aliens[i].colour);
      } else {
        drawExlpodingAlien(aliens[i].x, aliens[i].y, aliens[i].explode);
        aliens[i].explode -= 1;
      }
    }
  }
}

function generateAlien() {
  aliens.push({
    x: Math.random() * (canvas.width-40),
    y: 0,
    colour: "rgb( "+ Math.floor(Math.random()*255) +", 255,0)",
    explode: 64
  });
}

function checkForCollisions() {
  /*
  loops through bullets and aliens checking for collisions between them and with
  spaceShip.
  if collision set alien / or ship to explode and remove bullet.
  can aliens collide with each other?
  */
  for (var a = 0; a < aliens.length; a++) {
    //check collisions with bullets
    for (var b = 0; b < bullets.length; b++) {
      if (bullets[b].x > aliens[a].x +5 && bullets[b].x + 3 < aliens[a].x + 45) {
        if (bullets[b].y > aliens[a].y && bullets[b].y + 10 < aliens[a].y + 20) {
          bullets.splice(b, 1); // delete bullet
          aliens[a].explode = 49;
          score += 10;
        }
      }
    }
    //check for colission with player spaceShip
    if (aliens[a].y >= canvas.height - shipSize - 30 && shipHit == 0) {
      if (aliens[a].x + 20 > x - shipSize/3 && aliens[a].x < x + shipSize/3) {
        shipHit = 100;
        lives -= 1;
        score -= 10;
        aliens[a].explode = 49;
        if (lives == 0) {
          deathCount = 64;
        }
      }
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
  drawStars();
  checkForCollisions();
  drawBullets();
  drawAliens();
  alienCount.innerHTML = aliens.length;
  bulletCount.innerHTML = bullets.length;
  drawSpaceShip(x, y, shipSize, "#9a9da1");
  var randomNumber = Math.random() * 100;
  if (score < 500 && randomNumber <= 0.6) {
    generateAlien();
  } else if (score > 500 && randomNumber <= 2) {
    generateAlien();
  } else if (score > 1000 && randomNumber <= 3) {
    generateAlien();
  }
  // ship movement logic
  if (rightPressed && x < canvas.width) {
    x += speed;
  } else if (leftPressed && x > 0) {
    x -= speed;
  }
  if (lives > 0) {
    requestAnimationFrame(draw);
  } else if (deathCount > 0){
    deathCount -= 1;
    requestAnimationFrame(draw);
  }else {
    message.innerHTML = "You Died!"
  }

}
generateStars();
draw();
