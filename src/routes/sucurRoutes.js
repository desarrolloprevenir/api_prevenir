const sucur = require('../models/sucursales')

module.exports = function (app)
{

// Grega solo una sucursal
  app.post('/addsucur',(req,res)=>{
      // console.log(req.body);
      var securs = req.body;
      sucur.agregarSucursales(securs,(err,resp)=>{
        res.json(resp);
      });
  });

//agregaa la sucrsual con sus consultorios
  app.post('/addsucon',(req,res)=>{
    // console.log(req.body);
    var sucurs = req.body;
    sucur.agregarSucursales(sucurs,(err,resp)=>{
      res.json(resp);
    });
  });

  app.get('/sucursales/:idp',(req,res)=>{
    let id = req.params.idp;
    sucur.verSucrxprovedor(id,(err,resp)=>{
        res.json(resp);
    });
  });

  app.get('/sucursal/:ids',(req,res)=>{
    let id = req.params.ids;
    sucur.verSucrId(id,(err,resp)=>{
        res.json(resp);
    });
  });


  app.get('/sucuserprovmuni/:idser/:idprov/:idmun',(req,res)=>{

    var ids = {
      id_ser:req.params.idser,
      id_prov:req.params.idprov,
      id_muni:req.params.idmun
    }
    // console.log('IDS QUE LLEGAN COMO PARAMTEROS');
    // console.log(ids);
    sucur.sucurServMun(ids,(err,resp)=>{
      res.json(resp)
    })
  });

  app.get('/sucumem/:idm',(req,res)=>{
    let id = req.params.idm;
    sucur.sucurIdMember(id,(err,resp)=>{
      // console.log(resp);
        res.json(resp);
    })
  });


  app.put('/sucursal',(req,res)=>{
      sucur.editarSucursal(req.body,(err,resp)=>{
          res.json(resp);
      });
  });

  app.delete('/sucursal/:id',(req,res)=>{

        sucur.eliminarSucursal(req.params.id,(err,resp)=>{
            res.json(resp);
        });
  });

  app.put('/contrasuc',(req,res)=>{
    sucur.cambioLogin(req.body,(err,respc)=>{
      res.json(respc);
    })
  })


}
