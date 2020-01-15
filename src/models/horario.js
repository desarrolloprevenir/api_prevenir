const mysql = require('mysql');
let config = require('../config');
let moment = require('moment');
let citas = require('./citas');
let dia = require('./dias');
var forEach = require('async-foreach').forEach;

connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let horarioModel = {};

//agrega el horario a la base de datos
horarioModel.agregarHorario = (horario,callback) =>
{
console.log('HORARIO SS');
console.log(horario);
var horas = horario;
var semana = horario.semana;
console.log(semana);
var dias={};
respId =[];
console.log(semana);
console.log('/////////*********Horario Recibido Prueba de nulls*********//////////////');
console.log(horario);
if(connection)
{
//console.log(horas.t_de+'/'+horas.m_de);
if(horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' )
{
// console.log('horarios de tarde indefinido');

var hsql = 'INSERT INTO horario (de_maniana,a_maniana) VALUES (?,?)';

connection.query(hsql,[horas.m_de,horas.m_hasta],(err,row)=>{
if(err)
{
throw err
}
else
{
// console.log('ROW DE AGREGADO');
// console.log(row);
var idH = row.insertId;
// respId.push(row.insertId);
dias={
semanas:semana,
id:idH,
};
// console.log('&%/%&/%&/UYFYUFUYFYUFUYFUYFYUFYUF%&$&$%&$%&$%&');
// console.log(horario);
res = {id_ser:horario.id_servicio,id_consul:horario.id_consul,id_hora:row.insertId};
respId.push(res);

// console.log(dias);
dia.agregarDia(dias,(err,respId)=>{
  // console.log(res);
callback(null,res);
});


}

});

}
else if (horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null')
{
//console.log(.log('horario de mañana indefinido');
var hsql = 'INSERT INTO horario (de_tarde,a_tarde) VALUES (?,?)';

connection.query(hsql,[horas.t_de,horas.t_hasta],(err,row)=>{
if(err)
{
throw err
}
else
{
//console.log(.log('/////////************Row*************////////////');
//console.log(.log(row);
var idH = row.insertId;
respId.push(row.insertId);
//console.log(.log('/////////************horas*************////////////');
//console.log(.log(horas);
dias={
semanas:semana,
id:idH,
};
res = {id_ser:horario.id_servicio,id_consul:horario.id_consul,id_hora:row.insertId};
respId.push(res);
//console.log(.log('/////////************Dias*************////////////');
//console.log(.log(dias);
dia.agregarDia(dias,(err,resp)=>{
callback(null,respId);
});
}
});
}
else
{
var hsql = 'INSERT INTO horario (de_maniana,a_maniana,de_tarde,a_tarde) VALUES (?,?,?,?)';

connection.query(hsql,[horas.m_de,horas.m_hasta,horas.t_de,horas.t_hasta],(err,row)=>{
if(err)
{
throw err
}
else
{

var idH = row.insertId;
// respId.push(row.insertId);
dias={
semanas:semana,
id:idH,
};
res = {id_ser:horario.id_servicio,id_consul:horario.id_consul,id_hora:row.insertId};
respId.push(res);
// //console.log(.log(dias);
dia.agregarDia(dias,(err,resp)=>{
callback(null,respId);
});


}

});
}


}
}

//agrega el horario a la base de datos
horarioModel.agregarHorario1 = (horarios,callback) =>
{
    // console.log('DENTRO DE AGREGAR HORARIOS');
    // console.log(horarios);
  var p = 0;
  var d = 0;
      forEach(horarios,(horario, index, arr)=>{
          // console.log('DENTRO DEL FOR EACH DE HORARIOS');
          // console.log('HORARIO');
          // console.log(horario);
          // console.log('longitud del for array');
          // console.log(horario.length);
          // console.log('------------ddddddd-----------------');
          var horas = horario;
          var semana = horario.semana;
          // console.log('SEMANA');
          // console.log(horario.semana);
          var dias={};
          respId =[];
          // console.log(semana);
          // console.log(horario);
          // console.log(horas.m_de,' PRUEBA ', horas.t_de);
          if ((horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null') && (horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' ))
          {
            // console.log('no existe horario');
            d++;
          }
            else if(horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' )
              {
                  // console.log('horarios de tarde indefinido');
                  var hsql = 'INSERT INTO horario (de_maniana,a_maniana) VALUES (?,?)';
                  connection.query(hsql,[horas.m_de,horas.m_hasta],(err,row)=>{
                    if(err){throw err}
                    else
                    {
                      // console.log('ROW DE AGREGADO');
                      // console.log(row);
                      var idH = row.insertId;
                      // respId.push(row.insertId);
                      dias={
                        semanas:semana,
                        id:idH,
                      };
                      // console.log('&%/%&/%&/UYFYUFUYFYUFUYFUYFYUFYUF%&$&$%&$%&$%&');
                      // console.log(horario);
                      resId = { id_ser: horario.id_servicio, id_consul:horarios.id_consul, id_hora:row.insertId };
                      respId.push(resId);
                      // console.log(dias);
                      return new Promise((res,rej)=>{
                        // console.log(dias);
                          dia.agregarDia(dias,(err,rspad)=>{
                              return(err) ? rej(err):res(resId);
                          })
                      })
                        .then((res,rej)=>{
                          p++;
                            // console.log('Despues de la promesa agregar dias');
                            // console.log(res);
                            // console.log(p, ' contra ', horarios.length);
                            if(p >= horarios.length-d)
                              {
                                // console.log('fin de agregado horarios');
                                // console.log(respId);
                                callback(null,respId);
                              }
                        })

                      }
                    });
              }
              else if (horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null')
              {
              // console.log('horario de mañana indefinido');
                var hsql = 'INSERT INTO horario (de_tarde,a_tarde) VALUES (?,?)';

                connection.query(hsql,[horas.t_de,horas.t_hasta],(err,row)=>{
                  if(err){throw err}
                  else
                  {

                    var idH = row.insertId;
                    // respId.push(row.insertId);
                    //console.log(.log('/////////************horas*************////////////');
                    //console.log(.log(horas);
                    dias={
                      semanas:semana,
                      id:idH,
                    };
                      resId = {id_ser:horario.id_servicio, id_consul:horarios.id_consul,id_hora:row.insertId};
                      respId.push(resId);
                      //console.log(.log('/////////************Dias*************////////////');
                      //console.log(.log(dias);
                      return new Promise((res,rej)=>{
                        // console.log(dias);
                          dia.agregarDia(dias,(err,rspad)=>{
                              return(err) ? rej(err):res(resId);
                          })
                      })
                        .then((res,rej)=>{
                          p++
                            // console.log('Despues de la promesa agregar dias');
                            // console.log(res);
                            // console.log(p, ' contra ', horarios.length);
                            if(p >= horarios.length-d)
                              {
                                // console.log('fin de agregado horarios');
                                // console.log(respId);
                                callback(null,respId);
                              }
                        })
                        // dia.agregarDia(dias,(err,resp)=>{
                        //   console.log(index, ' contra ', horarios.length);
                        //   if(index >= horarios.length)
                        //   {
                        //     console.log('fin de agregado horarios');
                        //   }
                        // });
                      }
                    });
              }
              else {

                var hsql = 'INSERT INTO horario (de_maniana,a_maniana,de_tarde,a_tarde) VALUES (?,?,?,?)';

                connection.query(hsql,[horas.m_de,horas.m_hasta,horas.t_de,horas.t_hasta],(err,row)=>{
                if(err)
                {
                throw err
                }
                else
                {

                var idH = row.insertId;
                // respId.push(row.insertId);
                dias={
                semanas:semana,
                id:idH,
                };
                resId = {id_ser:horario.id_servicio,id_consul:horarios.id_consul,id_hora:row.insertId};
                respId.push(resId);
                // //console.log(.log(dias);
                return new Promise((res,rej)=>{
                  // console.log(dias);
                    dia.agregarDia(dias,(err,rspad)=>{
                        return(err) ? rej(err):res(resId);
                    })
                })
                  .then((res,rej)=>{
                    p++;
                      // console.log('Despues de la promesa agregar dias');
                      // console.log(res);
                      // console.log(p, ' contra ', horarios.length);
                      if(p >= horarios.length-d)
                        {
                          // console.log('fin de agregado horarios');
                          // console.log(respId);
                            callback(null,respId);
                        }
                  });
                // dia.agregarDia(dias,(err,resp)=>{
                //   console.log(index, ' contra ', horarios.length);
                //   if(index >= horarios.length)
                //   {
                //     console.log('fin de agregado horarios');
                //   }
                // });
                }

                });

                }
      //FIN DEL FOREACH

      });
      // console.log('FUERA DEL forEach');


}

//agrega un horario a un consultorio en editar consultorios
horarioModel.agregar1Horario = (horario,callback) =>
{
    // console.log('DENTRO DE AGREGAR HORARIOS');
    console.log(horario);
    var p = 0;
    var d = 0;

          // console.log('DENTRO DEL FOR EACH DE HORARIOS');
          // console.log('HORARIO');
          // console.log(horario);
          // console.log('longitud del for array');
          // console.log(horario.length);
          // console.log('------------ddddddd-----------------');
          var horas = horario;
          var semana = horario.semana;
          // console.log('SEMANA');
          // console.log(horario.semana);
          var dias={};
          respId =[];
          // console.log(semana);
          // console.log(horario);
          // console.log(horas.m_de,' PRUEBA ', horas.t_de);
          if ((horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null') && (horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' ))
          {
            // console.log('no existe horario');
            d++;
          }
            else if(horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' )
              {
                  // console.log('horarios de tarde indefinido');
                  var hsql = 'INSERT INTO horario (de_maniana,a_maniana) VALUES (?,?)';
                  connection.query(hsql,[horas.m_de,horas.m_hasta],(err,row)=>{
                    if(err){throw err}
                    else
                    {
                      // console.log('ROW DE AGREGADO');
                      // console.log(row);
                      var idH = row.insertId;
                      // respId.push(row.insertId);
                      dias={
                        semanas:semana,
                        id:idH,
                      };
                      // console.log('&%/%&/%&/UYFYUFUYFYUFUYFUYFYUFYUF%&$&$%&$%&$%&');
                      // console.log(horario);
                      resId = { id_ser: horario.id_servicio, id_consul:horarios.id_consul, id_hora:row.insertId };
                      respId.push(resId);
                      // console.log(dias);
                      return new Promise((res,rej)=>{
                        // console.log(dias);
                          dia.agregarDia(dias,(err,rspad)=>{
                              return(err) ? rej(err):res(resId);
                          })
                      })
                        .then((res,rej)=>{
                            // console.log('Despues de la promesa agregar dias');
                            // console.log(res);
                            // console.log(p, ' contra ', horarios.length);
                                // console.log('fin de agregado horarios');
                                // console.log(respId);
                                callback(null,respId);
                        })

                      }
                    });
              }
              else if (horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null')
              {
              // console.log('horario de mañana indefinido');
                var hsql = 'INSERT INTO horario (de_tarde,a_tarde) VALUES (?,?)';

                connection.query(hsql,[horas.t_de,horas.t_hasta],(err,row)=>{
                  if(err){throw err}
                  else
                  {

                    var idH = row.insertId;
                    // respId.push(row.insertId);
                    //console.log(.log('/////////************horas*************////////////');
                    //console.log(.log(horas);
                    dias={
                      semanas:semana,
                      id:idH,
                    };
                      resId = {id_ser:horario.id_servicio, id_consul:horarios.id_consul,id_hora:row.insertId};
                      respId.push(resId);
                      //console.log(.log('/////////************Dias*************////////////');
                      //console.log(.log(dias);
                      return new Promise((res,rej)=>{
                        // console.log(dias);
                          dia.agregarDia(dias,(err,rspad)=>{
                              return(err) ? rej(err):res(resId);
                          })
                      })
                        .then((res,rej)=>{
                            // console.log('Despues de la promesa agregar dias');
                            // console.log(res);
                            // console.log(p, ' contra ', horarios.length);
                                // console.log('fin de agregado horarios');
                                // console.log(respId);
                                callback(null,respId);

                        })
                        // dia.agregarDia(dias,(err,resp)=>{
                        //   console.log(index, ' contra ', horarios.length);
                        //   if(index >= horarios.length)
                        //   {
                        //     console.log('fin de agregado horarios');
                        //   }
                        // });
                      }
                    });
              }
              else {

                var hsql = 'INSERT INTO horario (de_maniana,a_maniana,de_tarde,a_tarde) VALUES (?,?,?,?)';

                connection.query(hsql,[horas.m_de,horas.m_hasta,horas.t_de,horas.t_hasta],(err,row)=>{
                if(err)
                {
                throw err
                }
                else
                {

                var idH = row.insertId;
                // respId.push(row.insertId);
                dias={
                semanas:semana,
                id:idH,
                };
                resId = {id_ser:horario.id_servicio,id_consul:horarios.id_consul,id_hora:row.insertId};
                respId.push(resId);
                // //console.log(.log(dias);
                return new Promise((res,rej)=>{
                  // console.log(dias);
                    dia.agregarDia(dias,(err,rspad)=>{
                        return(err) ? rej(err):res(resId);
                    })
                })
                  .then((res,rej)=>{
                      // console.log('Despues de la promesa agregar dias');
                      // console.log(res);
                      // console.log(p, ' contra ', horarios.length);
                          // console.log('fin de agregado horarios');
                          // console.log(respId);
                            callback(null,respId);

                  });
                // dia.agregarDia(dias,(err,resp)=>{
                //   console.log(index, ' contra ', horarios.length);
                //   if(index >= horarios.length)
                //   {
                //     console.log('fin de agregado horarios');
                //   }
                // });
                }

                });

                }



}

// retorna los dias de la semana con su horario
horarioModel.darDiapr = (fecha,callback)=>{
var manana = [];
var tarde = [];
var derro = [];
var horaD = 0;
var hora = 0;
moment.locale('es');

var dia = moment(fecha.fecha).format('dddd');
// //console.log(.log(fecha.id);
//callback(null,dia);
if(connection)
{
var sql1 = 'select * from horario where id_servicios = ?';
connection.query(sql1,[fecha.id],(err,rows)=>{
//console.log(.log('/////////////////primera consulta*******************');
//console.log(.log(rows);
//console.log(.log('/////////////////primera consulta*******************');
});



var sql = 'SELECT dias.*, horario.* from dias,horario WHERE dias.id_horario = horario.id_horario and dias.dia = ? and  id_servicios = ? '
connection.query(sql,[dia,fecha.id],(err,row)=>{

// console.log(row);
if(err){throw err}
else
{
//console.log(dia);
if (JSON.stringify(row)=='[]') {
//execute
//  console.log('vacio');
callback(null,[{'maniana':[{"hora": "no ahy citas disponibles",'disponible':false},]},{'tardes':[{"hora": "no ahy citas disponibles",'disponible':false},]}]);
}
else
{    var hd = row[0];
// console.log(hd);

var m_de = fecha.fecha+" "+hd.de_maniana;
var m_hasta = fecha.fecha+" "+hd.a_maniana;
var t_de = fecha.fecha+" "+hd.de_tarde;
var t_hasta = fecha.fecha+" "+hd.a_tarde;
horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');

// console.log(horaD +" < "+ m_hasta);
// console.log(hd.a_maniana);
if(hd.a_maniana==null)
{
manana.hora = "no ahy citas disponibles";
manana.disponible = false;
var maniana = [];
// console.log('//////adentro mañana sin cita');
}
else
{
// console.log('//////adentro mañana con cita');
do {
hora = moment(horaD).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora});
horaD = moment(horaD).add(1,'hour');
//console.log(horaD);

} while (horaD.isBefore(m_hasta));
hora = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora,'disponible':true});
manana.id = parseInt(fecha.id);
citas.countCitas(manana,(err,maniana)=>{
derro.push({maniana});
// console.log('///////////////derrotero');
// console.log(derro);
});

hora=0;
}
if(hd.de_tarde==null)
{
var tardes = []
tarde.hora = "no ahy citas disponibles";
tarde.disponible = false;
// console.log('//////adentro tarde sin cita');
tardes.push({tarde});
derro.push({tardes});
// console.log(maniana);
// callback(null,);
}
else
{
// console.log('//////adentro tarde con cita');
do {
// console.log('////////////TARDE///////////')

hora = moment(horaT).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
horaT = moment(horaT).add(1,'hour');
// console.log(hora+"/"+horaT);
} while (horaT.isBefore(t_hasta));
hora = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
tarde.id = parseInt(fecha.id);
citas.countCitas(tarde,(err,tardes)=>{
derro.push({tardes});
callback(null,derro);
});
}

//console.log(m_de)

//callback(null,manana);
}
}
});
}

};

// da los dias con lo horarios y citas disponibles
horarioModel.darDia = (fecha,callback)=>{
var manana = [];
var tarde = [];
var derro = [];
var tardes = [];
var maniana = [];
var horaD = 0;
var hora = 0;
var cate = parseInt(fecha.cate);
moment.locale('es');

var dia = moment(fecha.fecha).format('dddd');
// console.log(dia);
// console.log(fecha.id);
//callback(null,dia);
if(connection)
{

  var sql1 = 'select * from horario where id_horario = (SELECT dias.id_horario FROM dias, horario, con_ser_hor WHERE  dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND dias.dia = ? group by dias.id_horario);';
// console.log(fecha.id);
connection.query(sql1,[fecha.id,dia],(err,rows)=>{
//   console.log(rows);
// console.log('/////////////////primera consulta*******************');
var row = rows;
// console.log(rows);
rows = rows[0];
// console.log(row.length);
// console.log(row);
// console.log('/////////////////primera consulta*******************');
//if cuando solo ahy citas para la mañana y la tarde esta vacia
if (JSON.stringify(row)=='[]')
{
//execute
// console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{


if((rows.de_maniana !=null && rows.de_tarde==null)|| (rows.de_maniana !='null' && rows.de_tarde=='null'))
{
// console.log('////////////////citas en la tarde vacias *******************');
var sql = 'SELECT dias.*, horario.id_horario,horario.de_maniana, horario.a_maniana,horario.id_servicios FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id,dia],(err,row)=>{

if(err){throw err}
else
{
  // console.log('/////////ROW DE CONSULTA EN LA MAÑANA//////');
  // console.log(row);
if (JSON.stringify(row)=='[]')
{
//execute
 // console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{
var tardes = [{"hora": "No ahy citas",'disponible':false,"echas":0}];
var hd = row[0];
// console.log(hd);
var m_de = fecha.fecha+" "+hd.de_maniana;
var m_hasta = fecha.fecha+" "+hd.a_maniana;
// var t_de = fecha.fecha+" "+hd.de_tarde;
// var t_hasta = fecha.fecha+" "+hd.a_tarde;
horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
// horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).add(1,'hour');
// t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
do {
hora = moment(horaD).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora});

horaD = moment(horaD).add(1,'hour');
//console.log(horaD);

} while (horaD.isBefore(m_hasta));
hora = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora,'disponible':true});
manana.id = parseInt(fecha.id);
manana.cate = cate;
// console.log('LOG CONTEO DE CITAS TARDE');
// console.log(maniana);
citas.countCitas(manana,(err,maniana)=>{
//tardes.push({tarde});
derro.push({maniana},{tardes});
// console.log(derro);
callback(null,derro);
});}}});

}
else if((rows.de_maniana ==null && rows.de_tarde!=null)|| (rows.de_maniana =='null' && rows.de_tarde!='null') )
{
// console.log('////////////////citas en la tarde llenas mañana vacias *******************');
var sql = 'SELECT dias.*, horario.id_horario,horario.de_tarde, horario.a_tarde,horario.id_servicios FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id,dia],(err,row)=>{
if(err){throw err}
else
{
// console.log(row);
if (JSON.stringify(row)=='[]') {
//execute
//  console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{
var hd = row[0];
// console.log(hd);
//var m_de = fecha.fecha+" "+hd.de_maniana;
//var m_hasta = fecha.fecha+" "+hd.a_maniana;
var t_de = fecha.fecha+" "+hd.de_tarde;
var t_hasta = fecha.fecha+" "+hd.a_tarde;
//horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
//m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).add(1,'hour');
var maniana = [{"hora": "No ahy citas",'disponible':false,"echas":0}];

do {
// console.log('////////////TARDE///////////')
hora = moment(horaT).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
horaT = moment(horaT).add(1,'hour');
// console.log(hora+"/"+horaT);
} while (horaT.isBefore(t_hasta));
// console.log('////////////*******dentro de la consulta////********');
hora = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
//maniana.push({mani});
tarde.id = parseInt(fecha.id);
tarde.cate = cate;
citas.countCitas(tarde,(err,tardes)=>{
derro.push({maniana},{tardes});
callback(null,derro);
});


}

}});

}
else if ((rows.de_maniana !=null && rows.de_tarde!=null) || (rows.de_maniana !='null' && rows.de_tarde!='null'))
{
  // console.log('////////////////dos horarios iguales *******************');
var sql = 'SELECT dias.*, horario.* FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id,dia],(err,row)=>{
if(err){throw err}
else
{
//console.log(dia);
if (JSON.stringify(row)=='[]') {
//execute
 // console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{
var hd = row[0];
// console.log(hd);
var m_de = fecha.fecha+" "+hd.de_maniana;
var m_hasta = fecha.fecha+" "+hd.a_maniana;
var t_de = fecha.fecha+" "+hd.de_tarde;
var t_hasta = fecha.fecha+" "+hd.a_tarde;
horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).add(1,'hour');
//m_hasta = moment(m_hasta).add(1,'hour');
do {
hora = moment(horaD).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora});
horaD = moment(horaD).add(1,'hour');
//console.log(horaD);

} while (horaD.isBefore(m_hasta));
hora = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora,'disponible':true});
manana.id = parseInt(fecha.id);
manana.cate = cate;
// console.log('MANIANA LOG COUNT DE CITAS ROW AL CONTADOR');
// console.log(maniana);
citas.countCitas(manana,(err,maniana)=>{
derro.push({maniana});
//console.log(derro[0]);
hora=0;
do {
// console.log('////////////TARDE///////////')
hora = moment(horaT).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
horaT = moment(horaT).add(1,'hour');
// console.log(hora+"/"+horaT);
} while (horaT.isBefore(t_hasta));
hora = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
tarde.id = parseInt(fecha.id);
tarde.cate = cate;
citas.countCitas(tarde,(err,tardes)=>{
derro.push({tardes});
callback(null,derro);
});
});
}
}});
}
}
});
}};

// retorna el horario del dia con sus citas
horarioModel.darDiaOc = (fecha,callback)=> {
var manana = [];
var tarde = [];
var derro = [];
var horaD = 0;
var hora = 0;
var cat = fecha.cat;
moment.locale('es');

var dia = moment(fecha.fecha).format('dddd');
// console.log(dia);
// console.log('//*/*/*/*/*/*/ DAR DIAS OC');
if(connection)
{
  var sql1 = 'select * from horario where id_horario = (SELECT dias.id_horario FROM dias, horario, con_ser_hor WHERE  dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND dias.dia = ? group by dias.id_horario);';
  connection.query(sql1,[fecha.id,dia],(err,rows)=>{
    if(err){throw err}
  // console.log('/////////////////primera consulta*******************');
  var row = rows;
  // console.log(rows);
  row = rows[0];

  // console.log('/////////////////primera consulta*******************');
  //if cuando solo ahy citas para la mañana y la tarde esta vacia
  if (JSON.stringify(row)=='[]')
  {
  //execute
   // console.log('vacio');
  callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
  }
  else
  {


if((rows.de_maniana !=null && rows.de_tarde==null)|| (rows.de_maniana !='null' && rows.de_tarde=='null'))
{
  // console.log('si ahy horario en la mañana');
// console.log('////////////////citas en la tarde vacias *******************');
var sql = 'SELECT dias.*, horario.id_horario,horario.de_maniana, horario.a_maniana,horario.id_servicios FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id, dia],(err,row)=>{
if(err){throw err}
else
{
if (JSON.stringify(row)=='[]') {
//execute
 // console.log('vacio del segundo if');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{
// console.log('dentro del segundo if');
var tardes = [{"hora": "No ahy citas",'disponible':false,"echas":0}];
var hd = row[0];
// console.log(hd);
var m_de = fecha.fecha+" "+hd.de_maniana;
var m_hasta = fecha.fecha+" "+hd.a_maniana;
// var t_de = fecha.fecha+" "+hd.de_tarde;
// var t_hasta = fecha.fecha+" "+hd.a_tarde;

horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
// horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
// m_hasta = moment(m_hasta).add(1,'hour');
// t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
do {
hora = moment(horaD).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora});

horaD = moment(horaD).add(1,'hour');
//console.log(horaD);

} while (horaD.isBefore(m_hasta));
hora = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora,'disponible':true});
// console.log('dentro de while**********////////////////////');
// console.log(manana);
manana.id = parseInt(fecha.id);
manana.cate = cat;
// console.log(manana);
citas.countCitasOc(manana,(err,maniana)=>{
//tardes.push({tarde});
derro.push({maniana},{tardes});
let pr =derro[0];
// console.log(pr.maniana);
callback(null,derro);
});}}});

}
else if((rows.de_maniana ==null && rows.de_tarde!=null)|| (rows.de_maniana =='null' && rows.de_tarde!='null'))
{
// console.log('////////////////si ahy horario en la tarde');
var sql = 'SELECT dias.*, horario.id_horario,horario.de_tarde, horario.a_tarde,horario.id_servicios FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id,dia],(err,row)=>{
if(err){throw err}
else
{
// console.log(row);
if (JSON.stringify(row)=='[]') {
//execute
//  console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy atencion en este horario",'disponible':false,"echas":0},]}]);
}
else
{
var hd = row[0];
// console.log(hd);
//var m_de = fecha.fecha+" "+hd.de_maniana;
//var m_hasta = fecha.fecha+" "+hd.a_maniana;
var t_de = fecha.fecha+" "+hd.de_tarde;
var t_hasta = fecha.fecha+" "+hd.a_tarde;
//horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
//m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
// m_hasta = moment(m_hasta).add(1,'hour');
var maniana = [{"hora": "No ahy citas",'disponible':false,"echas":0}];

do {
// console.log('////////////TARDE///////////')
hora = moment(horaT).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
horaT = moment(horaT).add(1,'hour');
// console.log(hora+"/"+horaT);
} while (horaT.isBefore(t_hasta));
// console.log('////////////*******dentro de la consulta////********');
hora = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
//maniana.push({mani});
tarde.id = parseInt(fecha.id);
tarde.cate = cat;
citas.countCitasOc(tarde,(err,tardes)=>{

derro.push({maniana},{tardes});
callback(null,derro);
});


}

}});

}
else if ((rows.de_maniana !=null && rows.de_tarde!=null) || (rows.de_maniana !='null' && rows.de_tarde!='null'))
{
// console.log('/////***** dos horarios');
var sql = 'SELECT dias.*, horario.* FROM dias, horario, con_ser_hor WHERE dias.id_horario = horario.id_horario AND horario.id_horario = con_ser_hor.id_horario AND con_ser_hor.id_consultorio = ? AND  dias.dia = ?;';
connection.query(sql,[fecha.id, dia],(err,row)=>{
if(err){throw err}
else
{
  // console.log('///////////////////************Horario ');
// console.log(dia);
// console.log(row);
if (JSON.stringify(row)=='[]') {
//execute
//  console.log('vacio');
callback(null,[{'maniana':[{"hora": "No ahy citas",'disponible':false,"echas":0},]},{'tardes':[{"hora": "No ahy citas",'disponible':false,"echas":0},]}]);
}
else
{
// console.log('///////////////////************row dentro del else ');
var hd = row[0];
// console.log(hd);
var m_de = fecha.fecha+" "+hd.de_maniana;
var m_hasta = fecha.fecha+" "+hd.a_maniana;
var t_de = fecha.fecha+" "+hd.de_tarde;
var t_hasta = fecha.fecha+" "+hd.a_tarde;
horaD = moment(m_de).format('YYYY-MM-DD HH:mm:ss');
horaT = moment(t_de).format('YYYY-MM-DD HH:mm:ss');
m_hasta = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
t_hasta = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
// m_hasta = moment(m_hasta).add(1,'hour');
// t_hasta = moment(t_hasta).add(1,'hour');
do {
hora = moment(horaD).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora});
horaD = moment(horaD).add(1,'hour');
//console.log(horaD);

} while (horaD.isBefore(m_hasta));
hora = moment(m_hasta).format('YYYY-MM-DD HH:mm:ss');
manana.push({hora,'disponible':true});
manana.id = parseInt(fecha.id);
manana.cate=cat;
// console.log('*/*/*/*/*/*/*/* vista de manana');
// console.log(manana);
citas.countCitasOc(manana,(err,maniana)=>{
derro.push({maniana});
// console.log(derro[0]);
do {
// console.log('////////////TARDE///////////')
hora = moment(horaT).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
horaT = moment(horaT).add(1,'hour');
// console.log(hora+"/"+horaT);
} while (horaT.isBefore(t_hasta));
hora = moment(t_hasta).format('YYYY-MM-DD HH:mm:ss');
tarde.push({hora});
tarde.id = parseInt(fecha.id);
tarde.cate = cat;
// console.log('*/*/*/*/*/*/*/* vista de tarde');
// console.log(tarde);
citas.countCitasOc(tarde,(err,tardes)=>{

derro.push({tardes});
callback(null,derro);
});});}}});}}});}};

//retorna un horario de una sed
horarioModel.darHorariosed = (id,callback)=>{
  let dias = [];
  let resp = [];
  let p =1;
  if(connection)
  {
    let horario = 'SELECT * FROM horario where  id_servicios = ?;';
    let dias = 'SELECT dias.dia FROM dias where  id_horario = ?;';
    connection.query(horario,[id],(err,row1)=>{
      if(err){throw err}
      else
      {
        // console.log(row1.length);
        if(row1.length>1)
        {
          let vars=[];
          let varia = [];

          for (var i = 0; i < row1.length; i++) {
            dia.darDiasEd(row1[i],(err,res)=>{
              resp.push(res);
              if(row1.length==p)
              {
                callback(null,resp);
              }
              p++
            });
          }
        }
        else
        {
        let id_horario = row1[0].id_horario;
        // console.log(id_horario);
        connection.query(dias,[id_horario],(err,row2)=>{
            if(err){throw err}
          else
          {
          row1[0].dias = row2;
          // console.log(row1);
          callback(null,row1)
          }
        });
        }
      }
    });
  }
};

//elimina un horario
horarioModel.eliminarHorario = (idh,callback)=>{
if(connection)
{
// var idH = 'SELECT id_horario FROM horario WHERE id_horario = ?';
var delD = 'DELETE FROM dias WHERE id_horario = ?;';
var delH = 'DELETE FROM horario WHERE id_horario = ?';
// connection.query(idH,[ids],(err,row)=>{
// if(err){throw err}
// else
// {
// var idHo = row[0];
// idHo = idHo.id_horario;
// console.log(idHo);

connection.query(delD,[ids],(err,resp)=>{
if(err){throw err}
else
{

connection.query(delH,[ids],(err,res)=>{
if(err){throw err}
else
{
// console.log('borrados');
callback(null,'ok');
}
});
}
});
// }
// });
}
};

//elimina un horario de la sede
horarioModel.eliminarHorarioEd = (idh,callback)=>
{
  if(connection)
  {
  var delD = 'DELETE FROM dias WHERE id_horario = ?;';
  var del2 = 'DELETE FROM con_ser_hor WHERE id_horario = ?';
  var delH = 'DELETE FROM horario WHERE id_horario = ?';
  // console.log(idHo);
  connection.query(delD,[idh],(err,resp)=>{
  if(err){throw err}
  else
  {
      connection.query(del2,[idh],(err,resp)=>{
            if(err){throw err}
            else
            {
              connection.query(delH,[idh],(err,res)=>{
              if(err){throw err}
              else
              {
              // console.log('borrados');
              callback(null,true);
              }
              });
            }
        });
  }
  });
  }
  };

//agrega el horario a la base de datos
horarioModel.agregarHorarioEd = (horario,callback) =>
{

  var horas = horario;
  var semana = horas.semana;
  var dias={};
  // console.log(horas);
  // console.log(semana);
  // console.log('/////////*********Horario Recibido Prueba de nulls*********//////////////');
  // console.log(horario);
  if(connection)
  {
  // console.log(horas.t_de+'/'+horas.m_de+'/'+horas.id);
  if((horas.t_de==undefined && horas.m_de==undefined ) || (horas.t_de=='undefined' && horas.m_de=='undefined')||(horas.t_de==null && horas.m_de==null ) || (horas.m_de=='null' && horas.t_de=='null' ))
  {
 // console.log('no ahy horario');
  }
  else if(horas.t_de==undefined || horas.t_de=='undefind' || horas.t_de==null || horas.t_de=='null' )
  {
  // console.log('horarios de tarde indefinido');

  var hsql = 'INSERT INTO horario (de_maniana,a_maniana,id_servicios) VALUES (?,?,?)';

  connection.query(hsql,[horas.m_de,horas.m_hasta,horas.id],(err,row)=>{
  if(err)
  {
  throw err
  }
  else
  {

  var idH = row.insertId;
  dias={
  semanas:semana,
  id:idH,
  ids:horas.id
  };
   // console.log(dias);
  dia.agregarDia(dias,(err,resp)=>{
  callback(null,resp);
  });


  }

  });

  }
  else if (horas.m_de==undefined || horas.m_de=='undefind' || horas.m_de==null || horas.m_de=='null')
  {
  // console.log('horario de mañana indefinido');
  var hsql = 'INSERT INTO horario (de_tarde,a_tarde,id_servicios) VALUES (?,?,?)';

  connection.query(hsql,[horas.t_de,horas.t_hasta,horas.id],(err,row)=>{
  if(err)
  {
  throw err
  }
  else
  {
  // console.log('/////////************Row*************////////////');
  // console.log(row);
  var idH = row.insertId;
  // console.log('/////////************horas*************////////////');
  // console.log(horas);
  dias={
  semanas:semana,
  id:idH,
  ids:horas.id
  };
  // console.log(dias);
  // console.log('/////////************Dias*************////////////');
  dia.agregarDia(dias,(err,resp)=>{
  callback(null,resp);
  });


  }

  });



  }
  else
  {
  var hsql = 'INSERT INTO horario (de_maniana,a_maniana,de_tarde,a_tarde,id_servicios) VALUES (?,?,?,?,?)';

  connection.query(hsql,[horas.m_de,horas.m_hasta,horas.t_de,horas.t_hasta,horas.id],(err,row)=>{
  if(err)
  {
  throw err
  }
  else
  {

  var idH = row.insertId;
  dias={
  semanas:semana,
  id:idH,
  ids:horas.id
  };
  // console.log(dias);
  dia.agregarDia(dias,(err,resp)=>{
  callback(null,resp);
  });


  }

  });
  }


  }
};

//devuelve el horario por el consultorio
horarioModel.darHorarioCon = (id,callback) =>
{
  if(connection)
  {
    var res = [];
    var hor = 'SELECT horario.* FROM horario, con_ser_hor WHERE con_ser_hor.id_horario = horario.id_horario AND con_ser_hor.id_consultorio = ?;';
    connection.query(hor,[id],(err,horarios)=>{
      if(err){throw err}
      else
      {
        console.log(horarios);
        if (JSON.stringify(horarios)!='[]')
        {
        forEach(horarios, function(horario, index, arr)
          {
            // console.log(horario);
            let idc = horario.id_horario;
            dia.darDiasEd(horario,(err,hor)=>{
              // console.log(hor);
              res.push(hor);
              if(index>=horarios.length-1)
              {
                callback(null,res);
              }
          });

        });
      }
      else {
        callback(null,false);
      }
      }
    });
  }
};

module.exports = horarioModel;
