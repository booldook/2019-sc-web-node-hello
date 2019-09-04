// app 실행
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
	console.log("http://127.0.0.1:"+port);
});

// node_modules 참조
const bodyParser = require("body-parser");

// modules 참조
const util = require("./modules/util");
const db = require("./modules/mysql_conn");

// 전역변수 선언
const sqlPool = db.sqlPool;
const sqlExec = db.sqlExec;
const sqlErr = db.sqlErr;
const mysql = db.mysql;

// app 초기화
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "pug");
app.set("views", "./views");
app.locals.pretty = true;



// router 영역 - GET

// http://127.0.0.1:3000/page
// http://127.0.0.1:300/page/1
app.get(["/page", "/page/:page"], (req, res) => {
	var page = req.params.page;
	if(!page) page = "미선택";
	var title = "도서목록";
	var css = "page";
	var js = "page"
	var vals = {page, title, css, js};
	res.render("page", vals);
});

app.get(["/gbook", "/gbook/:type"], (req, res) => {
	var type = req.params.type;
	var vals = {css: "gbook", js: "gbook"}
	var pug;
	switch(type) {
		case "in":
			vals.title = "방명록 작성";
			pug = "gbook_in";
			break;
		default:
			vals.title = "방명록";
			pug = "gbook";
			break;
	}
	res.render(pug, vals);
});

// router 영역 - POST

