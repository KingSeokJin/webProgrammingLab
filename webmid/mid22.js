window.onload = changeColor;
function changeColor() {
	var now = new Date();
	if(now.getHours() < 6) {
		document.getElementById("title").style.color = "gray";
	} else if(now.getHours() < 12) {
		document.getElementById("title").style.color = "yellow";
	} else if(now.getHours() < 18) {
		document.getElementById("title").style.color = "red";
	} else {
		document.getElementById("title").style.color = "blue";
	}
	// setTimeout('setCTime()', 1000);
}