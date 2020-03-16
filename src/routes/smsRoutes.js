const User = require('../models/user');
const jwts = require('../models/jwt');
const citas = require('../models/citas');
const eject = require('../models/ejecucion');
const moment = require('moment');
const jwt = require('../models/jwt');
const sms = require('../models/sms')


module.exports = function (app) {

  app.post('/sms',(req,res)=>{
    let data = { sms:req.body.sms,
                 nums:req.body.nums};
  sms.sendSms(data,(err,resp)=>{
  res.json(resp);
  });
  });

};
