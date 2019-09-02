// const nameMaker = require('./modules/test');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require("./modules/mysql_conn");

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

app.post("/gbook_save", (req, res) => {
	var comment = req.body.comment;
	db.conn.getConnection((err, connect) => {
		if(err) res.send("DB접속 오류가 발생했습니다.");
		else {
			var sql = 'INSERT INTO gbook SET comment=?, wtime=?';
			var vals = [comment, ];
			connect.query(sql, vals, (err, result) => {
				if(err) res.send("데이터 저장에 실패했습니다.");
				else {

				}
			});
		}
	});
	res.send(comment);
});

app.get("/gbook/:page", (req, res) => {
	var page = req.params.page;
	res.send("현재 페이지는 "+page+"입니다.");
});