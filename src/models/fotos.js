let mysql = require('mysql');
let config = require('../config');
let fs = require('fs');
let imgmodule = require('./imagenes')
var rn = require('random-number');
var ba64 = require("ba64");
var regH = require("./horario");
var diasH = require("./dias");
var hora = require('./horario');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let fotoModel = {};



fotoModel.setFotoUsu = (foto,callback)=>{

let img = foto.fotos;
let id = foto.id;
var options = {
min:  000000001
, max:  9999999999
, integer: true
}
var rand = rn(options);
var rand1 = rn(options);
var rand2 = rn(options);
var rand3 = rn(options);
var name = rand1+'_'+rand2+'_'+rand3;
// var fotos = img[0];
fotos = img;
////console.log(.log(img);
var newPath = "src/public/avatars/"+name;
var pathView = "http://cdn.prevenirexpress.com:3000/avatars/"+name;
ba64.writeImageSync(newPath, fotos);
if(!fs.existsSync(newPath))
{
var sql = 'UPDATE usuarios SET avatar= ? WHERE id=?;'
connection.query(sql,[pathView+'.jpeg',id],(err,row)=>{
if(err){throw err}
else {
callback(null,[{'cambio':true}]);
}
});
}
};

fotoModel.setFotoMasc = (foto,callback)=>{

let img = foto.fotos;
let id = foto.id;
var options = {
min:  000000001
, max:  9999999999
, integer: true
}
var rand = rn(options);
var rand1 = rn(options);
var rand2 = rn(options);
var rand3 = rn(options);
var name = rand1+'_'+rand2+'_'+rand3;
// var fotos = img[0];
fotos = img;
////console.log(.log(img);
var newPath = "src/public/avatars/"+name;
var pathView = "http://cdn.prevenirexpress.com:3000/avatars/"+name;
ba64.writeImageSync(newPath, fotos);
if(!fs.existsSync(newPath))
{
var sql = 'UPDATE mascotas SET avatar= ? WHERE id_mascotas=?;'
connection.query(sql,[pathView+'.jpeg',id],(err,row)=>{
if(err){callback(300,err)}
else {
callback(null,true);
}
});
}
};


fotoModel.setFotoProv = (foto,callback)=>{
  let img = foto.fotos;
  let id = foto.id;
  var options = {
  min:  000000001
  , max:  9999999999
  , integer: true
  }
  var rand = rn(options);
  var rand1 = rn(options);
  var rand2 = rn(options);
  var rand3 = rn(options);
  var name = rand1+'_'+rand2+'_'+rand3;
  // var fotos = img[0];
  fotos = img;
  ////console.log(.log(img);
  var newPath = "src/public/avatars/"+name;
  var pathView = "/avatars/"+name;
  ba64.writeImageSync(newPath, fotos);
  if(!fs.existsSync(newPath))
  {
  var sql = 'UPDATE provedores SET avatar= ? WHERE id_provedor=?;'
  connection.query(sql,[pathView+'.jpeg',id],(err,row)=>{
  if(err){throw err}
  else {
  callback(null,[{'cambio':true}]);
  }
  });
  }
};

fotoModel.fotosSer = (foto,callback) =>{

  var respons = [];
  // //console.log(.log('/////*************///////////********antes de insertar**********//////////////****');
  // //console.log(.log(foto);
  var sqls = 'INSERT INTO fotos (nombre, ruta,servicios_idservicios) VALUES (?,?,?)';
  connection.query(sqls,[foto.nombre,foto.pathV+'.jpeg',foto.id],(err,res)=> {
  if(err)
  {
  //throw err
  throw err;
  respons=({"name": res.insertId, "carga":false});
  }
  else
  {
  respons=({"name": res.insertId, "carga": true});
  callback(null,respons);
  }
  });

};

fotoModel.fotoPagina = (fotos,callback) => {
  if(connection)
  {
    let p =0;
    let res = [];
    if(fotos.length >=1)
    {
        for (var i = 0; i < fotos.length; i++) {
          let foto = fotos[i];
          var options = {
          min:  000000001
          , max:  9999999999
          , integer: true
          }
          var rand = rn(options);
          var rand1 = rn(options);
          var rand2 = rn(options);
          var rand3 = rn(options);
          var name = rand1+'_'+rand2+'_'+rand3;

          var newPath = "src/public/fotos/"+name;
          var pathView = "/fotos/"+name;
          console.log(foto.categ);
          ba64.writeImageSync(newPath, foto.foto);
          console.log('cargada fotos');
          if(!fs.existsSync(newPath))
          {
          var sql = 'INSERT INTO `prevenirexpres`.`fotosp` (ruta, dominio, foto_cate_id_fotoc) VALUES (?, ?, ?);'
          connection.query(sql,[pathView+'.jpeg',foto.dominio,foto.categ],(err,row)=>{
          if(err){throw err}
          else {
            p++;
            console.log(p,'7',i);
              res.push({'agregada':true, 'id': row.insertId});
          if(p>=i)
              {
                callback(null,res);
              }

          }
          });
          }

        }

    }
  }

};


fotoModel.darFotosServ = (id,callback)=>{
  if(connection)
  {
    let sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
    connection.query(sql,[id],(err,row)=>{
      if(err){throw err}
      else
      {
        //console.log(.log(row);
        callback(null,row);
      }
    });
  }
};

fotoModel.delFotoServm = (ser,callback)=>{
  if(connection)
  {
    //console.log(.log(ser);
    let sel = 'select fotos.ruta as ruta from fotos WHERE id = ?;';
    connection.query(sel,[ser.id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
      //console.log(.log(row);
      row = row[0];
      ser.ruta = row.ruta;
      // //console.log(.log(ser.ruta);
      // //console.log(.log('public'+ser.ruta);
      fs.exists('src/public'+ser.ruta,(exist)=>{
        if(exist){//console.log(.log('si existe');
        fs.unlink('src/public'+ser.ruta,(err)=>{
          if(err){throw err}
          else
          {
            //console.log(.log('foto eliminada');
            let sql = 'DELETE FROM fotos where id = ?';
            connection.query(sql,[ser.id],(err,resp)=>{if(err){throw err}
          else
        {
          console.log(resp);
          callback(null,true);
        }});
          }
        });
          }
          else
          {
            console.log('no existe');
            callback(null,false)
          }
      });
    }
    });

  }
};

fotoModel.insertFotoSer = (fotos,callback)=>{
  //console.log(.log(fotos.ids);
  let ids = fotos.ids;
  let respons = [];
  let fotoss = fotos.fotos;
  let p = 1;
let foto = [];
  for (var i = 0; i < fotoss.length; i++) {
foto = fotoss[i];
  let img = foto.base64Image;
  //let id = foto.id;
  var options = {
  min:  000000001
  , max:  9999999999
  , integer: true
  }
  var rand = rn(options);
  var rand1 = rn(options);
  var rand2 = rn(options);
  var rand3 = rn(options);
  var name = rand1+'_'+rand2+'_'+rand3;
  // var fotos = img[0];
  fotos = img;
  ////console.log(.log(img);
  var newPath = "src/public/servicios/"+name;
  var pathView = "/servicios/"+name;
  ba64.writeImageSync(newPath, fotos);
  if(!fs.existsSync(newPath+'jpeg'))
  {
    var sqls = 'INSERT INTO fotos (nombre,ruta,servicios_idservicios) VALUES (?,?,?)';
    connection.query(sqls,[name,pathView+'.jpeg',ids],(err,res)=> {
    if(err)
    {
  //   //throw err
    throw err;
    respons=({"name": res.insertId, "carga":false});
    if(fotoss.length==i)
    {
      callback(null,respons);
    }
    p++;
    }
    else
    {
     respons.push({"name": res.insertId, "carga": true});
     // //console.log(.log('p '+p);
     // //console.log(.log('l '+fotoss.length);
     if(fotoss.length==p)
     {
       callback(null,true);
     }
     p++;
    }
    });

  }
}

};

fotoModel.verFotosF = (callback) => {
  if(connection)
  {
    var sql = 'SELECT fotosp.*, foto_cate.value FROM fotosp, foto_cate WHERE foto_cate.id_fotoc = fotosp.foto_cate_id_fotoc;';
    connection.query(sql,(err,rfoto)=>{
      if(err){throw err}
      else {
        callback(null,rfoto);
      }
    });
  }
};


fotoModel.setFotoMed = (foto,callback)=>{

let img = foto.fotos;
let id = foto.id;
var options = {
min:  000000001
, max:  9999999999
, integer: true
}
var rand = rn(options);
var rand1 = rn(options);
var rand2 = rn(options);
var rand3 = rn(options);
var name = rand1+'_'+rand2+'_'+rand3;
// var fotos = img[0];
fotos = img;
////console.log(.log(img);
var newPath = "src/public/avatars/"+name;
var pathView = "http://cdn.prevenirexpress.com:3000/avatars/"+name;
ba64.writeImageSync(newPath, fotos);
if(!fs.existsSync(newPath))
{
var sql = 'UPDATE medicos SET avatar= ? WHERE medico_id = ?;'
connection.query(sql,[pathView+'.jpeg',id],(err,row)=>{
if(err){throw err}
else {
callback(null,[{'cambio':true}]);
}
});
}
};





module.exports = fotoModel;
