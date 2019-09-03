const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const db = require("./modules/mysql_conn");
const mysql = db.mysql;
const sqlPool = db.sqlPool;
const sqlErr = db.sqlErr;
const sqlExec = db.sqlExec;
const util = require("./modules/util");

app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
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
	const comment = req.body.comment;
	const sql = "INSERT INTO gbook SET comment=?, wtime=?";
	const vals = [comment, util.dspDate(new Date())];
	sqlExec(sql, vals).then((data) => {
		res.send(data);
	}).catch(sqlErr);
});