const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const util = require("./modules/util");

// 서버실행
app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
});

// 초기설정
app.locals.prerry = true;
app.set("view engine", "ejs");
app.set("views", "./ejs");
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get(["/multer", "/multer/:type"], (req, res) => {
	var type = req.params.type;
	var vals = {};
	if(type === undefined) type = "in";
	switch(type) {
		case "in":
			vals.title = "파일 업로드 폼";
			vals.comment = "파일 업로드 폼 입니다.";
			res.render("multer_in", vals);
			break;
		default:
			res.send("/404.html");
			break;
	}
});