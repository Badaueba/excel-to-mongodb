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


var port = process.env.PORT || 8000;
app.use(express.static ( __dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5vl2l.mongodb.net/excel-uploader?retryWrites=true&w=majority`, {useNewUrlParser: true})
.then(() => {
    app.listen(port);
    console.log("listening", 8000);
})
.catch(err => {
    console.log(err);
})


app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, X-Access-Token, Origin, Accept');
    next();
});
app.get("/",(req, res) =>{
    res.send( path.join( __dirname + "/public/index.html"));
});


var mimetypeXls = "application/vnd.ms-excel";
var mimetypeXlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var mimetypeOctet = "application/octet-stream";

app.post("/files", upload.single('file'), (req, res) => {

    var path;
    if (req.file) path = req.file.path;
    else return res.send({success : false, message : 'no files was uploaded'});
    if (req.file.mimetype !== mimetypeXls && req.file.mimetype !== mimetypeXlsx && req.file.mimetype !== mimetypeOctet) {
        console.log(req.file);
        removeFile(path);
        return res.send({
           success : false,
           message : 'O arquivo enviado (' + req.file.originalname + ') não é uma planilha .xslx válida'
       });
    }

    parseXls(req, res);

});

const parseXls = async (req, res) => {
    console.log("parsing...");

    var sheetFromFile = xlsx.parse(req.file.path);
    var objects = [];
    console.log(sheetFromFile);
    var infoMatriz = sheetFromFile[0].data;

    console.log(infoMatriz);

    for (var linha = 0; linha < infoMatriz.length; linha ++) {
        var newObject = {};
        if (linha > 0){
            for (var coluna = 0; coluna < infoMatriz[0].length; coluna ++) {
                newObject[infoMatriz[0][coluna]] = infoMatriz[linha][coluna];
            }
            console.log(newObject)
            const contato = new Contatos({
                ...newObject
            });
            objects.push(contato);
        }

    }
    removeFile(req.file.path);
    console.log(objects);
    try {
        const contato = await Contatos.insertMany(objects)
        console.log(contato);
        res.send({
            success : true,
            message : "Arquivo Salvo."
        });
    }
    catch(err) {
        console.log(err);
        return res.send(err);
    }
}

const removeFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) console.log('Erro ao tentar exluir: \n' + err);
        else console.log('Arquivo deletado');
    });
}

app.get("/files", (req, res) => {
    Contatos.find( (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    })
});
