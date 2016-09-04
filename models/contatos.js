var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContatoSchema = new Schema({
    nome : {type : String, required : true},
    e_mail : {type : String, required : true},
    telefone : {type : String},
    categoria : {type : String, required : true},
    createdAt : { type : Date, default : Date.now}
});

module.exports = mongoose.model('contato', ContatoSchema)
