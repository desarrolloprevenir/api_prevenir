let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let termModule = {};

termModule.agregarTerminados1 =  (termi,callback) => {
  if(connection)
  {
    let j = 0;
    let valores;
    console.log('dentro de lentes terminados 1');
    console.log(termi);
    let sql = 'INSERT INTO lentes_terminados (tipo, esfera, cilindro, adicion, id_material) VALUES (?, ?, ?, ?, ?);'
    let id_material = termi.id_material;
    console.log(termi);
    if (JSON.stringify(termi)!='[]')
    {
        for (var i = 0; i < termi.length; i++) {
          let form = termi[i];
          console.log(form);
          connection.query(sql,[form.tipo,form.esfera,form.cilindro,form.adicion,id_material],(err,rter)=>{
              if(err){throw err}
              else
              {
                valores = form.valores;
                console.log(valores);
                valores.ids = rter.insertId;
                console.log(valores);

                // j++;
                // if(j>=termi.length)
                // {
                //   callback(null,true);
                // }
              }
          });
        }
    }
  }
};

termModule.agregarTerminados = (termi,callback) => {
  if(connection)
  { let j = 0;
    let valores =[];
    //inicio de la promesa
    let promesa = new Promise(function(resolve, reject){
      let sqlin = 'INSERT INTO lentes_terminados (tipo, esfera, cilindro, adicion, id_material) VALUES (?, ?, ?, ?, ?);';
      let id_material = termi.id_material;
      if (JSON.stringify(termi)!='[]')
      {
        for (var i = 0; i < termi.length; i++) {
          let form = termi[i];
          // console.log(form);
          connection.query(sqlin,[form.tipo,form.esfera,form.cilindro,form.adicion,id_material],(err,rter)=>{
              if(err){throw err}
              else
              {
                let val1 = form.valores;
                // val1.ids = rter.insertId;
                // valores.push(val1);
                for (var i = 0; i < val1.length; i++) {
                  val1[i].id = rter.insertId;
                  valores.push(val1[i]);
                  // console.log('cargado nuevo valor');
                  // console.log(valores);
                }
                j++;
                if(j>=termi.length)
                {
                  return (err) ? reject(err) :  resolve(valores);
                }
              }
          });
        }
      }
    });
    //final de promesas
    promesa.then(async(res1, rej1)=>{
        let h = 0;
      new Promise(function(resolve, reject) {
        // console.log('promesa resuelta');
        // console.log(res1);
        let sqlval = 'INSERT INTO valor_lentes_terminados (valor, id_terminados, id_sucursales) VALUES (?, ?, ?);';
          for (var i = 0; i < res1.length; i++) {
              let valors = res1[i];
              connection.query(sqlval,[valors.valor,valors.id,valors.id_sucursal],(err,resval)=>{
                if(err){throw err}
                else
                {
                  h++;
                  // console.log(res1.length);
                  // console.log(h);
                  if(h>=res1.length)
                  {
                    // console.log('dentro del if');
                    return (err) ? reject(err) :  resolve(resval);
                  }
                }
              })
          }
      }).then(async(res2,rej2)=>{
        // console.log('finalizado');
        callback(null,true);
      });
    })
  }
};

termModule.darValoresTer = (id,callback) => {
  if(connection)
  {
    console.log(id);
    let sql = 'SELECT valor_lentes_terminados.*, sucursales.nombre FROM valor_lentes_terminados, sucursales WHERE id_terminados = ? GROUP BY id_valorterminados;';
    connection.query(sql,[id],(err,resv)=>{
      if(err){throw err}
      else
      {
        console.log('valores de formulas ',id);
        console.log(resv);
        callback(null,resv);
      }
    })
  }
}

termModule.eliminarTerminados = (id) => {
if(connection)
{
let delsql = ''
}
};



module.exports = termModule;
