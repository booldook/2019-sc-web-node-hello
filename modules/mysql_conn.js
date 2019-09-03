// const mysql = require("mysql");	// npm i -S mysql로 설치한 모듈 불러오기
const mysql = require("mysql2/promise");	// npm i -S mysql2로 설치한 모듈 불러오기
const sqlPool = mysql.createPool({
	host: "127.0.0.1",
	user: "booldook",
	password: "000000",
	port: 3306,
	database: "booldook",
	waitForConnections : true,
	queueLimit: 0,
	connectionLimit: 10
});
const sqlErr = err => {
	console.log(err);
}
const sqlExec = async (sql, vals) => {
	const connect = await sqlPool.getConnection(async a => a);
	const data = await connect.query(sql, vals);
	connect.release();
	return data;
}

module.exports = {mysql, sqlPool, sqlErr, sqlExec}