var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var multer = require("multer");
var upload = multer({ dest : "uploads/"});
var fs = require('fs');
var xlsx = require('node-xlsx');

var path = require("path");
var app = express();
var mongoose = require('mongoose');
var Contatos = require('./models/contatos');

mongoose.connect('mongodb://localhost:27017/excel-uploader');

var port = process.env.PORT || 8000;
app.use(express.static ( __dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, X-Access-Token, Origin, Accept');
    next();
});
app.get("/", function (req, res) {
    res.send( path.join( __dirname + "/public/index.html"));
});

var mimetypeXls = "application/vnd.ms-excel";
var mimetypeXlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

app.post("/files", upload.single('file'), function (req, res){

    var path;
    if (req.file) path = req.file.path;
    else return res.send({success : false, message : 'no files was uploaded'});
    if (req.file.mimetype !== mimetypeXls && req.file.mimetype !== mimetypeXlsx) {

        removeFile(path);
        return res.send({
           success : false,
           message : 'O arquivo enviado (' + req.file.originalname + ') não é uma planilha .xslx válida'
       });
    }

    parseXls(req, res);

});

function parseXls (req, res) {
    console.log("parsing...");

    var sheetFromFile = xlsx.parse(req.file.path);
    var objects = [];
    console.log(sheetFromFile);
    var infoMatriz = sheetFromFile[0].data;
    for (var l = 0; l < infoMatriz.length; l ++) {
        var newObject = {};
        if (l > 0){
            for (var c = 0; c < infoMatriz[0].length; c ++) {
                newObject[infoMatriz[0][c]] = infoMatriz[l][c];
            }
            console.log('')
            console.log(newObject)
            console.log('')
            objects.push(newObject);
        }

    }

    console.log(objects);
    Contatos.create( objects, (err, result) => {
        if (err){
            console.log(err);
            return res.send(err);
        }
        console.log(result);
        res.send({
            success : true,
            message : "Arquivo Salvo."
        });
    });

    removeFile(req.file.path);
}

function removeFile (path) {
    fs.unlink(path, (err) => {
        if (err) console.log('Erro ao tentar exluir: \n' + err);
        else console.log('Arquivo deletado');
    });
}

app.get("/files", function (req, res){
    Contatos.find( (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    })
});

app.listen(port, function (){
    console.log("listening on: " + port);
})
