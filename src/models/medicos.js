let mysql =require('sync-mysql');
let config = require('../config');
let valida = require('./valida');
let service = require('./services');
let titulo = require('./titulos');
let ciclo = require('../controler/ciclos')
let email = require('./email');
var async = require("async");
var forEach = require('async-foreach').forEach;

connection = new mysql({
host: config.host,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let medicosModule = {};

//devuelve medico por el id del provedor
medicosModule.darMedicosProv = (id, callback)=>{
if(connection)
{
var sql = 'SELECT *, CONCAT(nombres," ",apellidos) as nombre FROM medicos, provedores_has_medicos WHERE provedores_has_medicos.medico_id = medicos.medico_id AND provedores_has_medicos.id_provedor = ? AND eliminado = 0;';
connection.query(sql,[id],(err,row)=>{
if(err)
{
throw err;
}
else
{
callback(null,row);
}
});
}
};

//Busca el medico por su cedula y lo devuelve en caso contrario retorna false
medicosModule.buscarMedicoCedu = (cedu,callback)=>{
if(connection)
{
  let sel = 'SELECT * FROM medicos where cedula = ?';
  connection.query(sel,[cedu],(err,row)=>{
    if(err){throw err}
    else
    {
      if (JSON.stringify(row)=='[]')
      {
        callback(null,false);
      }
      else
      {
        callback(null,row);
      }
    }
  });
}
};



//Busca el medico por su id de medico y lo devuelve en caso contrario retorna false
medicosModule.buscarMedicoId = (id,callback)=>{
if(connection)
{
  let sel = 'SELECT * FROM medicos where medico_id = ?';
  connection.query(sel,[id],(err,row)=>{
    if(err){throw err}
    else
    {
      if (JSON.stringify(row)=='[]')
      {
        callback(null,false);
      }
      else
      {
        callback(null,row);
      }
    }
  });
}
};


medicosModule.getMedicoMem = (id,callback)=>{
  if(connection)
  {
    console.log(id);
    let resp = [];
      let get = 'SELECT medicos.*,municipio.nombre as municipio,departamento.id_departamento as departamentoId, departamento.nombre as departamento, members.email FROM medicos,members, municipio, departamento WHERE municipio.id_departamento = departamento.id_departamento AND medicos.ciudad_origen = municipio.id_municipio AND medicos.members_id = members.id AND medicos.members_id = ?;';
      connection.query(get,[id],(err,res)=>{
        if(err){throw err}
        else
        {
          console.log('respuesta medicos');
          console.log(res);
          titulo.getTitulos(id,(err,row)=>{
            console.log(row);
            if (JSON.stringify(row)!='[]')
            {
              console.log('dentro');
            res = res[0];
            res.titulos = row;
            resp.push(res);
            console.log(resp);
            callback(null,resp)
            }
            else {
              console.log('fuera');
              res.titulos = '[]';
              console.log(res);
              callback(null,res)
            }

          });

        }
      });
  }

};

//agrega el medico a la base de datos creando su usario para login con contraseña
medicosModule.agregarMedico = (medico,callback)=>{
  const vali = {
    email: medico.email,
    t_prof:medico.tarj_profecional
  };
  // console.log('valida');
  // console.log(vali);
  valida.validaMedico(vali,(err,res)=>{
    // console.log(res);
    if(res.existe==false)
    {
      if(connection)
    {
      ciclo.generaSalt((err,gen)=>{
          salt = gen;
          // console.log(medico);

        var mem = 'INSERT INTO members (email, admin, password, salt) VALUES (?, ?, ?, ?);'
        var sql = 'INSERT INTO medicos (medico_id, cedula, nombres, apellidos, tarj_profecional, titulo,members_id) VALUES ( ?,?, ?, ?, ?, ?,?)';
        connection.query(mem,[medico.email,'medico',medico.pssw,salt],(err,mem)=>{
          if(err){throw err}
          else
          {
            var usu = {
              to:medico.email,
              pss: salt,
              id:mem.insertId
            };
            email.cuentaBlock (usu,(err,ressp)=>{
              // console.log(ressp);
              // console.log('member agregado con exito');
              // console.log(mem.insertId);
              connection.query(sql,[mem.insertId,medico.cedula,medico.nombre,medico.apellidos,medico.tarj_profecional,medico.titulo,mem.insertId],(err,row)=>{
              if(err)
              {
              throw err
              }
              else
              {
                let ins = 'INSERT INTO provedores_has_medicos (id_provedor,medico_id) VALUES (?,?);';
                connection.query(ins,[medico.provedores_id,mem.insertId],(err,ins)=>{
                  if(err){throw err}
                  else
                  {
                    callback(null,true);
                  }
                });

              }
              });
            });

          }
        });
      });
    }
    }
    else
    {
      // console.log(res);
      callback(null,res)
    }
  });

};


//Agregar un servicio al medico
medicosModule.agregarProvedor = (medico,callback) =>{
  if(connection)
  {
    let val = 'SELECT * FROM provedores_has_medicos WHERE id_provedor = ? AND medico_id = ? AND eliminado = 0;'
    connection.query(val,[medico.provedores_id,medico.cedula],(err,vali)=>{
      if(err){throw err}
      else
      {
        if (JSON.stringify(vali)!='[]')
        {
          callback(null,{'existe':true});
        }
        else
        {
          let ins = 'INSERT INTO provedores_has_medicos (id_provedor,medico_id) VALUES (?,?);';
          connection.query(ins,[medico.provedores_id,medico.cedula],(err,ins)=>{
            if(err){throw err}
            else
            {
              callback(null,true);
            }
          });
        }
      }
    });


  }
};

medicosModule.provedorServicios = async (id,callback)=>{
if(connection)
{
  let p = 1;
  // let servi;
  let res = [];
  let prs = {};
  // console.log(id);
  let prov = 'SELECT provedores.nombre as provedor, provedores.id_provedor as idp from provedores, provedores_has_medicos WHERE provedores.id_provedor = provedores_has_medicos.id_provedor and provedores_has_medicos.medico_id = ?;';
  connection.query(prov,[id],(err,pr)=>{
    if(err){throw err}
    else
    {
      // console.log(pr);
      if (JSON.stringify(pr)=='[]')
      {
        callback(null,false)
      }
      else
      {
        // console.log(pr.length);
        // console.log(pr);
          for (var i = 0; i < pr.length; i++)
          {
            prs = pr[i];
            prs.id = id;
            service.serviciosMedicoProvedor(prs,(err,row)=>{
              // console.log(row);
              // prs.serv = row;
              res.push(row);
              // console.log('/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/');
              // console.log(res);
              // console.log('/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/');
              if(p>=pr.length)
              {
                callback(null,res);
              }
                p++;
              // console.log(p+'/*/*/*/*/*'+pr.length);
            });

          }


      }
    }
  });
}
};


medicosModule.setMedico = (medico,callback) =>{
  if(connection)
  {
    console.log(medico);
    let titulos = medico.estudios;
    // console.log(titulos);
    let upd = 'UPDATE medicos SET nombres = ?, apellidos = ?, titulo = ?, telefono = ?, whatsapp = ?, ciudad_origen = ?,fecha_nacimiento = ?, genero = ? WHERE (medico_id = ?);';
    connection.query(upd,[medico.nombres,medico.apellidos,medico.titulo,medico.telefono,medico.wp,medico.ciudad_o,medico.fecha_n,medico.genero,medico.id],(err,rep)=>{
      if(err){throw err}
      else
      {

        if (JSON.stringify(medico.estudios)=='[]')
        {
        callback(null,true);
        }
        else
        {
          titulo.agregarTitulos(medico.estudios,(err,resp)=>{
            callback(null,resp);
          });
        }

      }
    });
  }
};


medicosModule.deleteMedico = (ids,callback)=>{
  if(connection)
  {
    var sel =  'SELECT count(*) as val FROM provedores_has_medicos WHERE id_provedor = ? AND medico_id = ? AND eliminado = 0 AND activo = true;'
    var upt = 'UPDATE provedores_has_medicos SET eliminado = 1 WHERE id_provedor = ? and medico_id = ?;'
    connection.query(sel,[ids.prov,ids.medico],(err,res)=>{
      if(err){throw err}
      else
      {

        res = res[0]
        console.log(res.val);
          if (res.val==0)
          {
            connection.query(upt,[ids.prov,ids.medico],(err,row)=>{
              if(err){throw err}
              else
              {
                callback(null,true)
              }
            });

          }
          else
          {
            callback(null,false);
          }
      }
    });
  }
};

medicosModule.activaMedico = (ids,callback)=>
{
  if(connection)
  {
    console.log(ids);
    let ins = 'UPDATE provedores_has_medicos SET id_sucursales = ?, id_consultorio = ?, activo = ? WHERE (id_provedor = ?) and (medico_id = ?);';
    forEach(ids, function(idt, index, arr)
      {
            connection.query(ins,[idt.id_sucursal, idt.id_consultorio,'true', idt.id_provedor, idt.id_medico,],(err,add)=>{
              if(err){throw err}
              else
              {
                // console.log('ok');
                // console.log(index, ' ',ids.length-1 );
                if(index>=ids.length-1)
                {
                  callback(null,true);
                }
              }
            })
        });

  }
}

medicosModule.darMedicosSucursal = (ids, callback) =>
{
  if(connection)
  {
    var sql = 'SELECT medicos.*, consultorio.id_consultorio as consultorio FROM medicos, consultorio, sucursales WHERE medicos.medico_id = consultorio.medico_id AND consultorio.id_sucursales = sucursales.id_sucursales AND sucursales.id_sucursales = ? AND consultorio.id_servicios = ? AND consultorio.eliminado = 0;';
    connection.query(sql,[ids.id_sucur,ids.id_serv],(err,row)=>{
        if(err){throw err}
        else
        {
          callback(null,row)
        }
    });
  }
}

module.exports = medicosModule;
