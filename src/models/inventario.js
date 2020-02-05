let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});

let invModule = {};

//categorias inventvario
invModule.agregarCatei = (cate,callback)=>{
  console.log(cate);
  let sqlin = 'INSERT INTO categoria_inv (nombre, descripcion) VALUES (?, ?);';
  connection.query(sqlin,[cate.nombre,cate.descripcion],(err,respin)=>{
    if(err){throw err}
    else {
    }
    {
      let sqlsu = 'INSERT INTO sucursales_has_categoria_inv (id_sucursales, id_cateogoriai) VALUES (?, ?);';
      connection.query(sqlsu,[cate.id_sucursal,respin.insertId],(err,resp)=>{
        if(err){throw err}
        else
        {
          callback(null,true);
        }
      })
    }
  })
}

invModule.darCateInv = (idsu,callback) =>{
if(connection){
  console.log(idsu);
  let sql = 'SELECT * FROM sucursales_has_categoria_inv,categoria_inv WHERE categoria_inv.id_cateogoriai = sucursales_has_categoria_inv.id_cateogoriai AND sucursales_has_categoria_inv.id_sucursales = ?;';
  connection.query(sql,[idsu],(err,resinv)=>{
    if(err){throw err}
    else
    {
      callback(null,resinv);
    }
  })
}
};

invModule.modificarCateI = (cate,callback) =>{
if(connection)
{
  let sqlmod = 'UPDATE categoria_inv SET nombre = ?, descripcion = ? WHERE id_cateogoriai = ?;';
  connection.query(sqlmod,[cate.nombre,cate.desc,cate.id_cat],(err,resp)=>{
    if(err){throw err}
    else
    {
      callback(null,true);
    }
  });
}
};

invModule.EliminarCateI = (id,callback) => {
  if(connection)
  {
    let sqldel = 'DELETE FROM categoria_inv WHERE id_cateogoriai = ?;';
    connection.query(sqldel,id,(err,resp)=>{
      if(err){throw err}
      else
      {
        callback(null,true);
      }
    });
  }
}


//INVENTARIO
invModule.darinventario = (ids,callback)=>{
  if(connection)
  {
    let j = 1;
    var inv = []
    var json = [];
  if(ids.cate == 1)
  {
    let sqlmon = 'SELECT * FROM material_lentes WHERE material_lentes.id_sucursales = ?;';
    connection.query(sqlmon,ids.id_sucursal,(err,resmon)=>{
      if(err){throw err}
      else
      {
        let sqlfor = 'SELECT * FROM formula_l WHERE id_material = ?;';
        for (var i = 0; i < resmon.length; i++) {
          let id = resmon[i];
          // console.log(id);
          connection.query(sqlfor,id.id_material,(err,resp)=>{
            if(err){throw err}
            else {
              {
                id.formula = resp;
                json.push(id);
                // console.log('RESPUESTA INV');
                // console.log(resmon);
                if(j>=resmon.length)
                {
                  callback(null,resmon)
                }
                j++
              }
            }
          })
        }

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
          let formulas = montu.formula;
          console.log(formulas);
          let sqlins = 'INSERT INTO material_lentes (material, descripcion, id_sucursales) VALUES (?, ?, ?);';
          connection.query(sqlins,[montu.nombre,montu.descripcion,montu.id_sucursales],(err,resp)=>{
            if(err){throw err}
            else {
              var idm = resp.insertId;
              let sqlfor = 'INSERT INTO formula_l (esfera, cilindro, valor_unit, id_material) VALUES (?, ?, ?, ?);';
              for (var i = 0; i < formulas.length; i++) {
                let formula = formulas[i];
                console.log(formula);
                connection.query(sqlfor,[formula.esfera,formula.cilindro,formula.valor_u,idm],(err,resf)=>{
                  if(err){throw err}
                  else{
                    j++;
                    if(j==mont.length)
                    {
                      callback(null,true);
                    }
                  }
                })
              }

            }
          })
        }

      }
};




module.exports = invModule;
