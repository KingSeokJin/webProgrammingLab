var LEVEL;
var textElement;

const urlParams = new URLSearchParams(window.location.search);
LEVEL = urlParams.get('value');

if (LEVEL == 1) {
  textElement = document.getElementById('typewriter1');
  textElement.style.display = 'block';
} else if (LEVEL == 2) {
  textElement = document.getElementById('typewriter2');
  textElement.style.display = 'block';
} else {
  textElement = document.getElementById('typewriter3');
  textElement.style.display = 'block';
}

const text = textElement.innerText;
textElement.innerText = ''; // 초기화
let i = 0;
        
function typeWriter() {
  if (i < text.length) {
    textElement.innerText += text.charAt(i);
    i++;
    setTimeout(typeWriter, 50); // 다음 글자 출력까지 50ms 대기
  }
}
        
typeWriter(); // 함수 실행