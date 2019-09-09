/*
// Javascript Ajax
var page = 1
var url = "/gbook_ajax/" + page;
var xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.send(data);

xhr.addEventListener('load', function() {
	console.log(xhr.responseText);
});
*/

// ajax("/gbook_ajax", {page: 1})
ajax("/gbook_ajax/1", "get", {grpCnt: 5}, function(data) {
	// console.log(data); 
	// [{totCnt: 2}, [{id:2, writer:"홍길동", ...},{id:2, writer:"홍길동", ...}]]
	var totCnt = data[0].totCnt;	//{totCnt: 2}
	var rs = data[1];			// {id:2, writer:"홍길동", ...}
	var html = '';

	$(".gbook-tb > tbody").empty();
	for(var i in rs) {
		html  = '<tr>';
		html += '<td>'+rs[i].id+'</td>';
		html += '<td>'+rs[i].writer+'</td>';
		html += '<td>'+dspDate(new Date(rs[i].wtime))+'</td>';
		html += '<td>'+rs[i].comment+'</td>';
		html += '<td>';
		html += '<button class="btn btn-success btn-sm">수정</button> ';
		html += '<button class="btn btn-danger btn-sm">삭제</button>';
		html += '</td>';
		html += '</tr>';
		$(".gbook-tb > tbody").append(html);
	}
});

