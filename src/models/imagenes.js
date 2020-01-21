const mysql = require('mysql');
let config = require('../config');
let jwts = require('jsonwebtoken');
let vals = require('./valida');
let fs = require('fs');
let ciclo = require('../controler/ciclos');

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let imgmodule = {};

//sube las imagenes al servidor
imgmodule.subida = (img,res) =>{
// console.log(img);
var name = img.path.split("\\").pop();
// console.log(name);
//var ext =;
var newPath = "src/public/servicios/"+name
fs.copyFile(img.path,newPath,(err)=>{
if(err)
{
throw err
}
else {
// console.log('renamed complete');
res.send('ok')
// console.log(img);
}
});
};

//sube las imagenes al servidor
imgmodule.subidas = (img,id, callback)=>{

var respons = [];
for (var l = 0; l < img.length; l++)
{
var foto = img[l];
var div = foto.name.split(".");
var name1 = div[0];
var name2 = div[1];
console.log(name1);
console.log(name2);
var name = name1+name2+foto.path.split("\\").pop();
console.log(name);
var newPath = "src/public/servicios/"+name;
var pathView = "/servicios/"+name;
fs.copyFileSync(foto.path,newPath);
if(!fs.existsSync(newPath+name))
{

respons.push({"name": name, "carga": "true"});
var sql = 'INSERT INTO fotos (nombre,ruta,servicios_idservicios) VALUES (?,?,?)';
connection.query(sql,[name,pathView,id],(err,res)=>{
if(err)
{
throw err
}
});
}
else
{
respons.push({"name": name, "carga": "false"});
}

}
callback(null,respons);

};

//retorna las imagenes por servicio del servidor
imgmodule.darImagenesServ = (row,callback)=>
{
if(connection)
{
// console.log('antes del ciclo');
for (var i = 0; i < row.length; i++)
{
// console.log('en el ciclo');
var serv = row[i];
var id = serv.idservicios;
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
connection.query(sql,[id],(err,resp)=>
{
// console.log(resp);
row.fotos = resp;

//codigo que crga la nueva consulta al json row
});
}
callback(null,row);

}
};

//busca una imagen por el id del servicio
imgmodule.buscarImagenes = (id,res)=>
{
var ids = id;
if(connection)
{
var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
connection.query(sql,[id],(err,row)=>{
if(err)
{

}
else
{
// console.log(res);
res.json(res);
}
});
}

};

module.exports = imgmodule;
