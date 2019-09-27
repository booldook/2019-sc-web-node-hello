const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const util = require("./modules/util");

app.listen(3000, () => {
	console.log("http://127.0.0.1:3000");
});