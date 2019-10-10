// 아이디 중복 체크
$("#userid").on("blur", function(){
	var userid = $(this).val();
	ajax("/api-mem/userid", "post", {userid: userid}, function(res){
		console.log(res);
	});
});