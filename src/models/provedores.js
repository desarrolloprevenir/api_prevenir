let mysql =require('mysql');
let config = require('../config');
let jwts = require('jsonwebtoken');
let vals = require('./valida');
let fs = require('fs');
let imgmodule = require('./imagenes')
let topic = require('./topics');


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let provedorModule = {};


// registra provedores en la base de datos
provedorModule.regProvedorFace = (prov, callback)=> {
if(connection)
{
  // console.log(provs);
var id = prov.cedula;
var nombre = prov.nombre;
var correo = prov.email;
var cod = prov.cod;
// console.log(cod);
var sql = 'INSERT INTO provedores(id_provedor,cod_ver,nombre,correo,members_id) values (?,?,?,?,?)';
connection.query(sql,[id,cod,nombre,correo,id],(err, row)=>{
if(err)
{
// console.log('no agregado ususario');
var error = {'mensaje':'error al agregar usuario', 'agregado':false};
connection.query('DELETE FROM members WHERE id = ?',[id],(err,res)=>{
callback(err,mensaje);
});
throw err
}
else
{
// console.log('Agregado el ususario');
var mensaje = {'mensaje':'usuario agregado con exito','existe':'false','id_usuario':id};
callback(null,mensaje);
}
});
}
};


//retorna una lista de provedores
provedorModule.darProvedor = (callback)=> {
if(connection)
{
var sql = 'SELECT * FROM provedores';
connection.query(sql,(err,row)=>{
if(err){throw err;}else{callback(null,row)}
});
}
};

//retorna a un provedor por su id

provedorModule.darProvedorid = (id,callback)=>{
  // console.log('hola buscando provedores');
var sql = 'SELECT provedores.* FROM provedores, members WHERE provedores.members_id = members.id AND members.id = ?;';
connection.query(sql,[id],(err,row)=>{
if(err){throw err}else{
// console.log(row);
//   console.log('respuesta A LA APP');
  callback(null,row)
}
});
};

//retorna a un provedor por su id

provedorModule.darPerProveid = (id,callback)=>{
  let vl = {};
var sql = 'SELECT * FROM provedores WHERE id_provedor = ?';
connection.query(sql,[id],(err,row)=>{
if(err){throw err}
else
{
//console.log(row);
// vl = row[0];
// topic.topicsProvedor(id,(err,rsp)=>{
  // console.log(row[0]);
  // vl.topics=rsp;
  // console.log(vl);
  callback(null,row)
// });
}
});
};

//registra un provedor en la base de datos
provedorModule.regProv = (prov, callback)=> {
var id = prov.id;
var nombre = prov.nombre;
var correo = prov.email;
var direccion = prov.direccion;
var tel = prov.tel;
var nit = prov.nit;
var cod = prov.cod;

var sql = 'INSERT INTO provedores(id_provedor,nit,nombre,cod_ver,correo,direccion,telefono,members_id) values (?,?,?,?,?,?,?,?)';
connection.query(sql,[id,nit,nombre,cod,correo,direccion,tel,id],(err, row)=>{
if(err)
{
//console.log('no agregado ususario');
var error = {'mensaje':'error al agregar usuario'};
connection.query('DELETE FROM members WHERE id = ?',[id],(err,res)=>{
callback(err,mensaje);
});
throw err
}
else
{
//console.log('Agregado el Provedor');
var mensaje = {'mensaje':'usuario agregado con exito','existe':false,'id_usuario':id};
callback(null,mensaje);
}
});
};




provedorModule.setProvedor = (prov,callback)=>{
if(connection)
{
  // console.log('/////////////************put Prov*********////////////');
  // console.log(prov);
var up = 'UPDATE provedores SET nit= ?, nombre= ?, direccion=?, telefono=?, whatsapp=?, link=?, video=?, descripcion=? WHERE id_provedor=?;';
connection.query(up,[prov.nit,prov.nombre,prov.direccion,prov.telefono,prov.whatsapp,prov.link,prov.video,prov.descripcion,prov.id],(err,res)=>{
if(err){throw err}
else
{
// console.log(res);
callback(null,{'update':true});
}
});
}
};





module.exports = provedorModule;
