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
const pager = require("./modules/pager");
const mt = require("./modules/multer_conn");

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
/*
type: /in - 방명록 작성
type: /li/1(id - page) - 방명록 리스트 보기
type: /up/1(id) - 선택된 방명록 수정
type: /rm/1(id) - 선택된 방명록 삭제
*/
app.get(["/gbook", "/gbook/:type", "/gbook/:type/:id"], (req, res) => {
	var type = req.params.type;
	var id = req.params.id;
	if(type === undefined) type = "li";
	if(type === "li" && id === undefined) id = 1;
	if(id === undefined && type !== "in") res.redirect("/404.html");
	var vals = {css: "gbook", js: "gbook"}
	var pug;
	var sql;
	var sqlVal;
	var result;
	switch(type) {
		case "in":
			vals.title = "방명록 작성";
			pug = "gbook_in";
			res.render(pug, vals);
			break;
		case "li":
			(async () => {
				var totCnt = 0;
				var page = id;
				var divCnt = 3;
				var grpCnt = req.query.grpCnt;
				if(grpCnt === undefined || typeof grpCnt !== "number") grpCnt = 5;
				sql = "SELECT count(id) FROM gbook";
				result = await sqlExec(sql);
				totCnt = result[0][0]["count(id)"];
				const pagerVal = pager.pagerMaker({totCnt, page, grpCnt});
				sql = "SELECT * FROM gbook ORDER BY id DESC limit ?, ?";
				sqlVal = [pagerVal.stRec, pagerVal.grpCnt];
				result = await sqlExec(sql, sqlVal);
				vals.datas = result[0];
				vals.title = "방명록";
				vals.pager = pagerVal;
				for(let item of vals.datas) item.wtime = util.dspDate(new Date(item.wtime));
				pug = "gbook";
				res.render(pug, vals);
			})();
			break;
		default:
			res.redirect("/404.html");
			break;
	}
});

// http://127.0.0.1/api/modalData?id=2
// http://127.0.0.1/api/remove?id=2&pw=11111111
app.get("/api/:type", (req, res) => {
	var type = req.params.type;
	var id = req.query.id;
	var pw = req.query.pw;
	var sql;
	var vals = [];
	var result;
	switch(type) {
		case "modalData":
			if(id === undefined) res.redirect("/500.html");
			else {
				sql = "SELECT * FROM gbook WHERE id=?";
				vals.push(id);
				(async () => {
					result = await sqlExec(sql, vals);
					res.json(result[0][0]);
				})();
			}
			break;
		default:
			res.redirect("/404.html");
			break;
	}
});

app.post("/api/:type", (req, res) => {
	var type = req.params.type;
	var id = req.body.id;
	var pw = req.body.pw;
	var writer = req.body.writer;
	var comment = req.body.comment;
	var page = req.body.page;
	var sql = "";
	var vals = [];
	var result;
	var html;
	switch(type) {
		case "remove":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				sql = "DELETE FROM gbook WHERE id=? AND pw=?";
				vals.push(id);
				vals.push(pw);
				(async () => {
					result = await sqlExec(sql, vals);
					html = '<meta charset="utf-8"><script>';
					if(result[0].affectedRows == 1) {
						html += 'alert("삭제되었습니다.");';
						html += 'location.href = "/gbook/li/'+page+'";';
					}
					else {
						html += 'alert("비밀번호가 올바르지 않습니다.");';
						html += 'history.go(-1)';
					}
					html += '</script>';
					res.send(html);
					//res.json(result);
				})();
			}
			break;
		case "update":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				sql = "UPDATE gbook SET writer=?, comment=? WHERE id=? AND pw=?";
				vals.push(writer);
				vals.push(comment);
				vals.push(id);
				vals.push(pw);
				(async () => {
					result = await sqlExec(sql, vals);
					html = '<meta charset="utf-8"><script>';
					if(result[0].affectedRows == 1) {
						html += 'alert("수정되었습니다.");';
						html += 'location.href = "/gbook/li/'+page+'";';
					}
					else {
						html += 'alert("비밀번호가 올바르지 않습니다.");';
						html += 'history.go(-1)';
					}
					html += '</script>';
					res.send(html);
				})();
			}
			break;
		default :
			res.redirect("/404.html");
			break;
	}
});




// 방명록 Ajax로 구현
// 방명록을 Ajax 통신으로 데이터만 보내주는 방식
app.get("/gbook_ajax", (req, res) => {
	const title = "방명록 - Ajax";
	const css = "gbook_ajax";
	const js = "gbook_ajax"
	const vals = {title, css, js};
	res.render("gbook_ajax", vals);
});

// http://127.0.0.1:3000/gbook_ajax/1?grpCnt=10
app.get("/gbook_ajax/:page", (req, res) => {
	var page = Number(req.params.page);			//1
	var grpCnt = Number(req.query.grpCnt);	//10 한페이지에 보여질 목록 갯수
	var stRec = (page - 1) * grpCnt;	//목록을 가져오기 위해 목록의 시작 INDEX
	var vals = [];		// query에 보내질 ? 값
	var sql;
	var result;
	var reData = {};
	/*
	{
		totCnt: 2,
		rs: [
			{id:1, comment:"", wtime:"", writer:""},
			{id:1, comment:"", wtime:"", writer:""}
		]
	}
	*/
	(async () => {
		// 총 페이지 수 가져오기
		sql = "SELECT count(id) FROM gbook";
		result = await sqlExec(sql);
		reData.totCnt = result[0][0]["count(id)"];

		// 레코드 가져오기
		sql = "SELECT * FROM gbook ORDER BY id DESC LIMIT ?, ?";
		vals = [stRec, grpCnt];
		result = await sqlExec(sql, vals);
		reData.rs = result[0];
		//console.log(reData);
		res.json(reData);
	})();
});


// router 영역 - POST
app.post("/gbook_save", mt.upload.single("upfile"), (req, res) => {
	const writer = req.body.writer;
	const pw = req.body.pw;
	const comment = req.body.comment;
	var orifile = "";
	var savefile = "";
	console.log(req.body.upfile);
	if(req.file) {
		orifile = req.file.originalname;
		savefile = req.file.filename;
	}
	var result;

	const sql = "INSERT INTO gbook SET comment=?, wtime=?, writer=?, pw=?, orifile=?, savefile=?";
	const vals = [comment, util.dspDate(new Date()), writer, pw, orifile, savefile];
	(async () => {
		result = await sqlExec(sql, vals);
		if(result[0].affectedRows > 0) res.redirect("/gbook");
		else res.redirect("/500.html");
	})();
});

