function onSend(f) {
	if(f.writer.value.trim() === "") {
		alert("작성자를 입력하세요.");
		f.writer.focus();
		return false;
	}
	if(f.pw.value.trim().length > 16 || f.pw.value.trim().length < 8) {
		alert("비밀번호는 8 ~ 16 자로 입력하세요.");
		f.pw.focus();
		return false;
	}
	if(f.comment.value.trim() === "") {
		alert("내용을 입력하세요.");
		f.comment.focus();
		return false;
	}
	return true;
}

$(".page-item").click(function(){
	var n = $(this).data("page");
	if(n !== undefined) location.href = "/gbook/li/"+n;
});

$("#gbook-tb td").not(":last-child").click(function(){
	
	//$("#gbook-modal").modal("show");
});

/*
$("#bt-close").click(function(){
	$("#gbook-modal").modal("hide");
});
*/