// '2019년 8월 11일 9시 8분 11초' 형식으로 보내주는 함수
function dspDate(d, type) {
	var type = typeof type !== 'undefined' ?  type : 0;
	var monthArr = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
	var year = d.getFullYear() + "년 ";	// 2019
	var month = monthArr[d.getMonth()] + " "; // 7 (0 ~ 11)
	var day = d.getDate() + "일 "; // 1 ~ 31
	var hour = d.getHours() + "시 "; // 0 ~ 23
	var min = d.getMinutes() + "분 "; // 0 ~ 59
	var sec = d.getSeconds() + "초 "; // 0 ~ 59
	var returnStr;
	/* 
	type 0: 2019년 8월 11일 9시 8분 11초
	type 1: 2019년 8월 11일 9시 8분
	type 2: 2019년 8월 11일 9시
	type 3: 2019년 8월 11일
	type 4: 8월 11일
	type 5: 11시 11분 12초
	*/
	switch(type) {
		case 1 :
			returnStr = year + month + day + hour + min;
			break;
		case 2 :
			returnStr = year + month + day + hour;
			break;
		case 3 :
			returnStr = year + month + day;
			break;
		case 4 :
			returnStr = month + day;
			break;
		case 5 :
			returnStr = hour + min + sec;
			break;
		default :
			returnStr = year + month + day + hour + min + sec;
			break;
	}
	return returnStr;
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      } 
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

includeHTML();