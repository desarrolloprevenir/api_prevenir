let mysql = require('mysql');
let config = require('../config');
let hora = require('./horario');
let csh = require('./con_ser_hor')
let consul = require('./consultorios')
let cate = require('./categoria')

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let sucurModule = {};

// Agrega sucursales a cada provedor en el sistema con su respectiva informacion.
    sucurModule.agregarSucursales = (sucrs,callback)=> {
      if(connection)
      {         var valida = 'SELECT * FROM members WHERE email = ?;';
      var sqlm = 'INSERT INTO members (email, admin, password,locked) VALUES ( ?, ?, ?,1)';
                  connection.query(valida,[sucrs.usuario],(err,resp)=>{
                    if(err){throw err}
                    else
                    {
                      if(JSON.stringify(resp)=='[]')
                      {
                          connection.query(sqlm,[sucrs.usuario, 'sucu', sucrs.pssw],(err,resp)=>{
                          if(err){throw err}
                          else
                          {
                            console.log(resp.insertId);
                            var idm = resp.insertId;
                            // console.log('SUCURSALES INFO COMPLETA')
                            // console.log(sucrs);
                            // console.log('////////////////////////----------');
                            var sql = 'INSERT INTO sucursales (nombre, direccion, telefono, id_municipio, id_provedor,members_id) VALUE (?, ?, ?, ?, ?,?);'
                            var p=0;
                            var ids=[];
                            connection.query(sql,[sucrs.nombre, sucrs.direccion, sucrs.telefono, sucrs.id_municipio, sucrs.id_provedor,idm],(err,res)=>{
                              if(err){
                                // console.log(idm);
                                var sqld = 'DELETE FROM members WHERE id = ?;'
                                connection.query(sqld,[idm],(err1,resp)=>{
                                  if(err1){throw err1}
                                  else{throw err}
                                })
                              }
                              else
                              {

                                sucrs.consultorios.unshift({id_sucursal:res.insertId});
                                sucrs.consultorios.id_provedor = sucrs.id_provedor;
                                console.log('ENVIO PARA AGREGAR CONSULTORIOS');
                                  consul.insertConsul1(sucrs.consultorios,(err,res)=>
                                  {
                                      console.log(res);
                                      callback(null,true);
                                  });

                              }
                            });

                          }
                        })
                      }
                      else
                      {
                        callback(306,false);
                      }
                    }
                  });
      // }
    }
     };

sucurModule.editarSucursal = (sucur,callback) =>  {
  if(connection)
  {
    var sql = 'UPDATE sucursales SET nombre = ?, direccion = ?, telefono = ? WHERE id_sucursales = ?;';
    connection.query(sql,[sucur.nombre, sucur.direccion, sucur.telefono, sucur.id_sucursal],(err,row)=>{
        if(err){throw err}
        else
        {
          callback(404,row.protocol41);
        }
    });
  }
};


sucurModule.eliminarSucursal = (id,callback)=>{
    if(connection)
    {
      var delEvs = 'DELETE s FROM events s JOIN ( SELECT id_eventos FROM events s2, consultorio c WHERE s2.id_consultorio = c.id_consultorio AND c.id_sucursales = ? ) ss;';
      var delEvsm = 'DELETE em FROM events_masc em JOIN ( SELECT id_eventos FROM events_masc em2, consultorio c WHERE em2.id_consultorio = c.id_consultorio AND c.id_sucursales = ? )s2 ;';
      var updConsul = 'UPDATE consultorio SET eliminado = 1 WHERE consultorio.id_sucursales = ?;';
      var updSucur = 'UPDATE sucursales SET eliminar = 1 WHERE id_sucursales = ?;';
      var updmemb = 'UPDATE members SET password = "DONPASS" WHERE members.id = (SELECT sucursales.members_id FROM sucursales WHERE sucursales.id_sucursales = ?);';
      var med = 'UPDATE provedores_has_medicos SET activo = "false" WHERE id_sucursales = ?;'
      connection.query(delEvs,id,(err,ev)=>{
        if(err){throw err}
        else
        {
          connection.query(delEvsm,id,(err,evm)=>{
            if(err){throw err}
            else
            {
              connection.query(updConsul,id,(err,evm)=>{
                  if(err){throw err}
                  else
                  {
                    connection.query(updSucur,id,(err,evm)=>{
                        if(err){throw err}
                        else
                        {
                            connection.query(updmemb,id,(err,resmem)=>{
                                if(err){throw err}
                                else
                                {
                                  connection.query(med,id,(err,resmem)=>{
                                    if(err){throw err}
                                    else
                                    {
                                      callback(null,true);
                                    }
                                  });

                                }
                            });
                        }
                    });
                  }
              });
            }
          });
        }
      });
    }
};


//------------------------------------------------------------------------------------
//                   METODOS DE BUSQUEDA DE sucursales
//  - por Provedor,
//  - Por id de SUCURSALES
//  - por servicio, provedor, municipio
//  - por id de Members
//____________________________________________________________________________________

//busca sucursales segun el id del provedor

sucurModule.verSucrxprovedor = (idp,callback)=>{
  if(connection)
  {
    var sql = 'SELECT sucursales.*, municipio.nombre as municipio FROM sucursales, municipio WHERE sucursales.id_municipio = municipio.id_municipio AND  sucursales.id_provedor = ? AND sucursales.eliminar = 0;;'
    connection.query(sql,idp,(err,res)=>{
      if(err){throw err}
      else
      {
        callback(null,res);
      }
    });
  }
};

sucurModule.verSucrId = (idp,callback)=>{
  if(connection)
  {
    var sql = 'SELECT sucursales.*, municipio.nombre as municipio FROM sucursales, municipio WHERE sucursales.id_municipio = municipio.id_municipio AND  sucursales.id_sucursales = ? AND sucursales.eliminar = 0;'
    connection.query(sql,idp,(err,res)=>{
      if(err){throw err}
      else
      {
        callback(null,res);
      }
    });
  }
};


//sucursales por servicio, provedor, municipio

sucurModule.sucurServMun = (ids, callback)=>
{
  if(connection)
  {
    var sql = 'SELECT sucursales.*, municipio.nombre as municipio FROM sucursales, consultorio, municipio WHERE consultorio.id_servicios = ? AND sucursales.id_provedor = ? AND sucursales.id_municipio = ? AND sucursales.id_municipio = municipio.id_municipio GROUP BY id_sucursales;';
    connection.query(sql,[ids.id_ser,ids.id_prov,ids.id_muni],(err,su)=>{
      if(err){throw err}
      else
          {
            // console.log('RESPUESTA DE LA CONASULTA A LA BD');
            // console.log(su);
            callback(null,su);
          }
    });
  }
}

//busqueda por id de Members
sucurModule.sucurIdMember = (idm,callback)=>
{
  if(connection)
  {
    var sql = 'SELECT sucursales.*, provedores.avatar from sucursales, provedores WHERE sucursales.id_provedor = provedores.id_provedor AND sucursales.members_id = ? AND sucursales.eliminar = 0;';
    connection.query(sql,[idm],(err,row)=>{
      if(err){throw err}
      else
      {
        callback(null,row);
      }
    });
  }

};

sucurModule.cambioLogin = (sucur,callback)=>{
  if(connection)
  {
    console.log(sucur);
    let selsql = 'SELECT members.password, provedores.id_provedor FROM members,provedores WHERE members.id = provedores.members_id AND members.email = ?;';
    let selsuc = 'SELECT sucursales.members_id from sucursales WHERE sucursales.id_sucursales = ? AND sucursales.id_provedor = ?;';
    let uptsuc = 'UPDATE members SET email = ?, password = ? WHERE (id = ?);'
    connection.query(selsql,[sucur.email],(err,resp)=>{
      if(err){throw err}
      else
      {
        if(JSON.stringify(resp)!='[]')
        {
        // console.log(resp[0].password);
        // console.log(sucur.passadmin);
        if(resp[0].password == sucur.passadmin)
        {
          console.log(resp);
          connection.query(selsuc,[sucur.id_sucur,resp[0].id_provedor],(err,resuc)=>{
            if(err){throw err}
            else
            {
              console.log('RESPUESTA DE SUCURSAL');
              console.log(resuc);
              connection.query(uptsuc,[sucur.usu,sucur.passnu,resuc[0].members_id],(err,respup)=>{
                if(err){throw err}
                else {
                  console.log(respup);
                  if(respup.affectedRows >= 1)
                  {
                    callback(202,{"mensaje":"usuario y contraseña cambiados con exito","resp":true})
                  }
                  else
                  {
                    callback(404,{"mensaje":"algo salio mal por favor intenta de nuevo","resp":false})
                  }
                }
              })
            }
          })
        }
        else {
          callback(404,{"mensaje":"correo o contrsaña incorrecta","resp":false})
        }
          }
          else {
            callback(404,{"mensaje":"correo o contrsaña incorrecta","resp":false})
          }
      }
    })
  }

};









module.exports = sucurModule;
