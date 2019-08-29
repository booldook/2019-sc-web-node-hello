const express = require('express');
const app = express();

app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
});

app.use("/", express.static("./public"));

app.get("/hello", (req, res) => {
	var id = req.query.userid;	//http://127.0.0.1:3000/hello?userid=booldook
	var style = ` style="text-align:center; color: red; padding: 3rem"`;
	var html = `<h1 ${style}>${id} 님 반갑습니다.</h1>`;
	res.send(html);
});