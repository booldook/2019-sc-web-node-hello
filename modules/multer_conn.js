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

// multer를 이용해 파일을 서버에 저장할 때 경로 및 파일명을 처리하는 모듈
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads/sample'));
  },
  filename: (req, file, cb) => {
		var newFile = splitName(file.originalname);
    cb(null, newFile.saveName);
  }
});

// storage 객체를 이용해 multer를 초기화(생성) 한다.
const upload = multer({ storage: storage });

module.exports = {
	splitName,
	upload,
	multer
}