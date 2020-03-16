const mysql = require('mysql');
const sms = require('./sms');
let config = require('../config');
let moment = require('moment');
let pushs = require('./push');
let pushos = require('./pushOs');
var sleep = require('system-sleep');
let ciclo = require('../controler/ciclos')
let email = require('./email');
var forEach = require('async-foreach').forEach;


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let ejectModel = {};

//retorna una lista de horarios libres para la citas medicas
ejectModel.darLibres = (serv,callback)=>
{
// console.log(serv);
if(connection)
{
var sql = ' SELECT servicios.max_citas_ves-count(events.id_eventos) as libres FROM servicios, consultorio, events WHERE consultorio.id_servicios = servicios.id_servicios AND events.id_consultorio = consultorio.id_consultorio AND events.start = ? AND consultorio.id_consultorio = ?;'
connection.query(sql,[serv.hora,serv.id],(err,res)=>{
res = res[0];
res=res.libres;
// console.log('///////////**RESPUESTA DE DAR LIBTRES**//////////');
// console.log(res);
serv.libres = res;
serv.disponible = true;
serv.hora = moment(serv.hora).format('hh:mm a');

// console.log(serv);
callback(null,serv);
});

}
};

// retorna las citas por servicio cuando ahy una cita separada
ejectModel.darCitasOc = (serv,callback)=>
{
//   console.log('************////////////////////');
// console.log(serv);
if(connection)
{
  if(serv.cate==20)
  {
    // console.log('Mascotas');
    var sql = "SELECT events_masc.*, events_masc.id_eventos,events_masc.id_mascotas as usuarios_id, events_masc.start, events_masc.end, consultorio.id_servicios as servicios_idservicios, mascotas.nombre as nombres FROM events_masc, consultorio, servicios, mascotas WHERE mascotas.id_mascotas = events_masc.id_mascotas AND events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events_masc.start = ? AND consultorio.id_consultorio = ?;"
  }
  else
  {
    // console.log('usuario');
    var sql = "SELECT events.* ,concat(usuarios.nombre,' ',usuarios.apellidos) as nombres FROM events, consultorio, servicios, usuarios WHERE events.usuarios_id = usuarios.id AND events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events.start = ? AND consultorio.id_consultorio = ?;"
  }

////console.lo.log(sql);
connection.query(sql,[serv.hora,serv.id],(err,res)=>{
//res;
//res=res.libres;
//console.log('///////////****//////////');
////console.lo.log(res);
if(serv.cate==20)
{
  // console.log('Contando mascotas');
  var sql1 = 'SELECT count(events_masc.id_eventos) as echas, servicios.max_citas_ves-count(events_masc.id_eventos) as libres FROM events_masc, consultorio, servicios WHERE events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events_masc.start = ? AND consultorio.id_consultorio = ?;';
}
else
{
var sql1 = 'SELECT count(events.id_eventos) as echas, servicios.max_citas_ves-count(events.id_eventos) as libres FROM events, consultorio, servicios WHERE events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events.start = ? AND consultorio.id_consultorio = ?;';
}
connection.query(sql1,[serv.hora,serv.id],(err,resp)=>{
  // console.log(resp);
resp = resp[0];
respu = resp.libres
// console.log('*-4+4**/*/*/*/*/*/*/*/*/* respuesta de conteo');
// console.log(resp);
// serv.echas = resp;
serv.citas = res;
if(respu<=0)
{
serv.disponible = false;
serv.echas =  resp.echas;

}
else
{
serv.disponible = true;
serv.echas =  resp.echas;
}
serv.hora = moment(serv.hora).format('hh:mm a');
////console.lo.log(serv);
callback(null,serv);
});
});

}
}

ejectModel.pruebas = (callback)=>{
var fecha1 = moment('1989-11-11'); //fecha de nacimiento
var fecha2 = moment('2018-11-12');  //fecha actual

//console.lo.log(fecha2.diff(fecha1, 'years.days'), ' años de diferencia');
};


ejectModel.eliminaNotifica = (env,callback) =>
{
  console.log(env);
  // sleep(5000);
  connection.query(env.sql,[env.id],(err,rowph)=>{
    if(err){throw err}
    else
    {
        console.log(rowph);
        // console.log('enviando e-mail');
        // console.log('/////////////////////*******************//////////////////');
        rowph = rowph[0];
        // console.log('cDN3ljN80nY:APA91bE23ly2oG-rzVAI8i_oiPMZI_CBdU59a6dVznyjdK9FyGi2oPI_sQIQJTAV-xp6YQ6F7MlYYW_7Br0nGdbTIuicwIP4oR99Mf8KysM1ZEJiCmASeyxnOHO4ajgqTDIX6prWpQpG');
        console.log('ROW DE LA BASE DE DATOS');
        console.log(rowph);
        console.log(rowph.tokenpsh);
        if(rowph.tokenpsh!='not')
        {
          var notification = {
              contents: {
                  en: "Your date",
                  es: 'Su cita de '+rowph.nombre+', separada para el dia: '+moment(rowph.start).format('DD-MM-YYYY')+' a las: '+moment(rowph.start).format('HH:mm a')+' fue cancelada por inconvenientes ajenos a nostros por favor revisa tus citas',
              },
              headings : { es: 'CITA CANCELADA', en: 'dont not'},
              include_player_ids: [rowph.tokenpsh]
          };

        // console.log(disp);
      pushos.sendPush(notification,(err,respus)=>{
        //
        // console.log(respus);
        // console.log('enviando respuesta');
        callback(null,{'borrado':true});
      });
            }
              else {
                callback(null,{'borrado':true});
              }
    }
  });
};


ejectModel.notificaCitaHumanos = (callback) =>{
if(connection)
{
    var disp = {};
  let hora = moment().add(3,'hours').format('YYYY-MM-DD HH:mm:ss');

  // let hora = '2018-11-19 16:00:00';
  // console.log('Inicio de notificaciones a los usuarios ////////////********************');
  // console.log(hora);
  var sele = 'SELECT events.usuarios_id, events.start, CONCAT(jhg.nombre," ",jhg.apellidos) as nombres,servicios.nombre, if(jhg.usuariosBf_id !="",(SELECT members.tokenpsh FROM usuarios as pr, usuarios as bf,members WHERE pr.id = bf.usuariosBf_id AND members.id = pr.members_id AND bf.id = jhg.id ), (SELECT members.tokenpsh FROM members,usuarios WHERE members.id = usuarios.id AND usuarios.id = jhg.id)) as tokenpsh  FROM events, usuarios as jhg, servicios, consultorio where jhg.id = events.usuarios_id AND events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND start = ?;';
  connection.query(sele,[hora],(err,row)=>{
    if(err){throw err}
    else
    {
      let p = 1;
      for (var i = 0; i < row.length; i++) {
        // console.log('eject de row');
      // console.log(row[i]);
      let rowps = row[i];
      if(rowps.tokenpsh!='not')
      {
        var notification = {
            contents: {
                en: "Your date",
                es: 'No olvide su cita de '+rowps.nombre+' para '+rowps.nombres+', separada para el dia: '+moment(rowps.start).format('DD-MM-YYYY')+' a las: '+moment(rowps.start).format('hh:mm a')+' por favor verifique su horario en la aplicacion y en caso de no asisitir comuniquese con el centro prestador del servicio',
            },
            headings : { es: 'RECORDATORIO DE CITA', en: 'dont not'},
            include_player_ids: [rowps.tokenpsh]
        };

        // console.log(disp);
        pushos.sendPush(notification,(err,respus)=>{
          // console.log(respus);
          // console.log('enviando respuesta');
        });

        }
          if(p>=row.length)
          {
            callback(null,{'notificado':true});
            // console.log(hora);
          }
          p++;
      }

    }
  });

}

};

ejectModel.notiCitasPeluditos = (callback)=> {
if(connection)
{
  let disp = {};

  let hora = moment().add(3,'hours').format('YYYY-MM-DD HH:mm:ss');

  // let hora = '2018-11-19 16:00:00';
  // console.log(hora);
  var sele ='SELECT events_masc.start, mascotas.nombre as peludito, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres ,servicios.nombre , members.tokenpsh FROM events_masc, mascotas, usuarios, members, servicios WHERE mascotas.id_mascotas = events_masc.id_mascotas AND mascotas.id_usuarios = usuarios.id AND usuarios.members_id = members.id AND servicios.id_servicios = events_masc.id_servicios AND events_masc.start = ?;';
  connection.query(sele,[hora],(err,row)=>{
    if(err){throw err}
    else
    {
      if(row.length>0)
      {
        let p = 1;
        for (var i = 0; i < row.length; i++)
        {
          let rowps = row[i];
          var notification = {
              contents: {
                  en: "Your date",
                  es: 'Señor@ '+rowps.nombres+' no olvide su cita de '+rowps.nombre+' a para su peludit@ '+rowps.peludito+', separada para el dia: '+moment(rowps.start).format('DD-MM-YYYY')+' a las: '+moment(rowps.start).format('hh:mm a')+' por favor verifique su horario en la aplicacion y en caso de no asisitir comuniquese con el centro prestador del servicio',
              },
              headings : { es: 'RECORDATORIO DE CITA', en: 'dont not'},
              include_player_ids: [rowps.tokenpsh]
          };

          pushos.sendPush(notification,(err,respus)=>{
            // console.log(respus);
            // console.log('enviando respuesta');
          });
        }
      }
      if(p>=row.length)
      {
        callback(null,{'notificado':true});
        // console.log(hora);
      }
      p++;
    }
  });

}

};

ejectModel.histrialBenf1 = (row,callback)=>{
  // console.log('ROW PARA OBTENER CITAS DE BENEFICIARIOS');
  // console.log(row);
  let pens = [];
  let p = 1;
  if(connection)
  {
    let sel = 'SELECT historial.*, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres, servicios.nombre as servicio FROM historial, usuarios, servicios WHERE usuarios.id = historial.usuarios_id AND servicios.id_servicios = historial.servicios_idservicios AND usuarios_id = ? ORDER BY historial.calificada asc, historial.start asc; ;';
    for (var i = 0; i < row.length; i++) {
      // console.log(row[i]);
      connection.query(sel,[row[i]],(err,resp)=>{
        // console.log('en historial ejecutando');
        // console.log(resp);
        for (var k = 0; k < resp.length; k++) {
          resp[k]
          pens.push(resp[k]);
          // console.log(p+'  '+row.length);
          if(p==row.length)
          {
            // console.log(pens);
            callback(null,pens);
          }
        }
    p++;

      });

    }
  }

};

ejectModel.histrialBenf = (row,callback)=>{
  // console.log('ROW PARA OBTENER CITAS DE BENEFICIARIOS');
  // console.log(row);
  let pens = [];
  let p = 1;
  if(connection)
  {
    let sel = 'SELECT historial.*, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombres, servicios.nombre as servicio, servicios.id_servicios, consultorio.id_consultorio, sucursales.nombre as sucursal, sucursales.direccion, sucursales.telefono, sucursales.id_sucursales, sucursales.id_municipio FROM historial, usuarios, consultorio, servicios, sucursales WHERE consultorio.id_sucursales = sucursales.id_sucursales AND historial.usuarios_id = usuarios.id AND historial.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND historial.usuarios_id = ? ORDER BY historial.calificada asc, historial.start asc;';
    forEach(row,(ids, index, arr)=>{

      connection.query(sel,[row[index]],(err,resp)=>{
        if(err){throw err}
        else
        {
          // console.log(resp);
              forEach(resp,(hist, index2, ar) =>{

                // console.log(hist);
                pens.push(hist);
              })
              // console.log(index,' contra ',row.length-1);
              if(index>=row.length-1)
              {
                // console.log('FINALIZA CONSULTA');
                callback(null,pens);
              }
              }
        })

      })

    }
  };




ejectModel.cambioSalt = (id,callback)=>{
  if(connection)
  {
    var sel = 'SELECT * FROM members WHERE id = ? ;';
    var upd = 'UPDATE members SET salt = ? WHERE (id = ?);';
    connection.query(sel,[id],(err,res)=>{
      if(err){throw err}
      else
      {
      res = res[0];
      ciclo.generaSalt((err,gen)=>{
        cod = gen;
      });
      var usu = {
        to:res.email,
        pss: cod,
        id:res.id
      };
      email.cuentaBlock (usu,(err,ressp)=>{
        connection.query(upd,[cod,res.id],(err,resp)=>{
          if(err){throw err}
          else
          {
            callback(null,true)
          }
        });
      });
      }
    });
  }
};

ejectModel.cambioContra = (id,callback)=>{
  if(connection)
  {
    var sel = 'SELECT members.*, usuarios.telefono FROM members, usuarios WHERE members.id = usuarios.members_id  AND email = ? ;';
    var upd = 'UPDATE members SET salt_contra = ? WHERE (id = ?);';
    connection.query(sel,[id],(err,res)=>{
      if(err){throw err}
      else
      {
      if (JSON.stringify(res)=='[]')
      {
          callback(null,false)
      }
      else
       {
      res = res[0];
      ciclo.generaSalt((err,gen)=>{
        cod = gen;
      });
      var usu = {
        to:res.email,
        pss: cod,
        id:res.id
      };
      let data = {
        nums:'57'+res.telefono,
        sms:'su codigo para cambiar de contraseña es '+cod
      }
      sms.sendSms(data,(err,smsr)=>{
        console.log(smsr);
      email.cuentaBlock (usu,(err,ressp)=>{
        connection.query(upd,[cod,res.id],(err,resp)=>{
          if(err){throw err}
          else
          {
            callback(null,true)
          }
        });
      });
    });
      }
      }
    });
  }
};

ejectModel.aceptaContra = (dts,callback)=> {
  if(connection)
  {
    // console.log('Cambio de contrseña');
    var upt = 'UPDATE members SET password = ? WHERE salt_contra = ?;';
    connection.query(upt,[dts.pssw,dts.salt],(err,row)=>{
      if(err){throw err}
      else
      {
        // console.log(row);
        // console.log(row.affectedRows);
        if(row.affectedRows>=1)
        {
                  callback(null,true);
        }
        else {
          callback(null,false);
        }

      }
    });
  }
};

ejectModel.fotosSer = async (ser,callback) => {
if(connection)
{
  var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
  // console.log(ser);
  connection.query(sql,[ser.id_servicios],(err,res)=>{
    ser.fotos = res;
    // console.log(ser);
    callback(null,ser)
  });
}

};




module.exports = ejectModel;
