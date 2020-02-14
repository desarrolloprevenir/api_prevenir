let mysql =require('mysql');
let config = require('../config');
var moment = require('moment');
var eject = require('./ejecucion');
var email = require('./email');
var pushs = require('./push');
var pushOs = require('./pushOs')
var sleep = require('system-sleep');


connection = mysql.createConnection({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let eventmodule = {};

// retorna todos los eventos
eventmodule.darEvents = (callback) =>{
if(connection)
{
var sql = 'SELECT events.*, servicios.nombre FROM events, servicios WHERE events.servicios_idservicios = servicios.id_servicios;';
connection.query(sql,(err,row)=>{
if(err){throw err}
else
{
callback(null,row);
}
});
}
};
//retorna una lista de eventos por ususario
eventmodule.darEventsIdUsuario=(id,callback)=>{
if(connection)
{
  var p = 1;
var sql = 'SELECT events.*, servicios.nombre as servicio, servicios.id_servicios , sucursales.nombre as sucursal, sucursales.direccion as direccion, sucursales.telefono FROM events, servicios, sucursales, consultorio WHERE events.id_consultorio = consultorio.id_consultorio AND servicios.id_servicios = consultorio.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND events.usuarios_id = ? ORDER BY events.start asc;';
connection.query(sql,id,(err,row )=>{
if(err){throw err}
else
{
////console.lo.log('prueba de git');
//console.lo.log(moment().utc().format());
//console.lo.log(row.length);
//row = row[0];
////console.lo.log(row);
if(row.length==0)
{
  callback(null,row)
}
for (var i = 0; i < row.length; i++)
{
  var s = row[i];
  s.start =  moment(s.start).format('YYYY-MM-DD hh:mm:SS a');
  s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
  //console.lo.log(s);
  if(row.length==p)
  {
    callback(null,row);
  }
  p++;
}
}
});
}
};

eventmodule.darEventsBenf = (id,callback)=>{
  if(connection)
  {
    //console.lo.log(id);
    var sql = "SELECT events.*, servicios.nombre as servicio, servicios.id_servicios , sucursales.nombre as sucursal, sucursales.direccion as direccion, CONCAT(usuarios.nombre,' ',usuarios.apellidos) as nombreU FROM events, servicios, sucursales, consultorio, usuarios WHERE events.id_consultorio = consultorio.id_consultorio AND servicios.id_servicios = consultorio.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND events.usuarios_id = usuarios.id AND usuarios.usuariosBf_id = ?;"
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
        for (var i = 0; i < row.length; i++)
        {
          var s = row[i];
          s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          //console.lo.log(s);
        }
        callback(null,row);
      }
    });
  }
};

eventmodule.darEventsMasc = (id,callback)=>{
  if(connection)
  {
    //console.lo.log(id);
    var sql = 'SELECT events_masc.*, servicios.nombre as servicio, servicios.id_servicios, sucursales.nombre as sucursal, mascotas.nombre as nombreU FROM events_masc, servicios, sucursales, mascotas, consultorio WHERE events_masc.id_consultorio = consultorio.id_consultorio AND servicios.id_servicios = consultorio.id_servicios AND sucursales.id_sucursales = consultorio.id_sucursales AND events_masc.id_mascotas = mascotas.id_mascotas AND mascotas.id_usuarios = ?;';
    connection.query(sql,[id],(err,row)=>{
      if(err)
      {
        throw err
      }
      else
      {
        //console.lo.log('aqui llege');
        for (var i = 0; i < row.length; i++)
        {
          var s = row[i];
          s.start =  moment(s.start).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          s.end = moment(s.end).utc(+5).format('YYYY-MM-DD hh:mm:SS a');
          //console.lo.log(s);
        }
        callback(null,row);
      }
    });
  }
};

eventmodule.eventsConsultorio = (idc, callback)=>{
    if(connection)
    {
      var sql = 'SELECT COUNT(events.id_eventos) as eventsC FROM events WHERE events.id_consultorio = ?;';
            connection.query(sql,[idc],(err,resp)=>{
                if(err){throw err}
                else {
                  callback(null,resp);
                }
            });
    }
};

//retorna una lista de eventos por servicio
eventmodule.darEventsIdService = (ids,callback)=>{
if(connection)
{
var sql = 'SELECT events.*, servicios.nombre FROM events, servicios WHERE events.servicios_idservicios = servicios.id_servicios AND events.servicios_idservicios = ?;';
connection.query(sql,ids,(err,row)=>{
if(err){throw err}else{callback(null,row);}
})
}
};

//agrega los eventos a la base de datos
eventmodule.agregarEvento = (events,callback) =>{
if(connection){
  console.log('*/*/*/*/*EVENTOS AGREGAR/*/*/*/*/*');
console.log(events);
//console.lo.log(events.servicio+'///////////*************************');
if(events.mascota==true)
{
  // console.log('mascota');
  var sql = 'INSERT INTO events_masc(color,start,end,id_mascotas,id_consultorio) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events_masc where id_mascotas = ? and DATE(start) = DATE(?); ';
}
else
{
  // console.log('humano');
  var sql = 'INSERT INTO events(color,start,end,usuarios_id,id_consultorio) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events where usuarios_id = ? and DATE(start) = DATE(?); ';
}

connection.query(valida,[events.usuario,events.start],(err,res)=>{
if(err){throw err}
else {

// res = res[0];
// console.log('/*/*/*/*/RESPUESTA DE AGREGAR CITASC /*/*/*/*/*/');
// console.log(res);
if(JSON.stringify(res)=='[]')
{
  // console.log('EVENTS EN AGREGAR EVENTO ********');
  // console.log(events);
connection.query(sql,[events.color,events.start,events.end,events.usuario,events.consultorio],(err,row)=>{
if(err){throw err}
else
{
var corr = {
  id_serv: events.servicio,
  start: events.start,
  id_usu:events.usuario,
  masc:events.mascota

};
// eject.correCita(corr,(err,resps)=>{
var psh = 'SELECT members.tokenpsh, members.email, servicios.nombre FROM members,provedores,servicios WHERE provedores.members_id = members.id AND servicios.id_provedores = provedores.id_provedor AND servicios.id_servicios = ?;';
connection.query(psh,[events.servicio],(err,rowph)=>{
  if(err){throw err}
  else
{

}
});

// });

}
});

}
else{
  //console.lo.log('vacio');
callback(null,[{'reservado':true}]);}
}

});
}
};
//__________________________________________________________________________________________________



//agrega los eventos a la base de datos
eventmodule.agregarEvento = (events,callback) =>{
if(connection){
  // console.log('*/*/*/*/*/*/*/*/*/*');
// console.log(events);
//console.lo.log(events.servicio+'///////////*************************');
if(events.mascota==true)
{
  console.log('mascota');
  var sql = 'INSERT INTO events_masc(color,start,end,id_mascotas,id_consultorio) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events_masc where id_mascotas = ? and DATE(start) = DATE(?); ';
}
else
{
  // console.log('humano');
  var sql = 'INSERT INTO events(color,start,end,usuarios_id,id_consultorio) VALUES (?,?,?,?,?)';
  var valida = 'SELECT createdAT,start FROM events where usuarios_id = ? and DATE(start) = DATE(?); ';

}

connection.query(valida,[events.usuario,events.start],(err,res)=>{
if(err){throw err}
else {

// res = res[0];
// console.log('/*/*/*/*/RESPUESTA DE AGREGAR CITASC /*/*/*/*/*/');
// console.log(res);
if(JSON.stringify(res)=='[]')
{
  console.log('EVENTS EN AGREGAR EVENTO ********');
  console.log(events);
connection.query(sql,[events.color,events.start,events.end,events.usuario,events.consultorio],(err,row)=>{
if(err){throw err}
  else
    {
      var players = [];
      var idEvnt = row.insertId;
      var idUsuario = events.usuario;
      var corr = {
      id_serv: events.servicio,
      start: events.start,
      id_usu:events.usuario,
      masc:events.mascota};
    // eject.correCita(corr,(err,resps)=>{
    var psh = 'SELECT members.tokenpsh, members.email, servicios.nombre FROM members,provedores,servicios WHERE provedores.members_id = members.id AND servicios.id_provedores = provedores.id_provedor AND servicios.id_servicios = ?;';
    var med = 'SELECT members.tokenpsh FROM consultorio, medicos, members WHERE medicos.medico_id = consultorio.medico_id AND medicos.members_id = members.id AND consultorio.id_consultorio = ?;';
      // console.log('mascota');
    if(events.mascota==true)
    {
      // console.log('mascota');
      var usup = 'SELECT members.tokenpsh FROM usuarios, mascotas, members WHERE usuarios.members_id = members.id AND mascotas.id_usuarios = usuarios.id AND mascotas.id_mascotas = ?;';
    }
    else
    {
      // console.log('humano');
      var usup = 'SELECT members.tokenpsh FROM  usuarios,  members WHERE usuarios.members_id = members.id AND usuarios.id = ?;';
    }


    connection.query(psh,[events.servicio],(err,rowph)=>{
      if(err){throw err}
      else{

      email.emailCitaPr(corr,(err,rowss)=>{
        rowph = rowph[0];
        console.log('PROVEDOR');
        console.log(rowph);
        if(rowph.tokenpsh!='not')
        {
              players.push(rowph.tokenpsh)
              console.log('PLAYERS PROVEDOR');
              console.log(players);
        }
            console.log(events.consultorio);
        connection.query(med,[events.consultorio],(err,rmed)=>{
          if(err){throw err}
          else
          {

            rmed = rmed[0];
            console.log('MEDICOS');
            console.log(rmed);
            if(rmed.tokenpsh!='not' || rmed == undefined || rmed == 'undefined')
            {
                  players.push(rmed.rmed)
                  console.log('PLAYERS MEDICOS');
                  console.log(players);
            }
            connection.query(usup,[idUsuario],(err,rusu)=>{
              if(err){throw err}
              else
              {
                rusu = rusu[0];
                console.log('USUARIOS');
                console.log(rusu);
                if(rusu.tokenpsh!='not')
                {
                      console.log('ENTRO AL IF CON PUSH ' ,rusu.tokenpsh );
                      players.push(rusu.tokenpsh)
                      console.log('PLAYERS USUARIOS');
                      console.log(players);
                }
                var  disp = {
                            "headings" : {"en": "New ", "es" : "Nueva Cita"},
                            "contents": {
                            "en": "You have the new date",
                            "es": 'Tienes una nueva cita de '+rowph.nombre+', a traves de nuesta app de descuentos medicos para el: '+moment(events.start).format('DD-MM-YYYY')+' a las: '+moment(events.start).format('HH:mm a')+' por favor revisa tus citas en la aplicacion'
                            },
                            "include_player_ids": players
                          };
                console.log('PLAYERS');
                console.log(disp);
                pushOs.sendPush(disp,(err,respu)=>{
                  console.log('RESPUESTA PUSH');
                  console.log(respu);
                  callback(null,[{'agregado':true, 'push':respu}]);
                });
              }
            });
          }
        });

      });
    }
    });

    // });

    }
    });

    }
    else{
      //console.lo.log('vacio');
    callback(null,[{'reservado':true}]);}

    }
            });

}

};



//____________________________________________________________________________________________________
// ELIMINA UN EVENTO DE LA BASE DE DATOS
eventmodule.eliminarEvento = (ev,callback) =>{
  let id = ev.id;
  let masc = ev.masc;
var now = moment().format('YYYY-MM-DD hh:mm:ss a');
console.log('hoy'+now);
if(connection)
{
if(masc == true || masc == 'true' )
{
  var valida = 'SELECT start FROM events_masc WHERE id_eventos = ?';
  var del = ' DELETE FROM events_masc where id_eventos = ?';
  var psh = 'SELECT events_mas.start, members.tokenpsh, servicios.nombre FROM events_mas,usuarios,members, consultorio,servicios WHERE events_mas.usuarios_id = usuarios.id AND usuarios.members_id = members.id AND events_mas.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events_mas.id_eventos = ?;';
}
else
{
var valida = 'SELECT start FROM events WHERE id_eventos = ?';
var del = ' DELETE FROM events where id_eventos = ?';
var psh = 'SELECT events.start, members.tokenpsh, servicios.nombre FROM events,usuarios,members, consultorio,servicios WHERE events.usuarios_id = usuarios.id AND usuarios.members_id = members.id AND events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND events.id_eventos = ?;';
}
connection.query(valida,id,(err,resp)=>
{
resp = resp[0];
resp = resp.start
resp = moment(resp).format('YYYY-MM-DD hh:mm:ss a');
console.log('original'+resp);
resp =  moment(resp).subtract(1, 'day').format('YYYY-MM-DD hh:mm:ss a');
console.log('resta'+resp);
if(moment(now).isSameOrBefore(resp))
{
  let env = {
    id:id,
    sql:psh
  };
eject.eliminaNotifica(env,(err,rowss)=>{
  if(rowss.borrado==true)
  {
    connection.query(del,[id],(err,row)=>{
    if(err){throw err}
    else
    {
      // console.log('/*/*/*/*/*/*/*/*/*Respuesta la eliminacion de la cuita');
      // console.log(row);
        callback(null,{'borrado':true})
    }
    });

  }
});
}
else
{

callback(null,{'borrado':false})

}

});
}
};

eventmodule.delEventSuc = (ev,callback)=>{
if(connection)
{
  console.log(ev);
  //selecciona el id del servicio con el id de los provedores
  if(ev.cate == 20 || ev.cate == '20')
  {
    // console.log('mascota');
    var sel = 'SELECT consultorio.id_servicios FROM  events_masc, consultorio WHERE events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_consultorio = ? AND events_masc.id_eventos = ? limit 1;';
    var sql = 'DELETE FROM events_masc where events_masc.id_eventos = ? AND events_masc.id_consultorio = ?;';
    var psh = 'SELECT events_masc.start, servicios.nombre, provedores.nombre, members.tokenpsh FROM events_masc, consultorio, servicios, sucursales, provedores, usuarios, members, mascotas WHERE events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND sucursales.id_provedor = provedores.id_provedor AND events_masc.id_mascotas = mascotas.id_mascotas AND mascotas.id_usuarios = usuarios.id AND usuarios.members_id = members.id AND events_masc.id_eventos =  ?;';
  }
  else
  {
    // console.log('humano');
    var sel = 'SELECT consultorio.id_servicios FROM  events, consultorio WHERE events.id_consultorio = consultorio.id_consultorio AND consultorio.id_consultorio = ? AND events.id_eventos = ? limit 1 ';
    var sql = 'DELETE FROM events where events.id_eventos = ? AND events.id_consultorio = ?;';
    var psh = 'SELECT events.start, servicios.nombre, provedores.nombre, members.tokenpsh FROM events, consultorio, servicios, sucursales, provedores, usuarios, members WHERE events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND sucursales.id_provedor = provedores.id_provedor AND events.usuarios_id = usuarios.id AND usuarios.members_id = members.id AND events.id_eventos =  ?;';
  }
// console.log(ev);
connection.query(sel,[ev.idc,ev.ide],(err,row)=>{
if(err){throw err}
else
{
row = row[0];
// console.log('///////////RESPUESTA LOG ROW ');
// console.log(row);
// console.log('///////////RESPUESTA LOG ROW ');
let evs = {
  id:ev.ide,
  sql:psh
};
// eject.eliminaNotifica(evs,(err,rowss)=>{
  // console.log(rowss);
  // if(rowss.borrado==true)
  // {
    connection.query(sql,[ev.ide,ev.idc],(err,row)=>{
    if(err){throw err}
    else
    {
    callback(null,[{'borrado':true}])
    }
    });
  // }
// });
}
});

}
};


eventmodule.citaHistorial = (callback)=>{
if(connection)
{
var h = moment().format('YYYY-MM-DD HH:mm:ss');
var citas = 'INSERT INTO historial (color,start,end,usuarios_id,id_consultorio,fue) SELECT color, start, end, usuarios_id, id_consultorio, 0 FROM events WHERE events.start < curdate();'
var del = 'DELETE FROM events WHERE events.start < curdate() AND events.id_eventos > 0;'
connection.query(citas,[h],(err,res)=>{
if(err){throw err}
else
{
connection.query(del,[h],(err,resp)=>{
if(err){throw err}
else
{
//console.lo.log(h);
callback(null,'eliminado');
}
});
}
});
}
};

eventmodule.citaHistorialM = (callback)=>{
if(connection)
{
var h = moment().format('YYYY-MM-DD HH:mm:ss');
var citas = 'INSERT INTO historial_masc (color,start,end,id_mascotas,id_consultorio,fue) SELECT color, start, end, id_mascotas, id_consultorio, 0 FROM events_masc WHERE events_masc.start < curdate();'
var del = 'DELETE FROM events_masc WHERE events_masc.start < curdate() AND events_masc.id_eventos > 0;'
connection.query(citas,[h],(err,res)=>{
if(err){throw err}
else
{
connection.query(del,[h],(err,resp)=>{
if(err){throw err}
else
{
//console.lo.log(h);
callback(null,'eliminado');
}
});
}
});
}
};



eventmodule.eventsCalendar = (ev,callback) =>{
  let res =[];
  if(connection)
  {
    console.log('ERROR EN EVENTOS ');
    console.log(ev);
    if(ev.id_mascotas==20 || ev.id_mascotas=='20')
    {
      //console.log('dentro del if');
      var sql = 'SELECT  events_masc.id_eventos, mascotas.*,events_masc.id_mascotas, mascotas.nombre as title ,start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events_masc, mascotas WHERE events_masc.id_mascotas = mascotas.id_mascotas AND MONTH(start) = ? AND YEAR(start) = ? and events_masc.id_consultorio = ?';
    }
    else
    {
      //console.log('no entro al if');
      var sql = 'SELECT events.id_eventos, usuarios.*, events.usuarios_id, CONCAT(usuarios.nombre," ",usuarios.apellidos) as title, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events, usuarios WHERE events.usuarios_id = usuarios.id AND MONTH(start) = ? AND YEAR(start) = ? and events.id_consultorio = ?;';
    }


  connection.query(sql,[ev.mes,ev.anio,ev.id_servicio],(err,row)=>{
    if(err)
    {
      throw err;
    }
    else
    {
      if(JSON.stringify(row)=='[]')
      {

      }
      else
      {
        for (var i = 0; i < row.length; i++) {
          // console.log(row[i]);
          let vari = row[i];
          vari.start = moment(vari.start).utc(-5).format();
          vari.end =  moment(vari.end).utc(-5).format();
          res.push(vari);
        }
        callback(null,res);
      }

    }
  });
  }
};

eventmodule.eventsCalendarSuc = (ev,callback) =>{
  let res =[];
  if(connection)
  {
    //console.lo.log(ev.id_mascotas);
    if(ev.id_mascotas==20 || ev.id_mascotas=='20')
    {
      //console.log('dentro del if');
      var sql = 'SELECT events_masc.*,mascotas.nombre as title,mascotas.*, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events_masc, servicios,consultorio,sucursales, mascotas WHERE events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = ? AND consultorio.id_sucursales = sucursales.id_sucursales AND events_masc.id_mascotas = mascotas.id_mascotas AND MONTH(start) = ? AND YEAR(start) = ? AND sucursales.id_sucursales = ?;'
    }
    else
    {
      //console.log('no entro al if');
      var sql = 'SELECT events.*,usuarios.*, CONCAT(usuarios.nombre," ",usuarios.apellidos) as title, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events, servicios,consultorio,sucursales, usuarios WHERE events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = ? AND consultorio.id_sucursales = sucursales.id_sucursales AND events.usuarios_id = usuarios.id AND MONTH(start) = ? AND YEAR(start) = ? AND sucursales.id_sucursales = ?'
    }


  connection.query(sql,[ev.id_servicio, ev.mes,ev.anio, ev.id_sucursal],(err,row)=>{
    if(err)
    {
      throw err;
    }
    else
    {
      // console.log(row);
      if(JSON.stringify(row)=='[]')
      {
          callback(null,row);
      }
      else
      {
        // console.log('cambiando hora');
        for (var i = 0; i < row.length; i++) {
          console.log(row[i]);
          let vari = row[i];
          vari.start = moment(vari.start).utc(-5).format();
          vari.end =  moment(vari.end).utc(-5).format();
          res.push(vari);
        }
        callback(null,res);
      }

    }
  });
  }
};


eventmodule.eventsCalendarSucCon = (ev,callback) =>{
  let res =[];
  // console.log(ev);
  if(connection)
  {
    //console.lo.log(ev.id_mascotas);
    if(ev.id_mascotas==20 || ev.id_mascotas=='20')
    {
      //console.log('dentro del if');
      var sql = 'SELECT events_masc.*,mascotas.nombre as title,mascotas.*, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events_masc, servicios,consultorio,sucursales, mascotas WHERE events_masc.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = ? AND consultorio.id_sucursales = sucursales.id_sucursales AND events_masc.id_mascotas = mascotas.id_mascotas AND MONTH(start) = ? AND YEAR(start) = ? AND sucursales.id_sucursales = ? AND consultorio.id_consultorio = ?;'
    }
    else
    {
      //console.log('no entro al if');
      var sql = 'SELECT events.*,usuarios.*, CONCAT(usuarios.nombre," ",usuarios.apellidos) as title, start, end,YEAR(start) as year, MONTH(start)-1 as month, DAY(start) as date FROM events, servicios,consultorio,sucursales, usuarios WHERE events.id_consultorio = consultorio.id_consultorio AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = ? AND consultorio.id_sucursales = sucursales.id_sucursales AND events.usuarios_id = usuarios.id AND MONTH(start) = ? AND YEAR(start) = ? AND sucursales.id_sucursales = ? AND consultorio.id_consultorio = ?'
    }


  connection.query(sql,[ev.id_servicio, ev.mes,ev.anio, ev.id_sucursal,ev.id_consultorio],(err,row)=>{
    if(err)
    {
      throw err;
    }
    else
    {
      // console.log(row);
      if(JSON.stringify(row)=='[]')
      {
          callback(null,row);
      }
      else
      {
        // console.log('cambiando hora');
        for (var i = 0; i < row.length; i++) {
          // console.log(row[i]);
          let vari = row[i];
          vari.start = moment(vari.start).utc(-5).format();
          vari.end =  moment(vari.end).utc(-5).format();
          res.push(vari);
        }
        callback(null,res);
      }

    }
  });
  }
};



module.exports = eventmodule;
