const User = require('../models/user');
const jwts = require('../models/jwt');
const citas = require('../models/citas');
const eject = require('../models/ejecucion');
const moment = require('moment');
const jwt = require('../models/jwt');
const sms = require('../models/sms');
const provedor = require('../models/provedores');
const medico = require('../models/medicos');
const usuario = require('../models/user');
const ciclo = require('../controler/ciclos');


module.exports = function(app) {

    app.post('/sms', (req, res) => {
        let data = {
            sms: req.body.sms,
            nums: req.body.nums
        };
        sms.sendSms(data, (err, resp) => {
            res.json(resp);
        });
    });

    app.post('/smsconfirm', (req, respuesta) => {

        // console.log('req bodyyyyyyyyyyyyyyyyyyyyyyy', req.body.provedor);

        var cod;
        ciclo.generaSalt((err, gen) => {
            cod = gen;
        });
        var info = { celular: req.body.celular, id: req.body.id, memberId: req.body.membersId, cod };
        var data = {
            sms: 'su codigo en DESCUENTOS MEDICOS PREVENIR EXPRESS para activar su cuenta es ' + cod,
            nums: req.body.celular
        };

        // console.log('dataaaaaaaaaaaaaaaaa', data);

        // Si es provedor
        if (req.body.usuario === 'proveedor') {
            // console.log('dentro de provedor');
            provedor.actualizarCelular(info, (err, res) => {
                // console.log('respuesta del update', res);
                if (res) {

                    sms.sendSms(data, (err, resp) => {
                        // console.log('reeeeessss provedor sms');
                        // console.log(resp);
                        respuesta.json(resp);
                    });
                }
            });
        } else if (req.body.usuario === 'medico') {
            // SI es médico

            // console.log('info medico', info);
            medico.actualizarCelular(info, (err, res) => {
                // console.log('respuesta del update medico', res);
                if (res) {

                    sms.sendSms(data, (err, resp) => {
                        respuesta.json(resp);
                    });
                }
            });
        } else {
            // Si es usuario
            usuario.actualizarCelular(info, (err, res) => {
                if (res) {

                    sms.sendSms(data, (err, resp) => {
                        respuesta.json(resp);
                    });
                }
            });
        }
    });
};