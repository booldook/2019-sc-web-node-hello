function onSend(f) {
	console.log(f);
	if(f.comment.value.trim() === "") {
		alert("내용을 입력하세요.");
		f.comment.focus();
		return false;
	}
	return true;
}