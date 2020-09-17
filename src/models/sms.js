let mysql = require('mysql');
let config = require('../config');
// var moment = require('moment');
var Request = require("request");
var connection = require('../controler/connection');


connection = mysql.createConnection({
    host: config.domain,
    user: config.userbd,
    password: config.passwordbd,
    database: config.nombredb
});


let smsModel = {};


smsModel.sendSms = (data, callback) => {
    // console.log(data);
    Request.post({
        "headers": { "content-type": "application/x-www-form-urlencoded" },
        "url": "https://api.hablame.co/sms/envio/",
        "form": {
            "cliente": "10012423",
            "api": "ecGcQa5dNN0zEDUk2OWWhx0j9mZmxO",
            "numero": data.nums,
            "sms": data.sms
        }
    }, (error, response, body) => {
        if (error) {
            throw error;
        }

        // console.log('+++++++++++++++++++++++++++++++++++++++SMS++++++++++++++++++++++++++++');
        // console.dir(JSON.parse(body));

        // let estado = JSON.parse(body);
        // // console.log(estado.sms);
        // console.log(response);

        // let resultado = JSON.parse(response.sta);
        // console.log('+++++++++++++++++++++++++++++++++++++++RESULTADO++++++++++++++++++++++++++++');
        // console.log(resultado.sms.
        //     '1'.resultado);





        // console.log(JSON.parse(body));

        callback(null, body.resultado);
    });

};

smsModel.pruebaApiHablame = (data, callback) => {

    Request.post({
        "headers": { "content-type": "application/x-www-form-urlencoded" },
        "url": "https://api101.hablame.co/api/sms/v2.1/send/",
        "form": {
            "account": "10017784",
            "apiKey": "Sv35vgV1LPbuUsPU0uCONoFQ0ud419",
            "token": "a0a8fa46a12a60900d97851c45a17f4a",
            "toNumber": data.nums,
            "sms": data.sms,
            "isPriority": 0
        }
    }, (error, response, body) => {
        if (error) {
            throw error;
        }

        console.log('+++++++++++++++++++++++++++++++++++++++RESPONSE++++++++++++++++++++++++++++');
        console.log(response);

        console.log('+++++++++++++++++++++++++++++++++++++++BODY++++++++++++++++++++++++++++');
        console.log(body);

        callback(null, body);
    });

};


module.exports = smsModel;