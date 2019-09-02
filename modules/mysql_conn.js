const mysql = require("mysql");	// npm i -S mysql로 설치한 모듈 불러오기
const conn = mysql.createPool({
	host: "127.0.0.1",
	user: "booldook",
	password: "000000",
	port: 3306,
	database: "booldook",
	connectionLimit: 10
});

module.exports = {
	mysql,
	conn
}