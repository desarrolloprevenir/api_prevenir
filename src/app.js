let express = require('express');
let morgan = require('morgan');
let bodyparser = require('body-parser');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let formidable = require('express-form-data');
var  cron  = require ('node-cron');
var horas = require('./models/eventos');
var moment = require('moment');
var eject = require('./models/ejecucion');

//configuracion de la aplicacion
let config = require('./config');
let user = require('./routes/userRoutes');
let jwtRou = require('./routes/jwtRoutes');
let ses = require('./models/jwt');
let con = require('./models/user');

var app = express();
//middleawares

app.use(morgan('dev'));
app.use(express.static('src/public' ));
app.use(bodyparser.json({limit: '50mb'}));
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(formidable.parse({ keepExtensions: true}));
app.set('port',config.puerto);

// cron.schedule ( ' * * */2 * * ' , ( ) => {
//   console.log ( ' ejecutando cada minuto 1, 2, 4 y 5 ' ) ;
//   // horas.citaHistorial((err,res)=>{
//   //   console.log(res+' ok');
//   // });
// } ) ;

// ARREGLAR LOS CAMPOS QUE SOLICITA EN EL CAMBIO EL QUERY Y DEMAS OPCIONES
 cron.schedule(' 0 30 * * * *', () => {
   console.log('running a task every 30 minutes');
   console.log('notificaciones');
   horas.citaHistorial((err,res)=>{
     horas.citaHistorialM((err,resp)=>{
       console.log(res+' ok '+resp);
     });

    });
 });

// cron.schedule('* */1 * * *', () => {
// //   horas.citaHistorial((err,res)=>{
// //     horas.citaHistorialM((err,resp)=>{
// //       console.log(res+' ok '+resp);
// //     });
// //
//     // });
//     horas.citaHistorial((err,res)=>{
//       horas.citaHistorialM((err,resp)=>{
//         console.log(res+' ok '+resp);
//       });
//
//      });
//    });

//    console.log('corre cada minuto * */1 * * *');
//    eject.notificaCitaHumanos((err,row)=>{
//      eject.notiCitasPeluditos((err,row)=>{
//        console.log('Citas notificadas');
//      });
//    });
// });
//
// cron.schedule('22 * * * *', () => {
//   console.log('corre cada hora min 22 22 * * * *');
//   console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
// });

//REACTIVAR PARA ARREGLAR
cron.schedule('0 * * * *', () => {
  console.log('corre cada hora min 0 0 * * * *');
  console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
  eject.notificaCitaHumanos((err,row)=>{
    eject.notiCitasPeluditos((err,rows)=>{
      console.log('Citas notificadas');
    });
  });

});

// cron.schedule('* * 1 * *', () => {
//   console.log('corre cada hora * * 1 * * ');
//   console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
// });

//Permisos CORS para acceso a la Api
app.all('*', function(req, res,next) {
    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});

//let rutas = express.Router();
//rutas de el servidor
//rutas.route('/login').post(ses.login);
require('./routes/inventRoutes')(app);
require('./routes/pruebasRoutes')(app);
require('./routes/comentRoutes')(app);
require('./routes/medicoRoutes')(app);
require('./routes/citasIn')(app);
require('./routes/topiscRoutes')(app);
require('./routes/historialRoutes')(app);
require('./routes/pushRoutes')(app);
require('./routes/userRoutes')(app);
require('./routes/jwtRoutes')(app);
require('./routes/imgRoutes')(app);
require('./routes/servRoutes')(app);
require('./routes/depaRoutes')(app);
require('./routes/muniRoutes')(app);
require('./routes/cateRoutes')(app);
require('./routes/parenntRoutes')(app);
require('./routes/provedorRoutes')(app);
require('./routes/eventsRoutes')(app);
require('./routes/horarioRoutes')(app);
require('./routes/fotosRoutes')(app);
require('./routes/emailRoutes')(app);
require('./routes/benefRoutes')(app);
require('./routes/parenntRoutes')(app);
require('./routes/eMascRoutes')(app);
require('./routes/mascRoutes')(app);
require('./routes/opticaRoutes')(app);
require('./routes/sucurRoutes')(app);
require('./routes/consultRoutes')(app);
require('./routes/historiascRoutes')(app);
require('./routes/smsRoutes')(app);
// require('./route/pruebasRoutes')(app);

// require('./routes/eventsMascRoutes')(apps);
//app.use(rutas);

app.listen(app.get('port'),()=>{
	console.log('server on port',config.puerto);
});
