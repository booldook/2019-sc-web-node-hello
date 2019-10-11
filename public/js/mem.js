function memberJoin(f) {
	if($("#userid").data("use") !== "T") {
		alert("아이디를 입력하세요.");
		$("#userid").focus();
		return false;
	}
	if($("#userpw").val().length < 8 || $("#userpw").val().length > 16) {
		alert("패스워드는 8 ~ 16자 입니다.")
		$("#userpw").focus();
		return false;
	}
	if($("#userpw").val() !== $("#userpw2").val()) {
		alert("패스워드가 일치하지 않습니다.")
		$("#userpw").focus();
		return false;
	}
	if($("#username").val().trim() == "") {
		alert("이름을 입력하세요.")
		$("#username").focus();
		return false;
	}
	if($("#tel1").val() == "") {
		alert("전화번호를 입력하세요.")
		$("#tel1").focus();
		return false;
	}
	if($("#tel2").val() == "") {
		alert("전화번호를 입력하세요.")
		$("#tel2").focus();
		return false;
	}
	if($("#tel3").val() == "") {
		alert("전화번호를 입력하세요.")
		$("#tel3").focus();
		return false;
	}
	return true;
}

// 아이디 중복 체크
$("#userid").on("blur", function () {
	var userid = $(this).val().trim();
	var idType = /^[A-Za-z0-9+]{8,16}$/;
	$(".userid-cmt").empty();
	$("#userid").data("use", "F");
	if (idType.test(userid)) {
		ajax("/api-mem/userid", "post", {userid: userid}, function (res) {
			if (res.chk) {
				$(".userid-cmt").text('* 사용가능한 아이디 입니다.');
				$(".userid-cmt").css({"color": "blue"});
				$("#userid").css({"border": "1px solid blue"});
				$("#userid").data("use", "T");
			} else {
				$(".userid-cmt").text('* 사용할 수 없는 아이디 입니다.');
				$(".userid-cmt").css({"color": "red"});
				$("#userid").css({"border": "1px solid red"});
				$("#userid").focus();
			}
		});
	}
	else {
		$(".userid-cmt").text("* 아이디는 영문, 숫자 8 ~ 16자 입니다.");
		$(".userid-cmt").css({"color": "red"});
		$("#userid").css({"border": "1px solid red"});
		$("#userid").focus();
	}
});


function memberLogin(f) {
	if($("#loginid").val().trim() === "") {
		alert("아이디를 입력해 주세요.");
		$("#loginid").focus();
		return false;
	}
	if($("#loginpw").val().trim() === "") {
		alert("패스워드를 입력해 주세요.");
		$("#loginpw").focus();
		return false;
	}
	return true;
}
