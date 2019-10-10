// 아이디 중복 체크
$("#userid").on("blur", function () {
	var userid = $(this).val().trim();
	var idType = /^[A-Za-z0-9+]{8,16}$/;
	$(".userid-cmt").empty();
	if (idType.test(userid)) {
		ajax("/api-mem/userid", "post", {userid: userid}, function (res) {
			if (res.chk) {
				$(".userid-cmt").text('* 사용가능한 아이디 입니다.');
				$(".userid-cmt").css({"color": "blue"});
				$("#userid").css({"border": "1px solid blue"});
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



