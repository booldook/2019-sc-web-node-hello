function onSend(f) {
	if(f.writer.value.trim() === "") {
		alert("작성자를 입력하세요.");
		f.writer.focus();
		return false;
	}
	if(f.pw.value.trim().length > 16 || f.pw.value.trim().length < 6) {
		alert("비밀번호는 6 ~ 16 자로 입력하세요.");
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

function onRev(f) {
	if(f.id.value.trim() === "") {
		alert("삭제할 데이터의 id가 필요합니다.");
		return false;
	}
	if(f.pw.value.trim().length > 16 || f.pw.value.trim().length < 6) {
		alert("비밀번호는 6 ~ 16 자 입니다.");
		f.pw.focus();
		return false;
	}
	return true;
}


$(".page-item").click(function(){
	var n = $(this).data("page");
	if(n !== undefined) location.href = "/gbook/li/"+n;
});

// 상세내용보기 - modal POPUP
$("#gbook-tb td").not(":last-child").click(function(){
	var id = $(this).parent().children("td").eq(0).text();
	$.ajax({
		type: "get",
		url: "/api/modalData",
		data: {id: id},
		dataType: "json",
		success: function (res) {
			$("#gbook-modal").find(".img-tr").addClass("d-none");
			$("#gbook-modal").find(".img-tr").find("img").attr("src", "");
			$("#gbook-modal").find(".file-tr").addClass("d-none");
			$("#gbook-modal").find(".file-tr").find("a").attr("href", "#");
			$("#gbook-modal").find(".file-tr").find("a").text("");
			if(res.savefile != null && res.savefile != "") {
				var file = splitName(res.savefile);
				var ext = file.ext.toLowerCase();
				var ts = Number(file.name.split("-")[0]);
				var dir = findPath(new Date(ts));
				var imgPath = "/uploads/"+dir+"/"+res.savefile; 
				var downPath = "/download?fileName="+res.savefile+"&downName="+res.orifile
				if(fileExt.indexOf(ext) > -1) {
					// 첨부파일
					$("#gbook-modal").find(".file-tr").removeClass("d-none");
					$("#gbook-modal").find(".file-tr").find("a").attr("href", downPath);
					$("#gbook-modal").find(".file-tr").find("a").text(res.orifile);
				}
				else {
					// 첨부이미지
					$("#gbook-modal").find(".img-tr").removeClass("d-none");
					$("#gbook-modal").find(".img-tr").find("img").attr("src", imgPath);
				}
			}
			$("#gbook-modal tr").eq(0).children("td").eq(1).html(res.writer);
			$("#gbook-modal tr").eq(1).children("td").eq(1).html(dspDate(new Date(res.wtime)));
			$("#gbook-modal tr").eq(2).find("div").html(res.comment);
			$("#gbook-modal").modal("show");
		}
	});
});

// 삭제기능
$(".btRev").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text();
	//$("form[name='removeForm']").find("input[name='id']")
	$("#remove-modal").find("input[name='id']").val(id);
	$("#remove-modal").find("input[name='pw']").val('');
	$("#remove-modal").modal("show");
});

$("#remove-modal").on("shown.bs.modal", function(){
	$("#remove-modal").find("input[name='pw']").focus();
});

// 수정기능
$(".btChg").click(function(){
	var id = $(this).parent().parent().children("td").eq(0).text();
	$("#update-modal").find("input[name='id']").val(id);
	upAjax(id);
});

function onReset() {
	var id = $("form[name='upForm']").find("input[name='id']").val();
	upAjax(id);
}

function upAjax(id) {
	$.ajax({
		type: "get",
		url: "/api/modalData",
		data: {id: id},
		dataType: "json",
		success: function (res) {
			$("form[name='upForm']").find("input[name='writer']").val(res.writer);
			$("form[name='upForm']").find("textarea[name='comment']").val(res.comment);
			$("#update-modal").modal("show");
		}
	});
}


// $(f).find("input[name='writer']").val().trim() <-- jQuery
// f.writer.value.trim() <-- javascript
