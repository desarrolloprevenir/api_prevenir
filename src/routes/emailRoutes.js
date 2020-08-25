const email = require('../models/email');
const jwts = require('../models/jwt');
var http = require('http');

module.exports = function(app) {

    app.post('/sendm', (req, res) => {
        var mail = {
            remite: req.body.remitente,
            destino: req.body.destino,
            asunto: req.body.asunto,
            texto: req.body.texto
        };

        // console.log(req.body);
        email.sendMail(mail, (err, data) => {
            res.json(data);
        });
    });

    app.get('/confirm/:id/:salt', (req, res) => {
        var conf = {
            id: req.params.id,
            salt: req.params.salt
        };
        // console.log(conf);
        email.confirm(conf, (err, data) => {
            res.json(data);
        });
    });


    app.post('/emails', (req, res) => {
        // console.log(req.body);
        let mails = [];
        obj = {
            mail: req.body.mail,
            name: req.body.name,
            cedu: req.body.identificacion,
            tel: req.body.tel,
            muni: req.body.Mun,
            depa: req.body.Depa,
            mensaje: req.body.mensaje,
            asunto: req.body.asunto
        };

        // console.log('maiiiiils //***********//////////////');
        // console.log(obj);
        mails.push(obj);
        // console.log(mails);
        email.senCorreos(mails, (err, data) => {
            res.json(data);
        });
    });

    app.get('/premail', (req, res) => {
        // console.log(conf);
        email.prueba1((err, data) => {
            res.json(data);
        });
    });


}