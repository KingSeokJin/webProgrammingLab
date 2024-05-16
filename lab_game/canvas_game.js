//전역 변수 지정
var context; // 컨텍스트 객체
var velocity; // 사용자가 입력한 공의 초기속도
var angle; //사용자가 입력한 공의 초기각도
var ballV; // 공의 현재 속도
var ballVx; // 공의 현재 x벡터 속도
var ballVy; // 공의 현재 y백터 속도
var ballX = 10; // 공의 현재 x방향 위치
var ballY = 250; // 공의 현재 y방향 위치
var ballRadius = 10; // 공의 반지름
var score = 0; // 점수
var image = new Image(); // 이미지 객체 생성
image.src = "lawn.png"; //이미지 파일이름 생성
var backimage = new Image();
backimage.src = "net.png";
var timer; // 타이머 객체 변수

function init(){
    ballX = 10;
    ballY = 250;
    ballRadius = 10;
    context = document.getElementById("canvas").getContext("2d");
    draw();
}

function start() {
    init();
    velocity = Number(document.getElementById("velocity").value);
    angle = Number(document.getElementById("angle").value);
    var angleR = angle * Math.PI / 180; // angle을 호도법으로 변환

    ballVx = velocity * Math.cos(angleR);
    ballVy = -velocity * Math.sin(angleR);

    draw();
    timer = setInterval(calculate, 100);
    return false;
}

function draw() {
    context.clearRect(0,0, 500, 300);
    drawBall();
    drawBackground();
}

function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, 2.0 * Math.PI, true);
    context.fillStyle = "red";
    context.fill();
}

function drawBackground() {
    context.drawImage(image, 0, 270);
    context.drawImage(backimage, 450, 60);
}

function calculate() {
    ballVy = ballVy + 1.98;

    ballX = ballX + ballVx;
    ballY = ballY + ballVy;

    if((ballX >= 450) && (ballX <= 480) && (ballY >= 60) && (ballY <= 210)){
        score++;
        document.getElementById("score").innerHTML = "점수" + score;
        clearInterval(timer);
    }
    if(ballY >= 300 || ballY < 0) {
        clearInterval(timer);
    }
    draw();
}