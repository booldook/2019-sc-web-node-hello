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
ajax("/gbook_ajax", "get", 1, function(data) {
	console.log(data);
});

