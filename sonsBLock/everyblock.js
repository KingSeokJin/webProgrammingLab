// 설정 관련 전역 변수
// 음악
var audioArr = ["sound/bgm1.mp3", "sound/bgm2.mp3", "sound/bgm3.mp3"];
var audioIndex;
var str = "white";

// 공색상
var ballcolor = "#ff0000";
var paddlecolor = "#00ff00";

//howtoplay 관련 전역 변수
var htpArray = ["img/htp1.png", "img/htp2.png", "img/htp3.png", "img/htp4.png", "img/htp5.png"
, "img/htp6.png", "img/htp7.png", "img/htp8.png", "img/htp9.png", "img/htp10.png", "img/htp11.png"];
var albumIndex = 0;

// 성적표 관련 전역 변수
var users = [];

// 사용자 정보 객체
function User(name, score, grade) {
    this.name = name;
    this.score = score;
    this.grade = grade;
}

// 블록 정보 객체
function Subject(name, x, y, size, color, room) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.room = room;
}

$(function() {
    var user; // 현재 사용자

    // 시작화면에서 버튼 hover
    $(".main-btn").hover(function(){
        var s = $(this).attr('src');
        s = s.slice(0, s.length-4);
        $(this).attr('src', s.concat("_hover.png"));
    }, function(){
        var s = $(this).attr('src');
        s = s.slice(0, s.length-10);
        $(this).attr('src', s.concat(".png"));
    })

    /*=============================게임시작 btn ==========================*/
    $("#gamebtn").click(function() {
        $("#main-menu").hide();
        $("#difficulty").show();
        $("#playBtn").show();

        if(user != null) {
            $("#guide").text(user.name + "님의 이전 성적을 불러왔습니다.");
            $("#firInfo").text("최고 점수 : " + user.score[0]+ "점");
            $("#secInfo").text("최고 점수 : " +user.score[1]+ "점");
            $("#thiInfo").text("최고 점수 : " +user.score[2]+ "점");
            $("#forInfo").text("최고 점수 : " +user.score[3]+ "점");
        }
    })

    /*=============================난이도 선택 ==========================*/

    var $searchToggle = $('.search-toggle');

    $searchToggle.on('click', function (e) {
        var $target = $(this);
        var $container = $target.closest('.search-wrapper');
        $("#open").css('src', 'img/searchbtn.png');

        if($container.hasClass('active')) {     
            if($target.closest('.input-holder').length == 0) {
                $container.removeClass('active');
                $container.find('.search-input').val('');  
            }
            else {
                var name = $("#username").val();

                user = findName(name);

                if(user == null) { // 새로운 user객체 만들기
                    user = new User(name,[0, 0, 0, 0, 0],'F',0);

                    if(name == '') {
                        user.name = '익명'+users.length; // 이름 미입력시 '익명'으로 저장
                    }
                    $("#guide").text(user.name + "님 환영합니다. 난이도를 선택해주세요.");

                    // left-bar에 정보 추가
                    $("#profileSource").attr("src","profile.png");
                    $("#profileName").text("이름 : " + user.name);
                    $(".difInfo").text("최고 점수 : 0점");
                }
                else { // 이미 있는 계정
                    $("#guide").text(user.name + "님의 이전 성적을 불러왔습니다.");
                    $("#firInfo").text("최고 점수 : " + user.score[0]+ "점");
                    $("#secInfo").text("최고 점수 : " +user.score[1]+ "점");
                    $("#thiInfo").text("최고 점수 : " +user.score[2]+ "점");
                    $("#forInfo").text("최고 점수 : " +user.score[3]+ "점");
                    $("#profileSource").attr("src","profile.png");
                    $("#profileName").text("이름 : " + user.name);
                }

                // 있는 계정인지 확인, 존재하면 객체 반환
                function findName(name) {
                    var temp;
                    for(var i=0; i<users.length; i++) {
                        if(users[i].name == name){
                            temp = users[i];
                        }    
                    } 
                    return temp;   
                }

                $(".dif").click(function() {
                    // 난이도 선택           
                    semester = $(this).text();
                    stage = calSemester(semester);
                    $("#profileSem").text("학년 : " + semester);
                    $("#profileScore").text("점수 : " + user.score[stage]);  
        
                    // 게임 화면으로
                    $("#difficulty").hide();
                    $(".sidebar").show();
                    $("#game-menu").show();  
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    $(".it-board").empty();
                    $("#stressEmpty, #feverEmpty").css("height", "0");
                })

                $(".dif").hover(            // 난이도 선택  
                    function() {         
                    $(this).css("cursor", "pointer");
                },
                    function(){
                    $(this).css("cursor", "default");
                })
            }
        } 
        else {
            $container.addClass('active');
            e.preventDefault();
        }       
    });

    $("#dif_home").click(function() {
        $(".content").hide();
        $("#main-menu").show();
    })

    /*=============================게임 ==========================*/
    $("#playBtn").click(play);

    // 게임 관련 함수
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    // 게임 진행 관련 변수
    //블럭 깬 횟수
    var goneblock =0 ;
    // 공
    var ballRadius = 20;
    var x, y; // 공 좌표
    var dx, dy; // 공 속도

    // 패들(paddle)
    var paddleHeight = 20;
    var paddleWidth = 125;
    var paddleWidthD = 125; // 패들 길이 조절
    var paddleX ;
    var paddleY = canvas.height-paddleHeight;

    // 충돌 허용범위
    var limit = ballRadius + ballRadius/Math.sqrt(2); 
    
    // 키보드 입력
    var rightPressed = false;
    var leftPressed = false;

    // 벽돌
    var timeCount; // 수업 수
    var brickCount; // 블럭 수
    var brickWidth = 100; //기존 블럭 가로 길이

    var bricks = [];

    // draw 타이머
    var drawtimer;

    // fever time
    var onfevertime = false;

    // 학년별 시간표
    var timetable = [];
    timetable[0] = [1, 2, 3, 4, 5, 6, 7, 88, 99, 111];// 1학년
    timetable[1] = [11, 12, 13, 14, 15, 16, 17, 18, 19, 88, 99, 112]; // 2학년
    timetable[2] = [21, 22, 23, 24, 25, 27, 28, 121, 122, 123, 124, 125, 126, 127]; // 3학년
    timetable[3] = [31, 32, 33, 34, 35, 36, 37, 38, 39, 131, 132, 133, 134]; // 4학년

    // 점수
    var score = 0;
    var scorepoint = 100;

    // 학기
    var stage; // 숫자
    var semester; // 문자열

    // 아이템
    var item = ['꽝','패들 길이 2배', '폭발', '공 이동 방향 바꾸기', '패들 길이 절반'];
    var onPaddle = 0; // -1: 절반, 0: 원래크기, 1: 2배

    // 아이템 효과
    function itemEffect(power) {
        switch(power)
        {
            case 1: // 패들길이2배
                if(onPaddle != 2) {
                    onPaddle++;
                }
                $("#timeFull").css("width", "175px");   
                break;
            case 2: // 폭발
                for(var i=0; i<timeCount; i++){
                    if(bricks[i].status > 0) {
                        bricks[i].status--;
                        goneblock++;
                        if(onfevertime)
                            score += 2 * scorepoint;
                        else
                            score += scorepoint;
                    }   
                }
                break;
            case 3: // 공 이동 방향 바꾸기
                dx = -dx;
                break;
            case 4: // 패들길이2배
                if(onPaddle != -1) {
                    onPaddle--; 
                }
                $("#timeFull").css("width", "175px");
                break; 
        }
    }

    // 게임 진행 함수
    function play() {
        $("#playBtn").hide();

        //================초기화================
        timeCount = timetable[stage].length; // 수업 수
        brickCount = 0;
        // brickCount 계산. 블록 생성, 멤버 초기화 
        // bricks =  { x, y : 블록 위치, status: 블록 체력, power: 아이템, sub: 과목 }
        for(var i=0; i<timeCount; i++) {
            bricks[i] = {x:0, y:0, status: 0, power :0, sub: 0}; 
            bricks[i].sub = timetable[stage][i];
            var subject = checkSubject(bricks[i].sub);
            brickCount += subject.size;
            bricks[i].status = subject.size;  
            bricks[i].x = subject.x;
            bricks[i].y = subject.y;
        }

        // 아이템 능력 랜덤 블럭에 할당
        switch(stage){
            case 0:
                var itemCount = 2;
                break;
            case 1:
                var itemCount = 3;
                break;
            case 2:
                var itemCount = 4;
                break;
            case 3:
                var itemCount = 5;
                break;
        }


        // 한 학년당 아이템 수
        for(var i=0; i<itemCount; i++) {         
            while(true) { // 중복 방지
                var itemindex = parseInt(Math.random() * timeCount);
                
                if(bricks[itemindex].power == 0) {
                    bricks[itemindex].power = -1; // 능력은 나중에 부여
                    break;
                }         
            }     
        }

        // 공 위치, 패들 위치 초기화
        switch(stage){
            case 0:
                paddleWidth = 125; // 패들 길이
                paddleWidthD = 125; // 패들 길이 아이템용
                defaultspeed = 6; // 초기 속도
                break;
            case 1:
                paddleWidth = 120;
                paddleWidthD = 120;
                defaultspeed =8;
                break;
            case 2:
                paddleWidth = 110;
                paddleWidthD = 110;
                defaultspeed =10;
            case 3:
                paddleWidth = 70;
                paddleWidthD = 70;
                defaultspeed = 12;
                
        }
        onPaddle = 0;
        x = canvas.width/2 - ballRadius;
        y = canvas.height-50;
        paddleX = (canvas.width-paddleWidth)/2;
        dx = defaultspeed;
        dy = - defaultspeed;

        // stress, fever 바 초기화
        $("#stressEmpty, #feverEmpty").css("height", "692px");

        // 점수 초기화
        score = 0;
        goneblock =0;

        // profile 초기화
        $("#profileSem").text("학년 : " + semester);
        $("#profileScore").text("점수 : " + user.score[stage]); 

        // 일시정지 활성화
        $("#stopBtn").hover(function(){
            $(this).attr('src', 'img/pausebtn_hover.png');
        }, function(){
            $(this).attr('src', 'img/pausebtn.png');
        })

        draw();   
    }

    // 충돌 감지
    function collisionDetection() {
        if(onfevertime){ //피버타임 때 인터페이스 색변화.
            $("#game-menu").css("background-color", "#FFFFE0");
            $("#game-menu").css("background-image", "url('img/fever-screen.png')");
            $(".profile p, #feverName, .post, .darkpost").css("color", "orange");
        }
        else {
            $("#game-menu").css("background-color", "transparent");
            $("#game-menu").css("background-image", "url('img/timetable.png')");
            if($("body").attr("class") == "dark")
                $(".profile p, .darkpost").css("color", 'white'); 
            else
                $(".profile p, .post").css("color", 'black');
            $("#feverName").css("color", "white");
        }

        for(var i=0; i < timeCount; i++) {
            var brick = bricks[i];
            if(brick.status > 0) {
                var subject = checkSubject(brick.sub);
                var h = calHeight(subject);

                // 블록 충돌 시
                //공이 블록 왼쪽 벽 칠 때
                if(dx > 0 && (x + ballRadius + dx > brick.x && x - ballRadius -dx < brick.x + brickWidth) 
                    && y + ballRadius > brick.y && y - ballRadius < brick.y + h) {
                    aftercoll(1);
                }
                //공이 블록 오른쪽 벽 칠 때
                else if(dx < 0 && (x + ballRadius - dx > brick.x && x - ballRadius +dx < brick.x + brickWidth) 
                    && y + ballRadius > brick.y && y - ballRadius < brick.y + h) {
                    aftercoll(1);
                }
                //공이 블록 위쪽 칠 때
                else if(x + ballRadius > brick.x && x - ballRadius < brick.x + brickWidth 
                    && (y + ballRadius + dy  > brick.y && y - ballRadius - dy < brick.y + h) && dy > 0) {
                    aftercoll(2);
                }
                //공이 블록 아래쪽 칠 때
                else if(x + ballRadius > brick.x && x - ballRadius < brick.x + brickWidth 
                    && (y + ballRadius - dy  > brick.y && y - ballRadius + dy < brick.y + h) && dy < 0) {
                    aftercoll(2);
                }
                
                function aftercoll(x) {
                    if(x == 1)
                        dx = -dx;
                    else if(x == 2)
                        dy = -dy;

                    brick.status--;
                    goneblock++;
                    $("#effectSound").attr("src","sound/break.mp3");                     

                    // it-board 표시
                    var newpost = '<div class="post"><p>' + subject.name + '</p></div>';
                    $(".it-board").prepend(newpost);

                    // 아이템 효과
                    if(brick.power == -1) {
                        // 랜덤 아이템 뽑기
                        $("#effectSound").attr("src","sound/item.mp3");
                        brick.power = parseInt(Math.random() * item.length);

                        // it-board 표시
                        newpost = '<div class="post-item"><p id="item">아이템 : ' + item[brick.power] + '</p></div>';
                        $(".it-board").prepend(newpost);

                        itemEffect(brick.power);
                        brick.power = 0;
                    }

                    //dark모드일 경우
                    darkMode();
                    
                    //fever-time이면 점수 두배 증가, 아니면 충전
                    if(onfevertime)
                        score+= 2 * scorepoint;
                    else {
                        if($("#feverEmpty").height() <= 100) {
                            $("#feverEmpty").css("height", "0");
                            onfevertime = true;
                        }
                        else {
                            $("#feverEmpty").css({height: '-=100px'}); // fever bar 충전 속도 조절
                        }
                        score+=scorepoint;
                    }

                    //stress 해소
                    if(brick.sub >= 80) { // 스트레스 해소 블록 충돌 시
                        if($("#stressEmpty").height() >= 662) {
                            $("#stressEmpty").css("height", "692px");
                        }
                        else {
                            $("#stressEmpty").css({height: '+=30px'}); // 스트레스 해소량 조절
                        }  
                    }                           
                }                              
            }     
        }
    }

    // 공 그리기
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = ballcolor;
        ctx.fill();
        ctx.closePath();
    }

    // 패들 그리기
    function drawPaddle() {
        switch(onPaddle){
            case -1:
                paddleWidth = paddleWidthD / 2;
                break;
            case 0:
                paddleWidth = paddleWidthD;
                break;
            case 1:
                paddleWidth = paddleWidthD * 2;
                break;
        }

        ctx.beginPath();
        ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctx.fillStyle = paddlecolor;
        ctx.fill();
        ctx.closePath();
    }

    // 아이템 그리기
    function drawItem() {
        switch(onPaddle){
            case -1:
                if($("#timeFull").width() >= 0.5)
                    $("#timeFull").css({width: '-=0.5px'});
                else
                    onPaddle++;
                break;
            case 0:
                $("#timeFull").css("width", "0");
                break;
            case 1:
                if($("#timeFull").width() >= 0.5)
                    $("#timeFull").css({width: '-=0.5px'});
                else
                    onPaddle--;
                break;
        }     
    }

    // 블록 그리기
    function drawBricks() {
        for(var i=0; i<timeCount; i++) {
            var brick = bricks[i];
            if(brick.status > 0) {
                var subject = checkSubject(brick.sub);
                 
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, calHeight(subject));
                if(subject.size > 1) {
                    ctx.fillStyle = subject.color[subject.size-brick.status];
                }
                else {
                    ctx.fillStyle = subject.color;
                }     					   
                ctx.fill(); 
                ctx.font = '9pt DungGeunMo';
                if(brick.power == -1)
                    ctx.fillStyle = 'red';
                else
                    ctx.fillStyle = 'white';
                ctx.fillText(subject.name, brick.x + 3, brick.y + 15);
                ctx.font = '7pt DungGeunMo';
                ctx.fillText(subject.room, brick.x + 3, brick.y + 30);
                ctx.closePath();     
            }            
        }
    }

    // 점수 그리기
    function drawScore() {
        $("#profileScore").text("점수 : " + score);
    }

    // 그리기 함수
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();
        drawItem();

        // stress bar
        if($("#stressEmpty").height() == 0){ // gameover
            cancelAnimationFrame(drawtimer);
            printResult(0);
            return;
        }
        $("#stressEmpty").css({
            height: '-=0.4px'
        });

        // fever time bar
        if(onfevertime) { // 감소
            if($("#feverEmpty").height() >= 694) { // fever time 끝
                onfevertime = false;
            }
            else {
                $("#feverEmpty").css({height: '+=1px'}); // fevertime 속도 조절    
            }   
        } 

        // 좌우벽 충돌 시 방향 전환
        if(x + dx >= canvas.width-ballRadius || x + dx <= ballRadius) {
            dx = -dx;
        }

        if(y + dy <= ballRadius) { // 위쪽벽 충돌 시 방향 전환 
            dy = -dy;
        }
        else if(y + ballRadius  >= paddleY) {
            // paddleY 위쪽에서 충돌
            if(x >= paddleX && x  <= paddleX+paddleWidth ){
                dy = -dy;
    
                if(dx > 0) {
                    dx = 3 * (Math.abs(x-(paddleX+paddleWidth/2)))/(paddleWidth/2);  
                }
                else { // dx <= 0
                    dx = -3 * (Math.abs(x-(paddleX+paddleWidth/2)))/(paddleWidth/2);
                } 

            }
            else if( x >= paddleX -limit&& x  <= paddleX+paddleWidth+limit){ // paddleY 아래쪽에서 충돌 or GAMEOVER
                // 충돌 허용범위    
                dy = -dy;
                if(x > paddleX+paddleWidth/2){
                    dx = 4 * (Math.abs(x-(paddleX+paddleWidth/2)))/(paddleWidth/2+limit);  
                }
                else{
                    dx = -4 * (Math.abs(x-(paddleX+paddleWidth/2)))/(paddleWidth/2+limit);  
                }
            }
            
            if (y + ballRadius >= canvas.height){  // gameover
                printResult(1);
                return;
            }      
        }  

        // 패들 이동
        if(rightPressed && paddleX <= canvas.width-paddleWidth) {
            paddleX += 10;
        }
        else if(leftPressed && paddleX >= 0) {
            paddleX -= 10;
        }

        x += dx;
        y += dy;
        drawtimer = requestAnimationFrame(draw);

        // 일시정지 기능
        $("#stopBtn").click(function() {
            cancelAnimationFrame(drawtimer);
            $(this).hide();
            $("#continueBtn").show();
        });

        // 게임 Clear
        if(goneblock == brickCount){
            goneblock = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(drawtimer);
            $("#profileScore").text("점수 : " + score);  
            printResult(2);
            return;
        }
    }

    // 뒤로 가기
    $("#goMainBtn").click(function() {
        $(".content").hide();
        $(".sidebar").hide();
        $("#main-menu").show();
        cancelAnimationFrame(drawtimer);
    });

    // 일시정지 해제
    $("#continueBtn").click(function() {
        draw();
        $(this).hide();
        $("#stopBtn").show();
    });
    
    // left-bar button:hover
    $("#goMainBtn").hover(function() {
        $(this).attr('src', 'img/mainbtn_hover.png');
    }, function(){
        $(this).attr('src', 'img/mainbtn.png');
    })

    $("#continueBtn").hover(function(){
        $(this).attr('src', 'img/continuebtn_hover.png');
    }, function(){
        $(this).attr('src', 'img/continuebtn.png');
    })

    /*=============================결과창 ==========================*/
    function printResult(type){
        $("#opt_audio").attr("loop", false);
        $("#opt_audio").attr("src", "sound/gameover.mp3");
        $("#result").empty();
        var result = '';
        switch(type) {
            case 0: // 스트레스
                result += "<p class='title'>STRESS OVER!</p>";
                break;
            case 1: // 공이 바닥에 닿음
                result += "<p class='title'>GAME OVER!</p>"
                break;
            case 2: // Clear

                result += "<p class='title'>STAGE CLEAR!</p>"
                break;     
        }

        // 사용자 저장
        var newRecord = false;
        if(user.score[stage] < score){  //최고점수만 반영
            user.score[stage] = score;
            newRecord = true;
        }
            
        var inarray = 0;
        for (var i = 0; i <users.length; i++) {
            if (users[i].name==user.name){
                inarray = 1;
                break;
            }
        }
        if(inarray==0){ //객체 추가
            users.push(user);
        }

        // 다음 단계 or 다시하기 / 메인메뉴 버튼
        result += "<p class='result-item'>이름 : " + user.name;
        result += "</p><p class='result-item'>학년 : " + semester;
        result += "</p><p class='result-item'>점수 : " + score + "</p>";

        if(newRecord)
            result += "</p><p class='result-item' id='newRecord'>신기록 달성!!</p>";

        if(type == 2 && stage <=2)
            result += '<img id="nextbtn" src="img/nextbtn.png">';   
        else       
            result += '<img id="nextbtn" src="img/retry1.png">';

        result += '<img id="homebtn" src="img/homebtn.png"></img>';
        $("#result").prepend(result);
        $("#result").addClass("popup");
        $("#result").show();

        $("#nextbtn").click(function(){
            if(audioIndex != null) {
                $("#opt_audio").attr("src", audioArr[audioIndex]);
                $("#opt_audio").attr("loop", true);
            }
            else {
                $("#opt_audio").attr("src", '');
            } 
            if(type==2){
                stage++;
            }
            change_Sem();
            $("#result").hide();
            play();
        });

        $("#homebtn").click(function() {
            if(audioIndex != null) {
                $("#opt_audio").attr("src", audioArr[audioIndex]);
                $("#opt_audio").attr("loop", true);
            }   
            else {
                $("#opt_audio").attr("src", '');
            } 
            $(".content, .sidebar, #result").hide();
            $("#main-menu").show();
        });
    }

    function change_Sem(){
        switch(stage){
            case 0:
                semester = '1학년';
                break;
            case 1:
                semester = '2학년';
                break;
            case 2:
                semester = '3학년';
                break;
            case 3:
                semester = '4학년';
                break;
        }
    }

    /*=============================게임 방법 btn ==========================*/
    $("#htpbtn").click(function() {
       $("#main-menu").hide();
       $("#howtoplay-menu").show();
    })

    $("#htpbtn").click(function() {
        $("#main-menu").hide();
        $("#howtoplay-menu").show();
     })
 
     $("#htpAlbum").click(function(){
         albumIndex = (albumIndex+1) % htpArray.length;
         $("#htpAlbum").attr("src",htpArray[albumIndex]);
     })

    /*============================= 성적표 btn ==========================*/
    $("#scorebtn").click(function() {
        $("#main-menu").hide();
        $("#score-menu").show();

        var userIndex = [];
        for(var i=0; i<users.length; i++) {
            userIndex.push(i);
        }

        // 총점 계산
        for(var i=0; i<users.length; i++) {
            users[i].score[4] = 0;
            for(var j=0; j<4; j++) {
                users[i].score[4] += users[i].score[j];
            }    
            // 학점 부여
            users[i].grade = calGrade(users[i].score[4]);
        }

        // 유저 점수별로 sorting
        for(var i=0; i<users.length-1; i++) {
            var maxIndex = i;
            for(var j= i + 1; j<users.length; j++) {
                if(users[userIndex[maxIndex]].score[4] < users[userIndex[j]].score[4]) {
                    maxIndex = j;
                }                
            }
            if(maxIndex != i){
                var temp = userIndex[i];
                userIndex[i] = userIndex[maxIndex];
                userIndex[maxIndex] = temp;
            }
        }

        // 초기화
        $("#score-body tr").remove(); 

        // 유저 수만큼 표 그리기 (7등까지만 출력)
        var count = users.length;
        if(users.length > 7)
            count = 7;

        for(var i=0; i<count; i++) {
            var table = document.getElementById('score-body');
            var j = userIndex[i];
            var row = '<tr><td>'+(i+1)+'등</td><td>'+users[j].name+'</td><td>'
                    +users[j].score[0]+'</td><td>'+users[j].score[1]+'</td><td>'
                    +users[j].score[2]+'</td><td>'+users[j].score[3]+'</td><td>'
                    +users[j].score[4]+'</td><td>'+'<img src ="'+ selectGrade(users[j].grade)+'"></td></tr>';  
            table.innerHTML += row;	
        }
    })

    // 뒤로가기
    $(".gomain").click(function() {
        $(".content").hide();
        $("#main-menu").show();
    });

    /*=============================설정 btn ==========================*/
    $("#setbtn").click(function() {
        $("#main-menu").hide();
        $("#set-menu").show();
        opt1Change();
        opt2Change();
        opt3Change();
    });

    function opt1Change(){ // 테마 변경
        $(".theme_img")
        .click(function(){
            if($(this).attr("id") == "theme1"){
                $("body").removeClass();
                $("dark-bar").attr("id","right-bar");
                str = "white";
                $("#gamebtn").attr("src", "img/gamebtn.png");
                $("#htpbtn").attr("src", "img/htpbtn.png");
                $("#scorebtn").attr("src", "img/scorebtn.png");
                $("#setbtn").attr("src", "img/setbtn.png");
            }
            else{
                $("body").addClass("dark");
                $("#right-bar").attr("id", "dark-bar");
                str = "dark";
                $("#gamebtn").attr("src", "img/dark/gamebtn.png");
                $("#htpbtn").attr("src", "img/dark/htpbtn.png");
                $("#scorebtn").attr("src", "img/dark/scorebtn.png");
                $("#setbtn").attr("src", "img/dark/setbtn.png");
            }
        })
        .mouseover(function(){
            if($(this).attr("id") == "theme1"){  //day버튼 hover됐을 때
                if(str=="dark"){
                    $(this).attr("src","img/daybtn_hover.png");
                    $("#theme2").attr("src","img/darkbtn.png");
                }
                else{
                    $("#theme1").attr("src","img/daybtn_hover.png");
                    $("#theme2").attr("src","img/darkbtn.png");
                }
                $("body").removeClass();
            }
            else{  //dark버튼 hover됐을 때
                if(str=="dark")
                    $(this).attr("src","img/darkbtn.png");
                else{
                    $(this).attr("src","img/darkbtn.png");
                    $("#theme1").attr("src","img/daybtn_hover.png");
                }
                $("body").addClass("dark");
            }
        })
        .mouseleave(function(){
            if($(this).attr("id") == "theme1"){  //day버튼에서 나올 때
                if(str=="dark"){
                    $(this).attr("src","img/daybtn_hover.png");
                    $("#theme2").attr("src","img/darkbtn_hover.png");
                    $("body").addClass("dark");
                }
                else
                    $(this).attr("src","img/daybtn.png");
            }else{  //dark버튼에서 나올 때
                if(str=="dark")
                    $(this).attr("src","img/darkbtn_hover.png");
                else{
                    $(this).attr("src","img/darkbtn.png");
                    $("#theme1").attr("src","img/daybtn.png");
                    $("body").removeClass();
                }
            }
        })
    }

    function opt2Change(){ // 배경음악 변경
        $(".sound_img").click(function(){
            if($(this).attr("id") == "sound1"){
                audioIndex = 0;
            }else if($(this).attr("id") == "sound2"){
                audioIndex = 1;
            }else{
                audioIndex = 2;
            }
            $("#opt_audio").attr("src", audioArr[audioIndex]);
        })
        
        $("#mute").click(function(){
            $("#opt_audio").attr("src", " ");
        });
        
        var player = document.querySelector("#opt_audio");
        player.volume = 0.5;

        $("#slider").change(function(){  
            var volume = $(this).val()/100;  
            player.volume = volume;     
        });  
    }
    
    function opt3Change() {
        // 사용자가 고른색 확인하는 canvas && 색상 초기화
        var canvas1 = document.getElementById("setCanvas");
        var ctx1 = canvas1.getContext("2d");
        $("#myballcolor").val(ballcolor);
        $("#mypaddlecolor").val(paddlecolor);

        drawChange();

        $("#myballcolor").change(function() {
            ballcolor = $(this).val();
            drawChange();
        });

        $("#mypaddlecolor").change(function() {
            paddlecolor = $(this).val();
            drawChange();
        });
        
        function drawChange() {
            ctx1.clearRect(0, 0, ctx1.width, ctx1.height);
          
            // 공 그리기
            ctx1.beginPath();
            ctx1.arc(235, 20, 20, 0, Math.PI*2);
            ctx1.fillStyle = ballcolor;
            ctx1.fill();                                 
            ctx1.closePath();
    
            // paddle 그리기
            ctx1.beginPath();
            ctx1.rect(240-paddleWidth/2, canvas1.height-paddleHeight, paddleWidth, paddleHeight);
            ctx1.fillStyle = paddlecolor;
            ctx1.fill();
            ctx1.closePath()
        }
    }

    //이미지 로고 버튼 클릭시 홈페이지 이동
    $("#schoolhome").click(function(){
        window.open("http://www.konkuk.ac.kr/do/Index.do");

    })
    $("#infosystem").click(function(){
        window.open("https://portal.konkuk.ac.kr/");

    })
    $("#gongji").click(function(){
        window.open("http://www.konkuk.ac.kr/jsp/Plaza/plaza_01_01.jsp");

    })
    $("#calender").click(function(){
        window.open("http://www.konkuk.ac.kr/jsp/Haksa/haksa_01.jsp");

    })
    $("#library").click(function(){
        window.open("https://library.konkuk.ac.kr/#/");

    })
    $("#webmail").click(function(){
        window.open("https://kumail.konkuk.ac.kr/adfs/ls/?lc=1042&wa=wsignin1.0&wtrealm=urn%3afederation%3aMicrosoftOnline");
    })

     // 패들 방향이동
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }		

    function keyUpHandler(e) {
        if(e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        }
        else if(e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft- 280 - paddleWidth/2;
        if(relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
            paddleX = relativeX - paddleWidth/2;
        }
    }
});


// score 계산 함수
function calGrade(score) {
    if(score > 12000)
        return 'A+';
    else if(score > 10000)
        return 'A'; 
    else if(score > 8000)
        return 'B+'; 
    else if(score > 6000)
        return 'B'; 
    else if(score > 4000)
        return 'C+'; 
    else if(score > 2000)
        return 'C';
    else
        return 'F'; 
}

// 학기 계산 함수
function calSemester(str) {
    switch(str){
        case '1학년': return 0;
        case '2학년': return 1;
        case '3학년': return 2;
        case '4학년': return 3;
    }
}

// 블럭 찾는 함수
// new Subject(과목명, x, y, 학점, 색깔, 강의실);
function checkSubject(num) {
    switch(num) {
         //1학년
        case 1: // 미분적분학1
            return new Subject('미적분학', 173, 40, 1, "#7aa1dc", "공A602"); //격일 200차이
        case 2: // 미분적분학2
            return new Subject('미적분학', 373, 40, 1, "#7aa1dc", "공A602");
        case 3: // C프로그래밍1
            return new Subject('C프로그래밍', 73, 258, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새401");
        case 4: // C프로그래밍2
            return new Subject('C프로그래밍', 273, 258, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새401");
        case 5: // JAVA프로그래밍 1 
            return new Subject('JAVA프로그래밍', 173, 203, 2, ["#f5afa2", 'rgba(245, 175, 162, 0.8)'], "새401");
        case 6: // JAVA프로그래밍 2
            return new Subject('JAVA프로그래밍', 373, 203, 2, ["#f5afa2", 'rgba(245, 175, 162, 0.8)'], "새401");
        case 7: // 컴퓨팅적사고 
            return new Subject('창사표', 273, 420, 3, ["#e19b99",'rgba(225, 155, 153, 0.8)','rgba(225, 155, 153, 0.8)'], "공B556");

        case 88: // 동아리
            return new Subject('동아리', 573, 95, 2, ["#5f352e", 'rgba(95, 53, 46, 0.8)'], "학생회관");
        case 99:
            return new Subject('회식', 673, 528, 2, ["#47a978", 'rgba(71, 169, 120, 0.8)'], "건대입구역");
        case 111:
            return new Subject('게임', 573, 203, 3, ["#304058", 'rgba(48, 64, 88, 0.8)', 'rgba(48, 64, 88, 0.5)'], "건대입구역");

        // 2학년
        case 11: // 자료구조1
            return new Subject('자료구조', 73, 40, 1, "#7aa1dc", "공A602"); //격일 200차이
        case 12: // 자료구조2
            return new Subject('자료구조', 273, 40, 1, "#7aa1dc", "공A602");
        case 13: // 웹 프로그래밍1
            return new Subject('웹프로그래밍', 173, 95, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새403");
        case 14: // 웹 프로그래밍2
            return new Subject('웹프로그래밍', 373, 95, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새403");
        case 15: // 전공기초프로젝트1(종합설계) 1 
            return new Subject('전기프', 273, 257, 2, ["#f5afa2", 'rgba(245, 175, 162, 0.8)'], "새403");
        case 16: // 전공기초프로젝트1(종합설계) 2
            return new Subject('전기프', 473, 257, 2, ["#f5afa2", 'rgba(245, 175, 162, 0.8)'], "새403");
        case 17: // 선형대수학 1 
            return new Subject('선형대수학', 73, 258, 1, "#c4dd59", "공403");
        case 18: // 선형대수학 2 
            return new Subject('선형대수학', 273, 365, 1, "#c4dd59", "공403");
        case 19: // 공학수학 1 
            return new Subject('인공지능', 73, 420, 2, ["#e46a58", 'rgba(228, 106, 88,0.8)'], "공B556");

        case 112: // 공학수학 2 
            return new Subject('아르바이트', 673, 365, 2, ["#d89cd9", 'rgba(216, 156, 217,0.8)'], "공B556");
       
        //3학년
        case 21: // 미분적분학1
            return new Subject('알고리즘', 173, 40, 2, ["#7aa1dc", "rgba(122, 161, 220, 0.8)"], "공A602"); //격일 200차이
        case 22: // 미분적분학2
            return new Subject('알고리즘', 373, 40, 2, ["#7aa1dc", "rgba(122, 161, 220, 0.8)"], "공A602");
        case 23: // C프로그래밍1
            return new Subject('데이터베이스', 73, 148, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새401");
        case 24: // C프로그래밍2
            return new Subject('데이터베이스', 273, 148, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새401");
        case 25: // JAVA프로그래밍 1 
            return new Subject('모바일프로그래밍', 173, 203, 3, ["#f5afa2", 'rgba(245, 175, 162, 0.8)', 'rgba(245, 175, 162, 0.8)'], "새401");
        case 26: // JAVA프로그래밍 2
            return new Subject('모바일프로그래밍', 373, 203, 3, ["#f5afa2", 'rgba(245, 175, 162, 0.8)','rgba(245, 175, 162, 0.8)'], "새401");
        case 27: // 공학수학 1 
            return new Subject('운영체제', 73, 365, 2, ["#e46a58",'rgba(228, 106, 88, 0.8)'], "공B556");
        case 28: // 공학수학 2 
            return new Subject('운영체제', 273, 365, 2, ["#e46a58",'rgba(228, 106, 88, 0.8)'], "공B556");    
        case 121:
            return new Subject('운동', 573, 40, 2, ["#D96B62", 'rgba(217, 107, 98, 0.8)'], "헬스장");
        case 122:
            return new Subject('영화', 573, 203, 3, ["#F29966", 'rgba(242, 153, 102, 0.8)' , 'rgba(242, 153, 102, 0.8)'], "롯데시네마");
        case 123:
            return new Subject('쇼핑', 673, 148, 2, ["#F2C46D", 'rgba(242, 196, 109, 0.8)'], "백화점");
        case 124:
            return new Subject('맛집탐방', 673, 364, 1, "#A5BF6B", "맛의 거리");
        case 125: 
            return new Subject('늦잠', 473, 40, 3, ["#e16b99",'rgba(225, 107, 153, 0.8)','rgba(225, 107, 153, 0.5)'], "집");
        case 126: 
            return new Subject('쪽잠', 73, 258, 1, "#c19b88", "고음감");
        case 127: 
            return new Subject('쪽잠', 273, 258, 1, "#c19b88", "고음감");

        //4학년
        case 31: // 미분적분학1
            return new Subject('게임프로그래밍', 173, 40, 2, ["#7aa1dc", "rgba(122, 161, 220, 0.8)"], "공A602"); //격일 200차이
        case 32: // 미분적분학2
            return new Subject('가상현실', 373, 95, 2, ["#9eb9db", "rgba(158, 185, 219, 0.8)"], "공A602");
        case 33: // C프로그래밍1
            return new Subject('웹기술 및 응용', 73, 148, 2, ["#edcd86", 'rgba(237, 205, 134, 0.8)'], "새401");
        case 34: // C프로그래밍2
            return new Subject('소프트웨어 V&V', 273, 148, 2, ["#dddd99", 'rgba(221, 221, 153, 0.8)'], "새401");
        case 35: // JAVA프로그래밍 1 
            return new Subject('컴퓨터비전', 173, 311, 2, ["#f5afa2", 'rgba(245, 175, 162, 0.8)'], "새401");
        case 36: // 이름 길다. 7자 제한
            return new Subject('신호처리', 373, 258, 2, ["#f5cfa9", 'rgba(245, 207, 169, 0.8)'], "새401");
        case 37: // 공학수학 1 
            return new Subject('기계학습', 73, 474, 2, ["#e46a58",'rgba(228, 106, 88, 0.8)'], "공B556");
        case 38: // 공학수학 2 
            return new Subject('암호학', 273, 365, 2, ["#c48c88",'rgba(196, 140, 136, 0.8)'], "공B556");
        case 39: // 컴퓨팅적사고 
            return new Subject('졸업프로젝트', 473, 204, 3, ["#e16b99",'rgba(225, 107, 153, 0.8)','rgba(225, 107, 153, 0.8)'], "공B556");

        case 131:
            return new Subject('코딩프로젝트', 573, 40, 2, ["#D96B62", 'rgba(217, 107, 98, 0.8)'], "카페");
        case 132:
            return new Subject('인턴', 573, 203, 3, ["#F29966", 'rgba(242, 153, 102, 0.8)' , 'rgba(242, 153, 102, 0.8)'], "회사");
        case 133:
            return new Subject('자격증 준비', 673, 148, 2, ["#F2C46D", 'rgba(242, 196, 109, 0.8)'], "스터디카페");
        case 134:
            return new Subject('학회발표', 673, 364, 1, "#A5BF6B", "회의실");
    }
}

// 높이 계산 함수
function calHeight(brick) {
    switch(brick.size) {
        case 1: return 53;
        case 2: return 105;
        case 3: return 158; 
    }
}

//다크모드 함수
function darkMode(){
    if($("body").attr("class") == "dark"){
        $(".post").attr("class", "darkpost");
        $(".popup").css("background-color", "black"); 
    }
    else{
        $(".post").attr("class", "post");
        $(".popup").css("background-color", "white");
    }
}

function selectGrade(str){
    switch(str){
        case 'A':
            return 'img/A.png';
        case 'A+':
            return 'img/A+.png';
        case 'B':
            return 'img/B.png';
        case 'B+':
            return 'img/B+.png';
        case 'C':
            return 'img/C.png';
        case 'C+':
            return 'img/C+.png';
        case 'F':
            return 'img/F.png';
    }
}