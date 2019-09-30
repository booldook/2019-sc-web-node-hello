const multer = require("multer");
//File System(fs): node.js가 가지고 있으며, 폴더와 파일을 컨트롤 한다.
const fs = require("fs");
const path = require("path");

// 파일명을 문자열로 받아서 확장자 처리 및 새로운 파일명으로 변경 후 리턴
const splitName = (file) => {
	var arr = file.split(".");	// "a.b.jpg" -> ["a", "b", "jpg"]
	var obj = {};
	obj.time = Date.now();
	obj.ext = arr.pop();	// arr = ["a", "b"]
	obj.name = obj.time + "-" + Math.floor(Math.random() * 90 + 10);
	obj.saveName = obj.name + "." + obj.ext;
	return obj;
}

// 업로드 가능한 확장자
const imgExt = ["jpg", "jpeg", "png", "gif"];
const fileExt = ["hwp", "xls", "xlsx", "ppt", "pptx", "doc", "docx", "txt", "zip", "pdf"];
const chkExt = (req, file, cb) => {
	var ext = splitName(file.originalname).ext.toLowerCase();
	if(imgExt.indexOf(ext) > -1 || fileExt.indexOf(ext) > -1) cb(null, true);
	else {
		req.fileValidateError = "Y";
		cb(null, false);
	}
}
// 저장될 폴더를 생성
const getPath = () => {
	var dir = makePath();	// dir: 1909
	var newPath = path.join(__dirname, "../public/uploads/"+dir);
	if(!fs.existsSync(newPath)) {
		fs.mkdir(newPath, (err) => {
			if(err) new Error("폴더를 생성할 수 없습니다.");
		});
	}
	return newPath;
}
const makePath = () => {
	const d = new Date();	//2019-09-30 16:29:22 GMT(...)
	var year = d.getFullYear() + "";
	var month;
	if(d.getMonth() + 1 < 10) month = "0"+ (d.getMonth() + 1);
	else month = "" + (d.getMonth() + 1);
	return year.substr(2) + month;
}

// multer를 이용해 파일을 서버에 저장할 때 경로 및 파일명을 처리하는 모듈
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// __dirname: modules의 절대경로(d:/임덕규/17.node-hello/modules)
		// 위의 절대경로에 상대경로를 붙인다.
		cb(null, getPath());	// /public/uploads/1909
	},
	filename: (req, file, cb) => {
		var newFile = splitName(file.originalname);
		cb(null, newFile.saveName);
	}
});

// storage 객체를 이용해 multer를 초기화(생성) 한다.
const upload = multer({ storage: storage, fileFilter: chkExt });

module.exports = {
	splitName,
	upload,
	multer,
	chkExt,
	imgExt,
	fileExt
}