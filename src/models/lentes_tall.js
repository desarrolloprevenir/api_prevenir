let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let tallModule = {};

tallModule.agregarTallados = (termi,callback) => {
  if(connection)
  { let j = 0;
    var id_material;
    let tiposs =[];
    // console.log('LENTES TALLADOS');
    // console.log(termi);
    //inicio de la promesa
    let promesa = new Promise(function(resolve, reject){
      let sqlin = 'INSERT INTO lentes_tallados (nombre, id_material) VALUES (?, ?);';
      id_material = termi.id_material;
      if (JSON.stringify(termi)!='[]')
      {
        for (var i = 0; i < termi.length; i++) {
          let form = termi[i];
          // console.log('lentes tallados');
          // console.log(form);
          connection.query(sqlin,[form.nombre,id_material],(err,rter)=>{
              if(err){throw err}
              else
              {
                // console.log('cargando tipos');
                // console.log(form.tipos);
                let tipo = form.tipos;
                // val1.ids = rter.insertId;
                // valores.push(val1);
                for (var i = 0; i < tipo.length; i++) {
                  tipo[i].id = rter.insertId;
                  tiposs.push(tipo[i]);
                  // console.log('cargado nuevo valor');
                  // console.log(tiposs);
                }
                j++;
                if(j>=termi.length)
                {
                  return (err) ? reject(err) :  resolve(tiposs);
                }
              }
          });
        }
      }
    });
    //final de promesas
    promesa.then(async(res1, rej1)=>{
        let h = 0;
        let o = 0;
      new Promise(function(resolve, reject) {
        // console.log('promesa resuelta');
        let val = [];
        // console.log(res1);
        let sqlval = 'INSERT INTO tipos_tallados (tipo, id_lentestall) VALUES (?, ?);';
          for (var i = 0; i < res1.length; i++) {
              let tipo = res1[i];
              connection.query(sqlval,[tipo.nombre,tipo.id],(err,resval)=>{
                if(err){throw err}
                else
                {
                    let id_tipo = resval.insertId;
                    // console.log(tipo.valores);
                    let valores = tipo.valores
                    for (var i = 0; i < valores.length; i++) {
                      let valor = valores[i];
                      valor.id_tipo = id_tipo;
                      val.push(valor)

                      // console.log('cargando datos');
                      h++;
                      // console.log(h);
                      // console.log(res1.length);
                      // console.log(val);
                      if(h>=res1.length)
                      {
                        // console.log('dentro del if');
                        let sql = 'INSERT INTO valor_lente_tallado (valor, id_ttallados, id_sucursales) VALUES (?, ?, ?);';
                        // console.log('prueba');
                        // console.log(val);
                        for (var i = 0; i < val.length; i++)
                        {
                          let valo = val[i];
                          connection.query(sql,[valo.valor,valo.id_tipo,valo.id_sucursal],(err,resp)=>{
                            if(err){throw err}
                            else
                            {
                              // console.log('cargados los precios');
                              // console.log(i);
                              // console.log(val.length);
                              // console.log(val);
                              o++;
                              if(o>=val.length)
                              {
                                // console.log('dentro del if i ');
                                return (err) ? reject(err) :  resolve(resp);
                              }
                            }
                          })
                        }
                      }

                    }

                }
              })

          }
      }).then(async(res2,rej2)=>{
        // console.log('retorna los valores');
        // console.log(res2);
        callback(null,true);
      });
    })
  }
};


module.exports = tallModule;
