var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({extended : false});
var morgan = require("morgan");
var multer = require("multer");
var upload = multer({ dest : "uploads/"});
var excelParser = require("excel-parser");
var path = require("path");
var app = express();
var port = process.env.PORT || 8000;
app.use(express.static ( __dirname + "/public"));
app.use(morgan("dev"));
app.get("/", function (req, res) {
    res.send( path.join( __dirname + "/public/index.html"));
})
