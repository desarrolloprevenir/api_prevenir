let mysql = require('mysql');
let config = require('../config');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var moment = require('moment');
var smtpTransport = require('nodemailer-smtp-transport');
var connection = require('../controler/connection');


connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let emailModel = {};

emailModel.sendMail = (mail,callback)=>{



var  transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
              // user:'contactoprevenir@gmail.com',
              // clientId:'669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
              // clientSeret:'DGVpQslRBho94BcwiTcdzmJp',
              // refreshToken:'1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0'
              type: 'OAuth2',
              user: 'contactoprevenir@gmail.com',
              clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
              clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
              refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
              accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
            })
          }
          }));
//console.lo.log(mail);

  var mailOptions = {
              from: mail.remite, //config.from,
              to: mail.destino,
              subject: mail.asunto,
              text: mail.texto
       }

  transporter.sendMail(mailOptions, function(error, info){
      if (error){
          //console.lo.log(error);
          callback(null,false);
        //callback(null,'not send');
      } else {
          //console.lo.log("Email sent");
          callback(null,true);
      }
  });

};

emailModel.cuentaBlock = (usu,callback) =>{
  var  transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
              xoauth2: xoauth2.createXOAuth2Generator({
                type: 'OAuth2',
                user: 'contactoprevenir@gmail.com',
                clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
                refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
                accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
              })
            }
            }));

var mailOptions = {

  from: 'PREVENIR EXPRESS', //config.from,
  to: usu.to,
  subject: 'ACTIVACION CUENTA',
  text: usu.texto,
  html: '<img src="http://cdn.prevenirexpress.com:3000/avatars/banner1a.png" alt="prevenir logo" width="70%" height="50%">'+

  '</br></br><h3>BIENVENIDO A PREVENIR EXPRESS</h3></br><div>Gracias por ser parte de nuesta familia '+
          'en donde encontraras los mejores decuentos medicos de tu ciudad, por favor ingresa este codigo en la aplicacion: <h2>'+ usu.pss + '</h2></div>'};

transporter.sendMail(mailOptions, function(error, info){
    if (error){
        //console.lo.log(error);
        callback(null,false);
      //callback(null,'not send');
    } else {
        //console.lo.log("Email sent");
        callback(null,true);
    }
});


};

emailModel.BienvenidoBlock = (usu,callback) =>{
  var  transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
              xoauth2: xoauth2.createXOAuth2Generator({
                type: 'OAuth2',
                user: 'contactoprevenir@gmail.com',
                clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
                refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
                accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
              })
            }
            }));

var mailOptions = {

  from: 'PREVENIR EXPRESS', //config.from,
  to: usu.to,
  subject: 'BIENVENIDO A PREVENIR EXPRESS - ACTIVACION CUENTA',
  text: usu.texto,
  html: '<img src="http://cdn.prevenirexpress.com:3000/avatars/banner1a.png" alt="prevenir logo" width="70%" height="50%">'+

  '</br></br><h3>BIENVENIDO A PREVENIR EXPRESS</h3></br><div>Gracias por ser parte de nuesta familia '+
          'en donde encontraras los mejores decuentos medicos de tu ciudad, por DESCARGA nuestra aplicacion desde la play store de android o ios e ingresa por recuperar contraseña, despues de seguir los pasos favor ingresa este codigo en la aplicacion: <h2>'+ usu.pss + '</h2></div>'};

transporter.sendMail(mailOptions, function(error, info){
    if (error){
        //console.lo.log(error);
        callback(null,false);
      //callback(null,'not send');
    } else {
        //console.lo.log("Email sent");
        callback(null,true);
    }
});


};








emailModel.contraseña = (usu,callback) =>{
  // console.log('dentro de envio de correos');
};

emailModel.confirm = (conf,callback) =>{
  if(connection)
{
  let sql = 'SELECT id FROM members WHERE id = ? and salt = ?;'
  connection.query(sql,[conf.id,conf.salt],(err,row)=>{

    if(err)
    {
      callback(null,false);
    }
    else
    {
      row = row[0];
      //console.lo.log(row.id);
      if(row.id==conf.id)
      {
        //console.lo.log('iguales');
        let sql = 'UPDATE members SET locked= 1 WHERE id=?;';
        connection.query(sql,[row.id],(err,rows)=>{
          if(err)
          {

          }
          else
          {
            //console.lo.log(rows);
          if(rows.affectedRows==1)
          {
              //window.close();
              callback(null,true);
          }
          else
          {
          callback(null,false);
          }
          }
        });

      }
      else
      {
        //console.lo.log('algo falla');
        callback(null,false);
      }

    }
  });
}
};



emailModel.sendMailCita = (mail,callback)=>{

// console.log('///**/*/*/*/*/*/*/*/* enviando correro');

var  transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
              // user:'contactoprevenir@gmail.com',
              // clientId:'669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
              // clientSeret:'DGVpQslRBho94BcwiTcdzmJp',
              // refreshToken:'1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0'
              type: 'OAuth2',
              user: 'contactoprevenir@gmail.com',
              clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
              clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
              refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
              accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
            })
          }
          }));
//console.lo.log(mail);
let mailOptions = mail;

  transporter.sendMail(mailOptions, function(error, info){
      if (error){
          //console.lo.log(error);
          callback(null,false);
        //callback(null,'not send');
      } else {
          //console.lo.log("Email sent");
          callback(null,true);
      }
  });

};



emailModel.emailCitaPr = (mail,callback) =>{
  let cfrom ='';
  let prov = '';
  if(connection)
  {
    // console.log(mail);
    let corr = 'SELECT provedores.correo, provedores.nombre FROM provedores, servicios WHERE servicios.id_provedores = provedores.id_provedor AND servicios.id_servicios = ?;';
    connection.query(corr,[mail.id_serv],(err,rowc)=>{
      rowc = rowc[0];
      cfrom = rowc.correo;
      prov = rowc.nombre
      let fecha = moment(mail.start).format('DD-MM-YYYY');
      let hora = moment(mail.start).format('HH:mm a');
      var mailOptions = {

        from: 'PREVENIR EXPRESS NUEVA', //config.from,
        to: cfrom,
        subject: 'NUEVA CITA',
        text: '',
        html: '<img src="http://cdn.prevenirexpress.com/avatars/banner1a.png" alt="prevenir logo" width="60%" height="40%"> <br/>'+
              '<h2>Tienes una nueva cita a traves de la app "PREVENIR EXPRESS DESCUENTOS MEDICOS"</h2> <br/>'+
              'Señor@(es): '+prov+
              '<br/><div> Se a registrado una nueva cita, para el '+fecha+' a las '+hora+' en nuestra aplicacion, por favor revisa tus citas en nuesta app'};

              var  transporter = nodemailer.createTransport(smtpTransport({
                  service: 'gmail',
                  host: "smtp.gmail.com",
                  port: 465,
                  secure: true,
                  auth: {
                          xoauth2: xoauth2.createXOAuth2Generator({
                            // user:'contactoprevenir@gmail.com',
                            // clientId:'669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                            // clientSeret:'DGVpQslRBho94BcwiTcdzmJp',
                            // refreshToken:'1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0'
                            type: 'OAuth2',
                            user: 'contactoprevenir@gmail.com',
                            clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                            clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
                            refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
                            accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
                          })
                        }
                        }));


                        transporter.sendMail(mailOptions, function(error, info){
                            if (error){
                                // console.log(error);
                                callback(null,false);
                              //callback(null,'not send');
                            } else {
                                // console.log("Email sent");
                                callback(null,true);
                            }
                        });

    });
  }
};


emailModel.senCorreos = (mails,callback) => {
  if(connection)
  {
    console.log('/*/*/*/*/*/*/*/*/*/*');
    console.log(mails);
    var  transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
                xoauth2: xoauth2.createXOAuth2Generator({
                  // user:'contactoprevenir@gmail.com',
                  // clientId:'669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                  // clientSeret:'DGVpQslRBho94BcwiTcdzmJp',
                  // refreshToken:'1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0'
                  type: 'OAuth2',
                  user: 'contactoprevenir@gmail.com',
                  clientId: '669854799910-42brst8bu1gpn3eh49n5efrd88cn2sg2.apps.googleusercontent.com',
                  clientSecret: 'DGVpQslRBho94BcwiTcdzmJp',
                  refreshToken: '1/5SsC1sH4qOr4jDwn9bda19nXrQX3zkRSomdDZ1DY1R0',
                  accessToken: 'ya29.Gls-BrbFCF8zI7Rb1LbYJFWNl9JsPRAYdoZTcFe_nXd-XDmmyHlC9YKsWSwSt0Y7VCqcwTNWbtnMEflHjv-JQkhngdMa-iyZQjo_7JhXARYKdvCexkamvfeHn8V2'
                })
              }
              }));

    // console.log(mail);
    let send = [];
    let cont = 1;
    // console.log(mails.length);
    if(mails.length>=0)
    {
      for (var i = 0; i < mails.length; i++) {
        let mail = mails[i];
        var mailOptions = {

          from: 'PREVENIR EXPRESS NUEVA', //config.from,
          to: 'contactoprevenir@gmail.com',
          subject: mail.asunto,
          text: mail.mensaje +" "+mail.mail,
          html: '<img src="http://cdn.prevenirexpress.com:3000/avatars/banner1a.png" alt="prevenir logo" width="60%" height="40%"> <br/>'+
                '<h2>Nombre: '+mail.name+'</h2> <br/>'
                +'<h2>Cedula:'+mail.cedu+'</h2> <br/>'
                +'<h2>Email:'+mail.mail+'</h2> <br/>'
                +'<h2>tel:'+mail.tel+'</h2> <br/>'
                +'<h2>Municipio:'+mail.muni+'</h2> <br/>'
                +'<h2>Departamento:'+mail.depa+'</h2> <br/>'
                +'Señor@(es): Prevenir Express'
                +'<br/><div> '+ mail.mensaje +' <div>'
              };

              transporter.sendMail(mailOptions, function(error, info){
                  if (error){
                      // console.log(error);
                      send.push({send:'no'});
                    //callback(null,'not send');
                  } else {
                      // console.log("Email sent");
                      send.push({send:'si',mail: mail.mail});
                      // console.log(cont);
                      if(cont==mails.length)
                      {
                        callback(null,send);
                      }
                        cont++;
                  }
              });


      }


    }
  }

};







module.exports = emailModel;
