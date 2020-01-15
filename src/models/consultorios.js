let mysql = require('mysql');
let config = require('../config');
var forEach = require('async-foreach').forEach;
let hors = require('./horario');
let csh = require('./con_ser_hor');
let med = require('./medicos')

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let consulModule = {};



//INSERTA CONSULTORIOS A LA SUCURSAL CON SU RESPECTIVO MEDICO
consulModule.insertConsul = (consuls,callback)=>{
if(connection)
{
  console.log('CONSULS DENTRO DE AGREGAR CONSULTORIOS');
  console.log(consuls);
  var id_sucu = consuls.id_sucursal;
  console.log(cosuls.id_sucursal);
  var sql = 'INSERT INTO consultorio (nombre, extencion, medico_id, id_sucursales) VALUES (?, ?, ?, ?);';
  var p = 0;
  var ids=[];
  for (var i = 0; i < consuls.length; i++) {
    var consul = consuls[i];

    // console.log(consuls.length);
    console.log(id_sucu);
    connection.query(sql,[consul.nombre, consul.extencion, consul.medico_id, id_sucu],(err,res)=>{
      if(err){throw err}
      else
      {
        // console.log('HORARIOS');
          console.log(consul.horarios);
      }
    });
  }

}

};

consulModule.insertConsul1 = (consuls, callback) =>
{
  // console.log('DFGHJIOIHUGYFTDRTFGHJKHUGYFTRYGHUIJKHGYFT');
console.log('agregando consultorios');
console.log(consuls);
var id_sucur = consuls[0].id_sucursal;
consuls.shift(consuls);
console.log();
console.log('ID DE LA SUSRSAL');
console.log(id_sucur);
if(connection)
{
  var p = 0;
  var sch=[]
  // console.log('CONSULS DENTRO DE AGREGAR CONSULTORIOS');

  let medicos = [];
  var sql = 'INSERT INTO consultorio (nombre, extencion, medico_id, id_sucursales, id_servicios) VALUES (?, ?, ?, ?, ?);';
  var horarios = [];
  // console.log('AGREGANDO CONSULTORIO');

  forEach(consuls, function(consul, index, arr)
{
  console.log('dentro del for each');
  console.log(consul);
      return new Promise((res,rej)=>{
        connection.query(sql,[consul.nombre, consul.extension, consul.medico_id, id_sucur,consul.id_servicio ],(err,data) => {
          return (err) ? rej(err) :  res(data)
        })
        })
        .then((res,rej)=>{
              consul.horarios.id_consul = res.insertId;
              let id_prov = consul.id_provedor;
              let id_sucu = consuls.id_sucursal;
              medicos.push({id_sucursal:id_sucur,id_provedor:consul.id_provedor,id_consultorio:res.insertId,id_medico:consul.medico_id});
              // console.log('MEDICO');
              // console.log(medicos);
                // console.log('dentro del if de consultorios');
                // console.log('HORARIOS');
                // console.log(consul.horarios);
                // console.log('--------------------------------');
                hors.agregarHorario1(consul.horarios,(err,data1)=> {
                  // console.log('////////////////////////////////////////');
                  // console.log(data1);
                  // console.log('////////////////////////////////////////');
                    // console.log(index, '/ ', consuls.length-1);
                    if(index>=consuls.length-1)
                    {
                      console.log('FIN CONSULTORIOS');
                      // console.log(data1);
                        csh.agregaids(data1,(err,res)=>{
                          med.activaMedico(medicos,(err,resp)=>{
                            callback(null,true)
                            return data1
                          });

                          })
                      }
                });
              })
              // console.log('FUERA DE PROMESA');
});
// console.log('FUERA DEL FOR EACH');

}


};

consulModule.deleteConsultorio = (idc,callback)=>
{
  if(connection)
  {
    var selho = 'UPDATE consultorio SET eliminado = 1 WHERE id_consultorio = ?;'
    var med = 'UPDATE provedores_has_medicos SET activo = "false" WHERE id_consultorio = ? ;'
    connection.query(selho,[idc],(err,idshor)=>{
          if(err){throw err}
          else
          {

              connection.query(med,[idc],(err,med)=>{
                if(err){throw err}
                else
                {
                  // console.log(idshor);
                  callback(303,med.protocol41)
                }
              });

          }
    });
  }
}

consulModule.editarConsultorio = (consul,callback) => {
  if(connection)
  {
    var sql = 'UPDATE consultorio SET nombre = ?, extencion = ? WHERE id_consultorio = ?;';
    connection.query(sql,[consul.nombre,consul.extencion,consul.id_consultorio],(err,resp)=>{
        if(err){throw err}
        else
        {
          // console.log(resp.protocol41);
          callback(null,resp.protocol41);
        }
    });
  }
};


//------------------------------------------------------------------------------------
//                   METODOS DE BUSQUEDA DE CONSULTORIOS
//  - por SUCURSAl,
//  - por Sucursal y Servicio.
//____________________________________________________________________________________

consulModule.buscarConsulSuc = (ids, callback) =>
{
if(connection)
{
  var sql = "SELECT consultorio.*, CONCAT(medicos.nombres ,' ', medicos.apellidos) as medico, servicios.nombre as servicio FROM consultorio, medicos, servicios WHERE consultorio.medico_id = medicos.medico_id AND consultorio.id_servicios = servicios.id_servicios AND  id_sucursales = ? AND consultorio.eliminado = 0;"
  var suc = 'SELECT sucursales.*, municipio.nombre as municipio FROM sucursales, municipio WHERE sucursales.id_municipio = municipio.id_municipio AND id_sucursales = ?;'
  connection.query(suc,[ids],(err,res)=>{
    if(err){throw err}
    else
  {
    // console.log(res);
    connection.query(sql,[ids],(err,consuls)=>{
      if(err){throw err}
      else
      {
        // console.log(consuls);
        if(JSON.stringify(consuls)=='[]')
        {
          // console.log('vacio');
           callback(303,res[0]);
        }
              else
                {
                  // console.log('si ahy consultorios');
                         // console.log(consuls);
                    res = res[0];
                      // console.log(res);
                        // res.consultorio = consuls
                        // callbak(null,res);
                        forEach(consuls, function(consul, index, arr)
                        {
                          // console.log('Dentro del forEach');
                          // console.log(consuls.length);
                          // console.log(consul.id_consultorio);
                            hors.darHorarioCon(consul.id_consultorio,(err,hora)=>{
                              consul.horario = hora;
                              // console.log(consul);
                              if(index>=consuls.length-1)
                              {
                                res.consultorio = consuls;
                                // console.log('RESPUESTA ES');
                                // console.log(res);
                                callback(null,res);
                              }
                            })
                          })
              }

      }
    });
  }
  })
}
}

consulModule.getConsultorioSucSer = (ids,callback) =>
{
  if(connection)
  {
    // console.log(ids);
    var sql = 'SELECT consultorio.*, CONCAT(medicos.nombres," ",medicos.apellidos) as medico FROM consultorio, sucursales, servicios, medicos WHERE consultorio.id_sucursales = sucursales.id_sucursales AND consultorio.id_servicios = servicios.id_servicios AND sucursales.id_sucursales = ? AND servicios.id_servicios = ? AND consultorio.medico_id = medicos.medico_id AND consultorio.eliminado = 0;';
    connection.query(sql,[ids.idsu, ids.idser],(err,row)=>{
      if(err){throw err}
      else {
        // console.log(row);
        callback(null,row)
      };
    })
  }
}

consulModule.getConsultorioIdc = (id,callback) =>
{
  if(connection)
  {
    var sql = 'SELECT consultorio.*, CONCAT(medicos.nombres ," ", medicos.apellidos) as medico, servicios.nombre as servicio FROM consultorio, medicos, servicios WHERE consultorio.medico_id = medicos.medico_id AND consultorio.id_servicios = servicios.id_servicios AND  consultorio.id_consultorio = ? AND consultorio.eliminado = 0; '
    connection.query(sql,[id],(err,consuls)=>{
      if(err){throw err}
      else
      {
        console.log(consuls);
        // res = res[0];
        // console.log(res);
        // res.consultorio = consuls
        // callbak(null,res);
        forEach(consuls, function(consul, index, arr)
      {
          // console.log(consul);
          hors.darHorarioCon(id,(err,hora)=>{
              consul.horario = hora;
              console.log(consul);
              if(index>=consuls.length-1)
              {
                // res.consultorio = consuls;
                callback(null,consuls);
              }
          })
      })


      }
    });


  }
}


module.exports = consulModule;
