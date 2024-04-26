window.onload = function() {
    setCTime();
    changeColor();
    document.getElementById("btn1").onclick = calc;
    document.getElementById("btn2").onclick = guess;
    document.getElementById("btn3").onclick = replay;
    document.getElementById("btn4").onclick = changeImage;
    document.getElementById("ctCreate").onclick = createColorTable;
    document.getElementById("ctRemove").onclick = removeColorTable;
    document.getElementById("btn7").onclick = stopTextColor;
    document.getElementById("btn8").onclick = myMove;
    document.getElementById("guessbutton").onclick = guessLetter;
    document.getElementById("btn10").onclick = newgame;
}

function calc() {
    var x = document.getElementById("x").value;
    var y = document.getElementById("y").value;
    var sum = document.getElementById("sum");
    sum.value = parseInt(x) + parseInt(y);
}

var computerNumber = Math.floor(Math.random()*100 + 1); //정답
var nGuesses = 0; // 추측횟수   

function guess() {
    var userNumber = parseInt(document.getElementById("user").value); 
    var guessesInput = document.getElementById("guesses"); 
    var resultInput = document.getElementById("result"); 
    nGuesses++; 

    var ans = document.getElementById("answer");
    ans.value = computerNumber;
    
    if (userNumber === computerNumber) {
        resultInput.value = "정답입니다!";
    } else if (userNumber < computerNumber) {
        resultInput.value = "숫자가 작습니다.";
    } else {
        resultInput.value = "숫자가 큽니다.";
    }
    guessesInput.value = nGuesses;

}

function replay() {
    nGuesses = 0;
    computerNumber = Math.floor(Math.random() * 100) + 1;
    document.getElementById("user").value = "";
    document.getElementById("guesses").value = "";
    document.getElementById("result").value = "";
    document.getElementById("answer").value = "";


    ans.value = computerNumber;
}

function setCTime() {
    var now = new Date();
    var month;
    switch (now.getMonth()) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
    }

    var s = month + " " + now.getDate() + '.' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

    document.getElementById('ctime').innerHTML = s;
    setTimeout(setCTime, 1000);
}
//
// constants
var POSSIBLE_WORDS = ["obdurate", "verisimilitude", "defensetrate", "obsequious", "dissonant", "today", "idempotent", "apple", "destiny"];
var MAX_GUESSES = 6;

// global variable
var guesses = ""; // 사용자 추측. 새로운 문자 입력될때마다 여기로 추가
var guessCount = MAX_GUESSES; // 최대 추측횟수(6회)
var word; // random word user is trying to guess (현재 단어)

function updatePage() {
    //update clue string
    var clueString = "";
    for(var i =0; i<word.length;i++){
        var letter = word.charAt(i);
        if(guesses.indexOf(letter) >= 0){ //맞추면
            clueString += letter + " ";
        }else{
            clueString +="_ ";            
        }
    }
    
    var clue = document.getElementById("clue");
    clue.innerHTML = clueString;

    var guessArea = document.getElementById("guessstr");
    if(guessCount == 0) {
        guessArea.innerHTML = "You lose";
    }else if(clueString.indexOf("_") < 0) { // "_"가 없으면
        guessArea.innerHTML = "You win!";
    } else {
        guessArea.innerHTML = "Guesses: " + guesses;
    }

    var image = document.getElementById("hangmanpic");
    image.src = "hangman" + guessCount + ".gif";
}

function newgame() {
    //choose a random word
    var randomIndex = parseInt(Math.random() * POSSIBLE_WORDS.length); // 이거 꼭 기억하기
    word = POSSIBLE_WORDS[randomIndex];
    guessCount = MAX_GUESSES;
    guesses = "";
    var guessButton = document.getElementById("guessbutton");
    guessButton.disabled = false; // 버튼활성화
    updatePage();
}

function guessLetter() {
    var input = document.getElementById("hguess");
    var clue = document.getElementById("clue");
    var letter = input.value;
    //원래 있는 문자열을 다시 입력하면 탈츨
    if(guessCount == 0 || clue.innerHTML.indexOf("_") < 0 || guesses.indexOf(letter) >= 0){
        return; //기회를 다썼거나, 전부 맞췄거나, 이미 있는 문자를 입력했거나.
    }
    //새로운 문자인 경우
    guesses += letter;

    //단어에 해당문자 포함여부 확인
    if(word.indexOf(letter) < 0) { // 문자열이 없으면 음수 값 반환
        guessCount--;
    }
    updatePage();    
}

function changeImage(){
    var bimg = document.getElementById("image");
    var sarray = bimg.src.split('/'); //sarray 라는 배열 생성, src는 절대경로상 마지막부분이 파일 이름임.
    var str = sarray[sarray.length-1]; // sarray 배열의 마지막 요소(파일 이름)를 가르키는 배열
    if(str == "pickachu.png"){
        bimg.src = "Raichu.png";
    }else {
        bimg.src = "pickachu.png";
    }
}

var colorNames = ["maroon", "red", "orange", "yellow", "olive", "purple", "fuchsia", "white", "lime", "green", "navy", "blue", "aqua", "teal", "black", "silver", "gray"];

function createColorTable(){
    var colordiv = document.getElementById("colorTable");
    for(var i=0; i<colorNames.length; i++){
        var ndiv = document.createElement("div");
        ndiv.setAttribute("class", "ctbox"); // css에서 활용하려고.
        ndiv.innerHTML = colorNames[i];
        ndiv.style.display = "inline-block"; // css에서 정의하긴함
        ndiv.style.width = "60px"; // css에서 정의하긴함
        ndiv.style.padding = "10px"; // css에서 정의하긴함
        ndiv.style.backgroundColor = colorNames[i];
        colordiv.appendChild(ndiv);
    }

}

function removeColorTable() {
//    var colordiv = document.getElementById("colorTable");
//    colorTableDiv.innerHTML = ""; // 기존 내용 지우기 - 이것도 되긴해
    
//    var table = document.createElement("table"); // 테이블 만들기

    var parent = document.getElementById("colorTable");
    var child = parent.getElementsByTagName("div");
 //   for(var i = 0; i<child.length ; i++){
 //       parent.removeChild(child[i]);
 //   } 문제점 : 한번에 안지워짐.


 //방법 1
    while(child[0]){
        parent.removeChild(child[0]);
    }
//방법 2
//    while(colordiv.hasChildNodes()) {
//        colordiv.removeChild(colordiv.firstChild);
//    }
}

var id;
function changeColor() {

    id = setInterval(flashText, 1000);

    function flashText() {
        var elem = document.getElementById("target");
        elem.style.color = (elem.style.color == "red") ? "blue" : "red";
        elem.style.backgroundColor = (elem.style.backgroundColor == "green")?"yellow" : "green";
    }

    //틀린코드
//    var tg = getElementById("target");
//    tg.style.backgroundColor ="green";
//    if(tg.style.backgroundColor == "green") {
//        tg.style.backgroundColor = "yellow";
//    } else{
//        tg.style.backgroundColor = "green";
//    }
//    setInterval(changeColor, 1000);
}

function stopTextColor() {
    clearInterval(id);
}

function myMove() {
    var elem = document.getElementById("animate");
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {

        if(pos == 350) { // 빨간상자 크기 고려
            clearInterval(id);
        }
        pos++;
        elem.style.top = pos + "px";
        elem.style.left = pos + "px";
    }
}
