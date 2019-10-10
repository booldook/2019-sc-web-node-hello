// 아이디 중복 체크
$("#userid").on("blur", function () {
	var userid = $(this).val();
	$(".userid-cmt").empty();
	if (userid.length >= 8 && userid.length <= 16) {
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
		$(".userid-cmt").text("* 아이디는 8 ~ 16자 입니다.");
		$(".userid-cmt").css({"color": "red"});
		$("#userid").css({"border": "1px solid red"});
		$("#userid").focus();
	}
});