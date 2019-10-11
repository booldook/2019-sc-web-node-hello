// app 실행
const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
	console.log("http://127.0.0.1:"+port);
});

// node_modules 참조
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const session = require("express-session");
const store = require("session-file-store")(session);

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
const salt = "My Password Key";

// app 초기화
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: salt,
	resave: false,
	saveUninitialized: true,
	store: new store()
}));
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
	var js = "page";
	var loginId = req.session.userid;
	var vals = {page, title, css, js, loginId};
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
	var loginId = req.session.userid;
	if(type === undefined) type = "li";
	if(type === "li" && id === undefined) id = 1;
	if(id === undefined && type !== "in") res.redirect("/404.html");
	var vals = {css: "gbook", js: "gbook", loginId}
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
				for(let item of vals.datas) item.useIcon = util.iconChk(item.wtime, item.savefile);
				console.log(vals.datas);
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

app.post("/api/:type", mt.upload.single("upfile"), (req, res) => {
	var type = req.params.type;
	var id = req.body.id;
	var pw = req.body.pw;
	var writer = req.body.writer;
	var comment = req.body.comment;
	var page = req.body.page;
	var sql = "";
	var vals = [];
	var result;
	var obj = {};
	var orifile = "";
	var savefile = "";
	var oldfile = "";
	if(req.file) {
		orifile = req.file.originalname;
		savefile = req.file.filename;
	}
	switch(type) {
		case "remove":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				vals.push(id);
				vals.push(pw);
				(async () => {
					// 첨부파일 가져오기
					sql = "SELECT savefile FROM gbook WHERE id="+id;
					result = await sqlExec(sql);
					savefile = result[0][0].savefile;
					// 실제 데이터베이스 삭제
					sql = "DELETE FROM gbook WHERE id=? AND pw=?";
					result = await sqlExec(sql, vals);
					if(result[0].affectedRows == 1) {
						obj.msg = "삭제되었습니다.";
						if(util.nullChk(savefile)) fs.unlinkSync(path.join(__dirname, "/public/uploads/"+mt.getDir(savefile)+"/"+savefile));
					}
					else obj.msg = "비밀번호가 올바르지 않습니다.";
					obj.loc = "/gbook/li/"+page;
					res.send(util.alertLocation(obj));
					//res.json(result);
				})();
			}
			break;
		case "update":
			if(id === undefined || pw === undefined) res.redirect("/500.html");
			else {
				vals.push(writer);
				vals.push(comment);
				if(req.file) vals.push(orifile);
				if(req.file) vals.push(savefile);
				vals.push(id);
				vals.push(pw);
				(async () => {
					// 첨부파일 가져오기
					sql = "SELECT savefile FROM gbook WHERE id="+id;
					result = await sqlExec(sql);
					oldfile = result[0][0].savefile;
					// 실제 데이터 수정
					sql = "UPDATE gbook SET writer=?, comment=? ";
					if(req.file) sql += ", orifile=?, savefile=? ";
					sql += " WHERE id=? AND pw=?";
					result = await sqlExec(sql, vals);
					if(result[0].affectedRows == 1) {
						obj.msg = "수정되었습니다.";
						// 기존파일 삭제하기
						if(req.file && util.nullChk(oldfile)) fs.unlinkSync(path.join(__dirname, "/public/uploads/"+mt.getDir(oldfile)+"/"+oldfile));
					}
					else obj.msg = "비밀번호가 올바르지 않습니다.";
					obj.loc = "/gbook/li/"+page;
					res.send(util.alertLocation(obj));
				})();
			}
			break;
		default :
			res.redirect("/404.html");
			break;
	}
});

// File download Route
app.get("/download", (req, res) => {
	const downName = req.query.downName;	// 업로드 파일명 (예: desert.jpg)
	const fileName = path.join(__dirname, "/public/uploads/"+mt.getDir(req.query.fileName)+"/") + req.query.fileName; // 실제 저장된 파일명 (예: ts-00.jpg)
	res.download(fileName, downName);
});



// 방명록 Ajax로 구현
// 방명록을 Ajax 통신으로 데이터만 보내주는 방식
app.get("/gbook_ajax", (req, res) => {
	var loginId = req.session.userid;
	const title = "방명록 - Ajax";
	const css = "gbook_ajax";
	const js = "gbook_ajax"
	const vals = {title, css, js, loginId};
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
	if(req.file) {
		orifile = req.file.originalname;
		savefile = req.file.filename;
	}
	var result;

	const sql = "INSERT INTO gbook SET comment=?, wtime=?, writer=?, pw=?, orifile=?, savefile=?";
	const vals = [comment, util.dspDate(new Date()), writer, pw, orifile, savefile];
	(async () => {
		result = await sqlExec(sql, vals);
		if(result[0].affectedRows > 0) {
			if(req.fileValidateError === false) {
				res.send(util.alertLocation({
					msg: "허용되지 않는 파일형식 이므로 파일을 업로드 하지 않았습니다. 첨부파일을 제외한 내용은 저장되었습니다.",
					loc: "/gbook"
				}));
			}
			else res.redirect("/gbook");
		}
		else res.redirect("/500.html");
	})();
});



/* 회원가입 및 로그인 등 */

/* 회원 라우터 */
app.get("/mem/:type", memEdit); // 회원가입, 아이디찾기, 리스트, 정보, 로그인
app.post("/api-mem/:type", memApi);	// 회원가입시 각종 Ajax
app.post("/mem/join", memJoin);	// 회원가입저장
app.post("/mem/login", memLogin);	// 회원 로그인 모듈




/* 함수구현 - GET */
function memEdit(req, res) {
	const type = req.params.type;
	const vals = {css: "mem", js: "mem"};
	switch(type) {
		case "join":
			vals.title = "회원가입";
			vals.tel = util.telNum;
			res.render("mem_in", vals);
			break;
		case "login":
			vals.title = "회원 로그인";
			res.render("mem_login", vals);
			break;
	}
}

/* 함수구현 - POST */
function memApi(req, res) {
	const type = req.params.type;
	var sql = "";
	var sqlVals = [];
	var result;
	switch(type) {
		case "userid":
			const userid = req.body.userid;
			(async () => {
				sql = "SELECT count(id) FROM member WHERE userid=?";
				sqlVals.push(userid);
				result = await sqlExec(sql, sqlVals);
				if(result[0][0]["count(id)"] > 0) res.json({chk: false});
				else res.json({chk: true});
			})();
			break;
	}
}

// 회원가입저장
function memJoin(req, res) {
	const vals = [];
	var userpw = crypto.createHash("sha512").update(req.body.userpw + salt).digest("base64");
	vals.push(req.body.userid);
	vals.push(userpw);
	vals.push(req.body.username);
	vals.push(req.body.tel1 + "-" + req.body.tel2 + "-" + req.body.tel3);
	vals.push(req.body.post);
	vals.push(req.body.addr1 + req.body.addr2);
	vals.push(req.body.addr3);
	vals.push(new Date());
	vals.push(2);
	var sql = "";
	var result = {};
	
	(async () => {
		sql = "INSERT INTO member SET userid=?, userpw=?, username=?, tel=?, post=?, addr1=?, addr2=?, wtime=?, grade=?";
		result = await sqlExec(sql, vals);
		res.send(result);
	})();
}

/* 로그인 처리 모듈 */
function memLogin(req, res) {
	var userid = req.body.loginid;
	var userpw = req.body.loginpw;
	var result;
	var sql = "";
	var vals = [];
	userpw = crypto.createHash("sha512").update(userpw + salt).digest("base64");
	(async () => {
		sql = "SELECT count(id) FROM member WHERE userid=? AND userpw=?";
		vals.push(userid);
		vals.push(userpw);
		result = await sqlExec(sql, vals);
		if(result[0][0]["count(id)"] == 1) {
			req.session.userid = userid;
			res.redirect("/");
		}
		else {
			req.session.destroy();
			res.send(util.alertLocation({
				msg: "아이디와 패스워드가 틀렸습니다.",
				loc: "/mem/login"
			}));
		}
	})();
}