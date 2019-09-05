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

// 방명록을 node.js 개발자가 전부 만드는 방식
app.get(["/gbook", "/gbook/:type"], (req, res) => {
	var type = req.params.type;
	var vals = {css: "gbook", js: "gbook"}
	var pug;
	switch(type) {
		case "in":
			vals.title = "방명록 작성";
			pug = "gbook_in";
			res.render(pug, vals);
			break;
		default:
			var sql = "SELECT * FROM gbook ORDER BY id DESC";
			sqlExec(sql).then((data) => {
				// console.log(data[0]);
				vals.datas = data[0];
				vals.title = "방명록";
				pug = "gbook";
				for(let item of data[0]) item.wtime = util.dspDate(new Date(item.wtime));
				// console.log(data[0][0]);
				res.render(pug, vals);
			}).catch(sqlErr);
			break;
	}
});

// 방명록을 Ajax 통신으로 데이터만 보내주는 방식
app.get("/gbook_ajax", (req, res) => {
	const title = "방명록 - Ajax";
	const css = "gbook_ajax";
	const js = "gbook_ajax"
	const vals = {title, css, js};
	res.render("gbook_ajax", vals);
});


// router 영역 - POST
app.post("/gbook_save", (req, res) => {
	const writer = req.body.writer;
	const pw = req.body.pw;
	const comment = req.body.comment;
	const sql = "INSERT INTO gbook SET comment=?, wtime=?, writer=?, pw=?";
	const vals = [comment, util.dspDate(new Date()), writer, pw];
	sqlExec(sql, vals).then((data) => {
		console.log(data);
		res.redirect("/gbook");
	}).catch(sqlErr);
});

