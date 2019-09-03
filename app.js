// const nameMaker = require('./modules/test');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const db = require("./modules/mysql_conn");
const conn = db.conn;
const mysql = db.mysql;
const util = require("./modules/util");

app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
	/*
	console.log(nameMaker.firstName);
	console.log(nameMaker.lastName);
	console.log(nameMaker.fullName());
	*/
});

// Router(길잡이)
app.use(bodyParser.urlencoded({extended: true}));
app.use("/", express.static("./public"));

app.get("/hello", (req, res) => {
	var id = req.query.userid;	//http://127.0.0.1:3000/hello?userid=booldook
	var style = ` style="text-align:center; color: blue; padding: 3rem"`;
	var html = `<h1 ${style}>${id} 님 반갑습니다.</h1>`;
	res.send(html);
});

/*
app.post("/gbook_save", (req, res) => {
	var comment = req.body.comment;
	db.conn.getConnection((err, connect) => {
		if(err) res.send("DB접속 오류가 발생했습니다.");
		else {
			var sql = 'INSERT INTO gbook SET comment=?, wtime=?';
			var vals = [comment, util.dspDate(new Date())];
			connect.query(sql, vals, (err, result) => {
				connect.release();
				if(err) res.send("데이터 저장에 실패했습니다.");
				else {
					res.send("데이터가 처리되었습니다.");
				}
			});
		}
	});
});
*/
// async/await 패턴
async function getData(sql, vals) {
	return await conn.query(sql, vals);ㅐ
}
function err(err) {
	console.log(err);
}

app.post("/gbook_save", (req, res) => {
	var comment = req.body.comment;
	var sql = "INSERT INTO gbook SET comment=?, wtime=?";
	var vals = [comment, util.dspDate(new Date())];
	var cb = function(data) {
		console.log(data);
		res.send("저장되었습니다.");
	}
	getData(sql, vals).then(cb).catch(err);
});

app.get("/gbook/:page", (req, res) => {
	var page = req.params.page;
	res.send("현재 페이지는 "+page+"입니다.");
});