let mysql = require('mysql');
let config = require('../config');
var moment = require('moment');
var Request = require("request");
var connection = require('../controler/connection');


connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let smsModel = {};


smsModel.sendSms = (data,callback) =>{
  console.log(data);
  Request.post({
    "headers": { "content-type": "application/x-www-form-urlencoded"},
    "url": "https://api.hablame.co/sms/envio/",
    "form":{"cliente":"10012423",
	          "api":"ecGcQa5dNN0zEDUk2OWWhx0j9mZmxO",
	          "numero":data.nums,
	          "sms":data.sms}
}, (error, response, body) => {
    if(error) {
        throw err;
    }
    console.dir(JSON.parse(body));
    callback(null,body.resultado);
});

};

module.exports = smsModel;