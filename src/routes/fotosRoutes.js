const fotos = require('../models/fotos');
const jwts = require('../models/jwt');

module.exports = function (app)
{

//cambia la foto de los usuarios en la base de datos
app.put('/fotou',jwts.valida,(req,res)=>{
  console.log('///////////////////////////************************')
  console.log('ENTRADA FOTO U');
  //console.log(req.body);
var foto = {
fotos:req.body.foto,
id:req.body.id
};
var admin = req.body.admin;
var med = req.body.medico;
console.log('admin '+admin+' medico '+med);
if((admin==undefined && med==undefined) || (admin==false && med==false) )
{
  console.log('ADENTRO usuario');
fotos.setFotoUsu(foto,(err,data)=>{
res.json(data);
});
}
else if (admin==false && med==true)
{
    console.log('ADENTRO medico');
  fotos.setFotoMed(foto,(err,data)=>{
    res.json(data);
  });
}
else if (admin==true && med==false )
{
    console.log('ADENTRO ADMIN');
  fotos.setFotoProv(foto,(err,data)=>{
  res.json(data);
  });
}
});

//cambia la foto de las mascotas en la base de datos
app.put('/fotom',jwts.valida,(req,res)=>{
  //console.log('///////////////////////////************************')
  //console.log(req.body);
var foto = {
fotos:req.body.imagen,
id:req.body.id
};
fotos.setFotoMasc(foto,(err,data)=>{
res.json(data);
});

});


app.post('/fotosp',(req,res)=>{
    let foto = req.body;
    fotos.fotoPagina(foto,(err,rfotos)=>{
        res.json(rfotos);
    })
});


app.get('/fotosser/:id',(req,res)=>{
  let id = req.params.id;
  fotos.darFotosServ(id,(err,data)=>{res.json(data)});
});

app.delete('/elmfotoser/:id',(req,res)=>{
// console.log('//////////*************////////////');
  // console.log(req.params);
  let ser = {
    id:req.params.id,
    ruta:req.params.ruta
  };
  fotos.delFotoServm(ser,(err,data)=>{
    res.json(data);
  });
});

app.post('/infotoser',(req,res)=>{
  let fotor = req.body.imagenes;
  foto = {
    fotos:fotor,
    ids: req.body.id
  };
  // console.log(foto.ids);
  //console.log(id);
  fotos.insertFotoSer(foto,(err,resp)=>{
    res.json(resp);
  });
});

app.get('/verfotof',(req,res)=>{
   fotos.verFotosF((err,resp)=>{
      res.json(resp);
   });
});

}
