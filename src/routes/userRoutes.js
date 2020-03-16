const User = require('../models/user');
const jwts = require('../models/jwt');
const citas = require('../models/citas');
const eject = require('../models/ejecucion');
const moment = require('moment');
const jwt = require('../models/jwt');
const sms = require('../models/sms')


module.exports = function (app) {

// retorna los usuarion sin necesidad de ser admin
app.get('/',(req, res) => {User.getUsers((err, data) => {res.json(data);});});

//retorna el usuario usando jwts para la autentificacion del admin
app.get('/user',jwts.validaAdmin,(req, res)=>{User.getUsers((err, data) => {res.json(data);});});

//retorna la informacion del usuario segun su id
app.get('/user/:id',(req,res)=>{
var id=req.params.id;
// console.log('ES USUARIO');
User.darUserId(id,(err,resp)=>{
res.json(resp);
});
});

//retorna citas por el id del usuario

app.get('/citas/:id',(req,res)=>{
var id = req.params.id;
citas.darCitasUsu(id,(err,resp)=>{
res.json(resp);
})
});


//modifica la informacion de los usuarios en la base de datos
app.put('/user',jwts.valida,(req,res)=>{
//usu.cedula,usu.nombre,usu.apellidos,usu.direccion,usu.telefono,usu.telefonowatshapp,usu.feha_nacimiento,usu.id
// console.log(req.body);
var fecha = moment(req.body.fecha_nacimiento).format('YYYY-MM-DD');
fecha = fecha.toString();
// console.log(req.body);
let usu = {
tipoDocumento: req.body.tipoDocumento,
cedula:req.body.cedula,
nombre:req.body.nombre,
estadoCivil: req.body.estadoCivil,
ocupacion:req.body.ocupacion,
barrio: req.body.barrio,
eps: req.body.eps,
apellidos:req.body.apellidos,
direccion:req.body.direccion,
telefono:req.body.telefono,
telefonowatshapp:req.body.telefonowatshapp,
fecha_nacimiento: fecha,
id:req.body.id,
id_municipio: req.body.id_municipio

};
User.setUsuario(usu,(err,resp)=>{if(err){throw err}
else
{
res.json(resp);
}
});
});
//comprueba los datos faltantes de los usuasrios
app.get('/datos/:id',(req,res)=>{
var id = req.params.id;
User.darFechaNId(id,(err,resp)=>{
res.json(resp);
});
});

app.get('/prueba',(err,res)=>{
  let data = 'prueba';
sms.sendSms(data,(err,resp)=>{
res.json(resp);
});
});

//retorna la informacion del usuario segun su cedula con sus citas
app.get('/usua/:ced',(req,res)=>{
    var ced=req.params.ced;
    // console.log('ES USUARIO');
    User.darUsuario(ced,(err,resp)=>{
    res.json(resp);
    });
    });

//ruta para validar los correos.
app.get('/vemail/:email',(req,res)=>{
    var correo = req.params.email;
    User.validaCorreo(correo,(err,resp)=>{
       res.json(resp);
    });
});

app.put('/upcontra',jwt.valida,(req,res)=>{
  let user = req.body;
  console.log(user);
  User.cambioContraseña(user,(err,resp)=>{
    res.json(resp);
  });

})

}
