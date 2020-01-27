let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let invModule = {};

invModule.darCateInv = (idsu,callback) =>{
if(connection){
  console.log(idsu);
  let sql = 'SELECT * FROM prevenirexpres.cateogoria_inv WHERE id_sucursal = ?';
  connection.query(sql,[idsu],(err,resinv)=>{
    if(err){throw err}
    else
    {
      callback(null,resinv);
    }
  })
}
};

invModule.darinventario = (ids,callback)=>{
  if(connection)
  {
    var inv = []
  if(ids.cate == 3)
  {
    let sqlmon = 'SELECT * FROM material_lentes WHERE material_lentes.id_sucursales = ?;';
    connection.query(sqlmon,ids.id_sucursal,(err,resmon)=>{
      if(err){throw err}
      else
      {
        inv.monturas = resmon;
        console.log('RESPUESTA INV');
        console.log(inv);
        callback(null,inv)
      }
    })
  }
  else {
    callback(null,'no existe el inventario aun en la api ni en la bd');
  }
  }
};

invModule.agregarMonturas = (mont,callback)=>{
  if(connection){
        var j = 0;
        console.log(mont.length);
        for (var i = 0; i < mont.length; i++) {
          let montu = mont[i];
          let sqlins = 'INSERT INTO material_lentes (material, descripcion, id_sucursales) VALUES (?, ?, ?);';
          connection.query(sqlins,[montu.material,montu.descripcion,montu.id_sucursales],(err,resp)=>{
            if(err){throw err}
            else {
                j++;
                if(j==mont.length)
                {
                  callback(null,true);
                }
            }
          })
        }

      }
};


module.exports = invModule;
