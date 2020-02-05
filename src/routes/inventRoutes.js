const inv = require('../models/inventario');
const optica = require('../models/optica');

module.exports = function (app)
{
//agrega categorias al inventarios
app.post('/cinventario',(req,res)=>{
  let cate = req.body;
inv.agregarCatei(cate,(err,resp)=>{
  res.json(resp);
})
})
//retorna las categorias de los inventarios
app.get('/cinventario/:idsuc',(req,res)=>{
  console.log(req.params.idsuc);
  inv.darCateInv(req.params.idsuc,(err,resp)=>{
      res.json(resp);
  })
});

//elimina categorias del inventario

//modifica Categorias del inventario
app.put('/cinventario',(req,res)=>{
  let cate = req.body;
  inv.modificarCateI(cate,(err,resp)=>{
    res.json(resp)
  });
});
//dar el inventario por cada sucursal y en caso de optica cate 3 dar material de monturas
app.get('/inventario/:idsuc/:idcatei',(req,res)=>{
  ids ={ id_sucursal:req.params.idsuc,
         cate:req.params.idcatei};
         // console.log(ids);
  inv.darinventario(ids,(err,resp)=>{
    res.json(resp);
  })
});

//guarda los materiales de las monturas nuevas
app.post('/monturas',(req,res)=>{
  let mont = req.body;
  console.log(mont);
  inv.agregarMonturas(mont,(err,resp)=>{
    res.json(resp);
  });
})

}
