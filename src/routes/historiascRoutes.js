const histc = require('../models/historiasClinicas');
const jwts = require('../models/jwt');
module.exports = function (app)
{

//devuelve los modulos activos de la historia clinica activos segun el servicio
app.get('/activhist/:id_s',(req,res)=> {
var id_serv = req.params.id_s;
histc.activosHisto(id_serv,(err,data)=>{
res.json(data);
});
});

//valores por nombre o por RIPS de la tabla de impresion diagnostica
app.get('/impdiagnostica',(req,res)=>{
    histc.darimpresionDiagnostica((err,imp)=>{
       res.json(imp);
    })
})

app.post('/histclinica',(req,res)=>{
  let historia = req.body;
  console.log(req.body);
  // console.log(hitsoria);
  histc.nuevaHistoria(req.body,(err,resp)=>{
    res.json(resp);
  });

});

app.post('/histclinica2',(req,res)=>{
  let historia = req.body;
  // console.log(req.body);
  // console.log(hitsoria);
  histc.nuevaHistoria1(req.body,(err,resp)=>{
    res.json(resp);
  });

});

app.get('/darhistclinica/:idu/:idser',(req,res)=>{
  console.log(req.params);
    histc.darHistClinIdU(req.params,(err,resp)=>{
            res.json(resp);
    });
});

app.get('/darhistclinicac/:idh/:idser',(req,res)=>{
  console.log(req.params);
    histc.darHistClinCompleta(req.params,(err,resp)=>{
            res.json(resp);
    });
});

//devuelve listado de categorias
app.get('/darhistcf/:idhc',(req,res)=>{
    // console.log(req.params.idc);
    histc.darHistoriaClinicaFin(req.params.idhc,(err,resp)=>{
      res.json(resp);
    });


});

app.get('/medicamentos',(req,res)=>{
  histc.darMedicamentos((err,medres)=>{
      res.json(medres);
  });
})


}
