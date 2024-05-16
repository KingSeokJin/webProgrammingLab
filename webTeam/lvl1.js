var canvas, canvasContext;
var LEVEL;

//level check
const urlParams = new URLSearchParams(window.location.search);
LEVEL = urlParams.get('value');

//ball variables
var ballX = 500;
var ballSpeedX = 0;
var ballY = 580;
var ballSpeedY = 0;

//paddle variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 450;

//mouse variables;
var mouseX;
var mouseY;

//bricks variables and constants
const BRICK_WIDTH = 59;
const BRICK_HEIGHT = 45;
const BRICK_COLS = 17;
const BRICK_GAP = 2;
const BRICK_ROWS = 11;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

//score variables
var maximumScore = 0;
var playerScore = 0;
var attempts = 50;
var playerAttempts = attempts;
var showEndingScreen = false;

function updateMousePosition(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - (PADDLE_WIDTH/2);

  //cheat to test the ball collision
  //                ballX = mouseX;
  //                ballY = mouseY;
  //                ballSpeedX = 4;
  //                ballSpeedY = -4;
}

function handleMouseClick(evt) {
  if(showEndingScreen) {
    playerScore = 0;
    maximumScore = 0;
    playerAttempts = attempts;
    brickReset();
    ballReset();
    showEndingScreen = false;
  }

  if(ballSpeedX == 0 && ballSpeedY == 0) {
    ballSpeedX = 0;
    ballSpeedY = 10;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', updateMousePosition);

  brickReset();
}

function updateAll() {
  moveAll();
  drawAll();
}

function ballReset() {
  if(playerAttempts <= 0) {
    showEndingScreen = true;
  }

  ballX = canvas.width/2;
  ballY = 400;

  ballSpeedX = 0;
  ballSpeedY = 10;
}

function ballMovement() {
  ballX += ballSpeedX;

  //right
  if(ballX > canvas.width && ballSpeedX > 0.0) {
    ballSpeedX *= -1;
  }

  //left
  if(ballX < 0 && ballSpeedX < 0.0) {
    ballSpeedX *= -1;
  }

  ballY += ballSpeedY;

  // bottom
  if(ballY > canvas.height) {
    playerAttempts--;
    ballReset();
  }

  // top
  if(ballY < 0 && ballSpeedY < 0.0) {
    ballSpeedY *= -1;
  }
}

function isBrickAtColRow(col, row) {
  if((col >= 0-10 && col < BRICK_COLS+10) || (row >= 0-10 && row < BRICK_ROWS+10)) {
    var brickIndexUnderCoord = rowColToArrayIndex(col, row);
    return brickGrid[brickIndexUnderCoord];
  } else {
    return false;
  }
}

function ballBrickCollision() {
  var ballBrickCol = Math.floor(ballX / BRICK_WIDTH);
  var ballBrickRow = Math.floor(ballY / BRICK_HEIGHT);

  // Check if the ball is within the bounds of the brick grid
  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS && ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
    // Iterate over each brick
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
      for (var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
        var brickIndex = rowColToArrayIndex(eachCol, eachRow);

        // Check if the current brick exists
        if (brickGrid[brickIndex]) {
          // Calculate brick coordinates
          var brickX = eachCol * BRICK_WIDTH;
          var brickY = eachRow * BRICK_HEIGHT;

          // Check if any part of the ball overlaps with the brick
          var ballLeft = ballX - 10;
          var ballRight = ballX + 10;
          var ballTop = ballY - 10;
          var ballBottom = ballY + 10;

          var brickLeft = brickX;
          var brickRight = brickX + BRICK_WIDTH;
          var brickTop = brickY;
          var brickBottom = brickY + BRICK_HEIGHT;

          // Check for intersection
          if (ballRight > brickLeft && ballLeft < brickRight &&
              ballBottom > brickTop && ballTop < brickBottom) {
            // Collision detected
            brickGrid[brickIndex] = false;
            bricksLeft--;
            //console.log(bricksLeft);
            playerScore += 10;
            //console.log(playerScore);

            // Adjust ball direction
            if (ballX > brickLeft && ballX < brickRight) {
              ballSpeedY *= -1; // Vertical collision
            } else {
              ballSpeedX *= -1; // Horizontal collision
            }
            return; // Exit the function since we've handled the collision
          }
        }
      }
    }
  }
}

function ballPaddleCollision() {
  var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_HEIGHT;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

  if(ballY+10 > paddleTopEdgeY && //below the top of the paddle
     ballY < paddleBottomEdgeY && //above the bottom of the paddle
     ballX+10 > paddleLeftEdgeX && //right of the left side of the paddle
     ballX-10 < paddleRightEdgeX) { //left of the right side of the paddle

    ballSpeedY *= -1;

    var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
    var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    ballSpeedX = ballDistFromPaddleCenterX * 0.35;

    if(bricksLeft == 0) {
      //                        brickReset();
      showEndingScreen = true;
    }
  }
}

function moveAll() {
  if(showEndingScreen) {
    return;
  }

  ballMovement();

  ballBrickCollision();

  ballPaddleCollision();
}

function brickReset() {
  bricksLeft = 0;

  var i;

  for(i = 0; i < 3 * BRICK_COLS; i++) {
    brickGrid[i] = false;
  }

  for(; i < BRICK_COLS * BRICK_ROWS; i++) {
    if(Math.random() < 0.1) {
      brickGrid[i] = true;
      bricksLeft++;//counts how many bricks there are on the scene and stores the value
      maximumScore += 10;
    }else {
      brickGrid[i] = false;
    }//end of else (random check)
  }//end of for
  //console.log(maximumScore);
}//end of brickReset

function rowColToArrayIndex(col, row) {
  return col + row * BRICK_COLS;
}

var brickImages = [];

function initializeBrickImages() {
    for (var i = 0; i < BRICK_ROWS * BRICK_COLS; i++) {
        // Randomly select between two brick images
        var randomImageIndex;

        if (LEVEL == 1) {
          randomImageIndex = Math.floor(Math.random() * 4) + 1;
        } else if (LEVEL == 2) {
          randomImageIndex = Math.floor(Math.random() * 6) + 1;
        } else {
          randomImageIndex = Math.floor(Math.random() * 9) + 1;
          
        }
        
        if (randomImageIndex < 3) {
          brickImages.push("img/brick_images" + randomImageIndex + ".png"); 
        }
        else {
          brickImages.push("img/brick_images" + randomImageIndex + ".jpg");
        }
    }
}

function drawBricks() {
  for(var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for(var eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

      if(brickGrid[arrayIndex]) {
        var brickX = eachCol * BRICK_WIDTH;
        var brickY = eachRow * BRICK_HEIGHT;
        var brickImage = new Image();
                brickImage.src = brickImages[arrayIndex];

                canvasContext.drawImage(brickImage, brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            }//end of brick drawing if true
    }
  }//end of brick for
  initializeBrickImages();
}//end of drawBricks

function drawAll() {
  //background
  if(LEVEL == 1){
    document.body.style.backgroundImage = "url('img/minecraftbg1.jpeg')";
  } else if (LEVEL == 2) {
    document.body.style.backgroundImage = "url('img/minecraftbg2.jpg')";
  } else {
    document.body.style.backgroundImage = "url('img/minecraftbg3.jpg')";
  }

  document.getElementById("master_title").innerHTML = "LEVEL" + LEVEL;
  rect(0, 0, canvas.width, canvas.height, 'rgba(54, 54, 54)');

  if(showEndingScreen) {
    if(playerScore == maximumScore && LEVEL >= 3) {
      text("YOU WIN!", canvas.width/2, 100, 'white', 'bold 3em Arial', 'center');
      text("SCORE: " + playerScore, canvas.width/2, 250, 'white', 'bold 2em Arial', 'center');
      text("ATTEMPTS: " + playerAttempts, canvas.width/2, 400, 'white', 'bold 2em Arial', 'center');
      text("Click to continue", canvas.width/2, 550, 'white', 'bold 1.5em Arial', 'center');
      return;
    } else if(playerScore == maximumScore && LEVEL < 3) {
      brickImages = [];
      LEVEL++;
      showEndingScreen = false;
      drawBricks();
      brickReset();
    } else {
      text("YOU LOSE!", canvas.width/2, 100, 'white', 'bold 3em Arial', 'center');
      text("SCORE: " + playerScore, canvas.width/2, 250, 'white', 'bold 2em Arial', 'center');
      text("ATTEMPTS: " + playerAttempts, canvas.width/2, 400, 'white', 'bold 2em Arial', 'center');
      text("Click to continue", canvas.width/2, 550, 'white', 'bold 1.5em Arial', 'center');
      return;
    }
    
  }

  //ball
  circle(ballX, ballY, 10, 'white');

  //paddle
  rect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  //bricks
  drawBricks();

  /*
  var mouseBrickCol = Math.floor(mouseX / BRICK_WIDTH);
  var mouseBrickRow = Math.floor(mouseY / BRICK_HEIGHT);
  var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
  text(mouseBrickCol + "," + mouseBrickRow + ":" + brickIndexUnderMouse, mouseX, mouseY, 'yellow', '12px Arial');
*/
  text("점수: " + playerScore, 10, 30, 'white', 'bold 1.4em monospace', 'left');
  text("공 개수: " + playerAttempts, 890, 30, 'white', 'bold 1.4em monospace', 'left');
}

function rect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function circle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function text(showWords, textX, textY, fillColor, fontSizeStyle, textAlignment) {
  canvasContext.fillStyle = fillColor;
  canvasContext.font = fontSizeStyle;
  canvasContext.textAlign = textAlignment;
  canvasContext.fillText(showWords, textX, textY);
}

