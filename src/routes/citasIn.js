const internas = require('../models/citasinternas');
const citas = require('../models/citas');
let jwt = require('../models/jwt');

module.exports = function (app)
{

//devuelve listado de categorias
app.get('/cedula/:id/:masc',(req,res)=>{
  let id = {
      ids: req.params.id,
      masc: req.params.masc
    }

  // console.log(id.masc);
internas.darUsuariosID(id,(err,data)=>{
res.json(data);
});
});

app.get('/cedula',(req,res)=>{
  // console.log('da cedulas');
internas.darUsuarios((err,data)=>{
res.json(data);
});
});

app.post('/citai',jwt.validaAdmin,(req,res)=>{
  // console.log(req.body);
  let cita = req.body;
  console.log('NUEVA CITA INTERNA *********');
  console.log(cita);
  let masc = req.body.mascota;
  if(masc==true)
  {
    console.log('mascota = a true');
      internas.citaMascotas(cita,(err,resp)=>{
        res.json(resp);
      });
  }
  else
  {
    // console.log('cita de usuario');
    // console.log(cita);

    internas.nuevaCita(cita,(err,resp)=>{
      res.json(resp);
    });
  }

});


//devuelve las citas de un paciente por cedula segun el provedor
app.get('/ordencita/:ced/:suc',(req,res)=>{
  let usu = {
    id: req.params.ced,
    suc: req.params.suc
  }
    citas.CitasUsuarioProv(usu,(err,resp)=>{
      res.json(resp);
    })

})

//activa la cita de un paciente y la elimina de la tabla eventos
app.post('/activacita',(req,res)=>{
  let cita = req.body;
  // console.log(cita);
  internas.activaCitaP(cita,(err,resp)=>{
    res.json(resp);
  });

});

//devuelve las citas del provedor que esten en la tabla de citas activas
app.get('/citasprovac/:pr',(req,res)=>{
  let prov = req.params.pr;
  internas.citasProvAc(prov,(err,resp)=>{
    res.json(resp);
  });
});

app.get('/citasmedac/:idm',(req,res)=>{
  let idm = req.params.idm;
  internas.activasMedico(idm,(req,row)=>{
    res.json(row);
  });
});

//cabia el estado de espera a activa de las de la citas de la tabla activa
app.put('/cambestado/:idca/:idser/:cat',(req,res)=>{
  let activa = {
    idca: req.params.idca,
    idser: req.params.idser,
    cat:req.params.cat
  };
  internas.cambioestadocitas(activa,(req,row)=>{
    res.json(row);
  });

});

app.put('/fincita/:ctg/:idcta/:fue',(req,res)=>{
  let cita = {
    ctg:req.params.ctg,
    idcta:req.params.idcta,
    fue:req.params.fue
  };
  internas.finCita(cita,(req,resp)=>{
      res.json(resp);
  });
});


app.put('/siguiente/:idcn/:idser/:cat',(req,row)=>{
  let citaV = {
    ctg: req.params.cat,
    // idcta: res,
    fue: 1
  };
  let citaN = {
    idca: req.params.idcn,
    idser: req.params.idser,
    cat:req.params.cat
  };

internas.citaActiva(req.params.idser,(req,res)=>{
  // console.log(res);

  // console.log(citaV);
  // console.log(citaN);

if(JSON.stringify(res)!='[]')
{
  // console.log('adentro del if falla');
  citaV.idcta = res;
  // console.log('sakdklsajkld');
  // console.log(res);
  internas.finCita(citaV,(req,resp)=>{
    // console.log('/*/*/*/*/*/*/');
      // console.log(resp.actualizado);
       if(resp.actualizado == true || resp.actualizado == 'true')
       {
         internas.cambioestadocitas( citaN,(req,resp)=>{
           // console.log('cabiando estado de cita');
           row.json(resp);
         });
       }
       else
       {
        // {console.log('o no un error');}
       }

  });

}
else
{
  row.json({actualizado:false})
}

});




    // internas.finCita(citaV,(req,resp)=>{
    //     console.log(resp);
    //      if(cita.fue==1)
    //      {
    //        internas.cambioestadocitas(activa,(req,row)=>{
    //          res.json(row);
    //        });
    //      }
    // });
});


}
