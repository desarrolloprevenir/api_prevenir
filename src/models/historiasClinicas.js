let mysql = require('mysql');
let config = require('../config');
let eject = require('./ejecucion');
var moment = require('moment');

connection = mysql.createConnection({
host: config.domain,
user: config.userbd,
password: config.passwordbd,
database: config.nombredb
});


let histClinModule = {};

histClinModule.nuevaHistoria1 = (hisc,callback) => {

 var ids={}
 let promesa = new Promise(function(resolve, reject) {
   console.log('hic');
   console.log(hisc);
   let inshist = 'INSERT INTO historia_clinica (tipo_consulta, motiv_oconsulta, enfermedades_preex, usuarios_id, id_servicios) VALUES (?, ?, ?, ?, ?);';
   connection.query(inshist,[hisc.tipo_consulta,hisc.motivo_consulta,hisc.enfermedades_preex,hisc.usuario_id,hisc.id_servicios],(err,histoc)=>{
     console.log(histoc);
     ids.id_historiac = histoc.insertId;
     console.log(hisc);
     return (err) ? reject(err) :  resolve(histoc);
   });
 });
 promesa.then(async(res1, rej1)=>{
      new Promise(function(resolve, reject) {

        if(JSON.stringify(hisc.antecedentes_f)!='{}')
        {
          console.log('ANTECEDENTES FAMILIARES');
          let antf = hisc.antecedentes_f;
          let sqlAntF = 'INSERT INTO antecedentes_f (cardiopatias, diabetes, hipertension, asma, enfermadad_psiquiatrica, efisema, cancer, epilepcia, otro) VALUES (?,?,?,?,?,?,?,?,?)';
          connection.query(sqlAntF,[antf.cardiopatias,antf.diabetes,antf.hipertension,antf.asma,antf.enfermedad_psiquiatrica,antf.efisema,antf.cancer,antf.epilepcia,antf.otro],(err,antf)=>{
          ids.id_antecedentesf = antf.insertId;
          console.log(ids);
          return (err) ? reject(err): resolve(hisc);
          })
        }
        else{
          ids.id_antecedentesf = NULL;
          return resolve(hisc);
        }
      }).then(async(res2,rej2)=>{
            new Promise(function(resolve, reject) {
              if(JSON.stringify(hisc.antecedentes_p)!='{}')
              {
                console.log('ANTECEDENTES PERSONALES');
                let antp = hisc.antecedentes_p;
                let sqlAntp = 'INSERT INTO prevenirexpres.antecedentes_p (patologias, quirurgicos, traumaticos, gine_menarquia, gine_gravidez, gine_partos, gine_abortos, gine_hijosvivos, gine_planificacion, toxicos_alergicos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                connection.query(sqlAntp,[antp.patologias, antp.quirurgicos, antp.traumaticos, antp.gine_menarquia,antp.gine_gravidez, antp.gine_partos, antp.gine_abortos, antp.gine_hijosvivos, antp.gine_planificacion, antp.toxicos_alergicos],(err,rantp)=>{
                  ids.id_antecedentesp = rantp.insertId;
                  console.log(ids);
                  return (err) ? reject(err): resolve(hisc);
                });
              }
              else {
                ids.id_antecedentesp = 'NULL';
                console.log(ids);
                return resolve(hisc);
              }
          }).then(async(res3,rej3)=>{
                new Promise(function(resolve, reject) {
                  if(JSON.stringify(hisc.habitosyfactores)!='{}')
                  {
                    let hyf = hisc.habitosyfactores
                    let sqlhabyf = 'INSERT INTO habitosyfactores (cigarrillo, alcohol, estres, humo, polvo, ejercicio, otros) VALUES (?, ?, ?, ?, ?, ?, ?);';
                    connection.query(sqlhabyf,[hyf.cigarrillo, hyf.alcohol, hyf.estres, hyf.humo, hyf.polvo, hyf.ejercicio, hyf.otros],(err,rhyf)=>{
                      ids.id_habitosyfactores = rhyf.insertId;
                      console.log(ids);
                      return (err) ? reject(err): resolve(hisc);
                    });
                  }
                  else {
                    ids.id_habitosyfactores = 'NULL';
                    console.log(ids);
                    return resolve(hisc);
                  }
                    }).then(async(res4,rej4)=>{
                          new Promise(function(resolve, reject) {
                            if(JSON.stringify(hisc.revisionpsistemas)!='{}')
                            {
                              let rps = hisc.revisionpsistemas;
                              let sqlrps = 'INSERT INTO revisionpsistemas (card_resp_desc, vasc_desc, gastro_int_desc, genito_uri_desc, endocrino_desc, osteomuscular_desc, neurologico_dec, pielyfan_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
                              connection.query(sqlrps,[rps.card_resp_desc, rps.vascular_desc, rps.gastro_int_desc, rps.genito_uri_desc, rps.endocrino_desc, rps.osteomuscular_desc, rps.neurologico_desc, rps.pielyfan_desc],(err,rrps)=>{
                                ids.id_revisionpsistemas = rrps.insertId;
                                console.log(ids);
                                return (err) ? reject(err): resolve(hisc);
                              })
                            }
                            else
                            {
                              ids.id_revisionpsistemas = 'NULL';
                              console.log(ids);
                              return resolve(hisc);
                            }
                          }).then(async(res5,rej5)=>{
                            new Promise(function(resolve, reject) {
                              {
                                if(JSON.stringify(hisc.examenf)!='{}')
                                {
                                  let ef = hisc.examenf;
                                  // console.log(ef);
                                  let sqlef = 'INSERT INTO examenf (apariencia_g,frecuencia_cardiaca, frecuencia_resp, presion_art, temperatura, talla, peso, cabeza_desc, ojos_desc, oidos_desc, nariz_desc, boca_desc, cuello_desc, torax_ma_desc, pulmones_desc, corazon_desc, abdomen_desc, genitourinario_desc, columna_desc, extremidades_desc, neurologico_desc, pielyfane_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                  connection.query(sqlef,[ef.apariencia_g,ef.frecuencia_cardica, ef.frecuencia_resp, ef.presion_art, ef.temperetura, ef.talla, ef.peso, ef.cabeza_desc, ef.ojos_desc, ef.oidos_desc, ef.nariz_desc, ef.boca_desc, ef.cuello_desc, ef.torax_ma_desc, ef.pulmones_desc, ef.corazon_desc,  ef.abdomen_desc, ef.genitourinario_desc, ef.columna_desc, ef.extremidades_desc, ef.neurologico_desc, ef.pielyfane_desc],(err,ref)=>{
                                    ids.id_examenf = ref.insertId;
                                    console.log(ids);
                                    return (err) ? reject(err): resolve(hisc);
                                  })
                                }
                                else{
                                  ids.id_examenf = 'NULL';
                                  console.log(ids);
                                  return resolve(hisc);
                                }
                              }
                            }).then(async(res5,rej5)=>{
                              new Promise(function(resolve, reject) {
                                      if(JSON.stringify(hisc.impresion_diag)!='[]' || hisc.impresion_diag != undefined)
                                      {
                                        let j = 0;
                                        let impd = hisc.impresion_diag;
                                        var isql = 'INSERT INTO historiacli_has_impresiondiag (id_historiacl, id_impresiondiag) VALUES (?, ?);';
                                        for (var i = 0; i < impd.length; i++) {
                                          connection.query(isql,[ids.id_historiac,impd[i]],(err,idrow)=>{
                                            return (err) ? reject(err): resolve(hisc);
                                      });
                                    }
                                  }
                                  else {
                                    console.log(ids);
                                    return resolve(hisc);
                                  }
                            }).then(async(res6,rej6)=>{
                                new Promise(function(resolve, reject) {
                                  if(JSON.stringify(hisc.historia_opt)!= '{}')
                                  {
                                  var sql = 'INSERT INTO historia_opt (lensometriaOd, lensometriaOi, agudeazaVisualOd, agudeazaVisualOi, visionLejanaOd, visionLejanaOi, visionCercanaOd, visionCercanaOi,adicion, tipoLente, examenExternoOd, examenExternoOi, oftalmologiaOd, oftalmologiaOi, examenMotorOd, examenMotorOi, queratometriaOd, queratometriaOi, refraccionOd, refraccionOi, formulaFinalOd, formulaFinalOi, avvlOd, avvlOi, avvpOd, avvpOi, adicionOd, adicionOi, dnpOd, dnpOi, testIshihara,';
                                  var sql2 ='testEstereopsis,diagnosticoInical,conducta,medicamentos,remision,observaciones,rips,id_usuario,id_servicios) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                                  // console.log(sql+sql2);
                                  let opt = hisc.historia_opt;
                                  connection.query(sql+sql2,[opt.lensometriaOd,opt.lensometriaOi,opt.agudezaVisualOd,opt.agudezaVisualOi,opt.visionLejanaOd,opt.visionLejanaOi,opt.visionCercanaOd,opt.visionCercanaOi,opt.adicion,opt.tipoLente,opt.examenExternoOd,opt.examenExternoOi,opt.oftalmologiaOd,opt.oftalmologiaOi,opt.examenMotorOd,opt.examenMotorOi,opt.queratometriaOd,opt.queratometriaOi,opt.refracionOd,opt.refraccionOi,opt.formulaFinalOd,opt.formulaFinalOi,opt.avvlOd,opt.avvlOi,opt.avvpOd,opt.avvpOi,opt.adicionOd,opt.adicionOi,opt.dnpOd,opt.dnpOi,opt.testIshihara,opt.testEstereopsis,opt.diagnosticoInicial,opt.conducta,opt.medicamentos,opt.remision,opt.observaciones,opt.rips, opt.id_usuario,opt.id_servicio],(err,rop)=>{
                                          ids.id_historia_opt = rop.insertId;
                                          console.log(ids);
                                          return (err) ? reject(err): resolve(ids);
                                  });
                                }
                                else {
                                    ids.id_historia_opt = 'NULL';
                                    console.log(ids);
                                    return resolve(hisc);

                                }
                              }).then(async(res7,rej7)=>{
                                console.log(res7);
                                let sqlup = 'UPDATE historia_clinica SET id_historia_opt = ?, id_antecedentesf = ?, id_antecedentesp = ?, id_habitosyfactores = ?, id_revisionpsistemas = ?, id_examenf = ? WHERE id_historiacl` = ?;';
                                new Promise(function(resolve, reject) {
                                  connection.query(sqlup,[res7.id_historia_opt,res7.id_antecedentesf,res7.id_antecedentesp,res7.id_habitosyfactores,res7.id_revisionpsistemas,res7.id_examenf],(err,resup)=>{
                                    console.log(resup);
                                  })
                                });
                  });
                });
              });
            });
          });
        });
      });
    });



};

histClinModule.nuevaHistoria = (hisc,callback) => {
  if(connection)
  {
    // console.log(hisc);

    var ids={};
    let inshist = 'INSERT INTO historia_clinica (tipo_consulta, motiv_oconsulta, enfermedades_preex, usuarios_id, id_servicios) VALUES (?, ?, ?, ?, ?);'
    connection.query(inshist,[hisc.tipo_consulta,hisc.motivo_consulta,hisc.enfermedades_preex,hisc.usuario_id,hisc.id_servicios],(err,histoc)=>{
      if(err){throw err }
      else {
        ids.id_historiac = histoc.insertId;
        console.log(hisc);
        if(JSON.stringify(hisc.antecedentes_f)!='{}')
        {
          console.log('ANTECEDENTES FAMILIARES');
          let antf = hisc.antecedentes_f;
          let sqlAntF = 'INSERT INTO antecedentes_f (cardiopatias, diabetes, hipertension, asma, enfermadad_psiquiatrica, efisema, cancer, epilepcia, otro) VALUES (?,?,?,?,?,?,?,?,?)';
          connection.query(sqlAntF,[antf.cardiopatias,antf.diabetes,antf.hipertension,antf.asma,antf.enfermedad_psiquiatrica,antf.efisema,antf.cancer,antf.epilepcia,antf.otro],(err,antf)=>{
            if(err){throw err}
            else
            {
              // console.log(antf);
              let updthc = 'UPDATE historia_clinica SET id_antecedentesf = ? WHERE id_historiacl = ?;';
              connection.query(updthc,[antf.insertId,ids.id_historiac],(err,ok)=>{
                if(err){throw err}
                else
                {
                  console.log('OK AF');
                }
              })
            }
          })
        }
        if(JSON.stringify(hisc.antecedentes_p)!='{}')
        {
          console.log('ANTECEDENTES PERSONALES');
          let antp = hisc.antecedentes_p;
          let sqlAntp = 'INSERT INTO prevenirexpres.antecedentes_p (patologias, quirurgicos, traumaticos, gine_menarquia, gine_gravidez, gine_partos, gine_abortos, gine_hijosvivos, gine_planificacion, toxicos_alergicos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
          connection.query(sqlAntp,[antp.patologias, antp.quirurgicos, antp.traumaticos, antp.gine_menarquia,antp.gine_gravidez, antp.gine_partos, antp.gine_abortos, antp.gine_hijosvivos, antp.gine_planificacion, antp.toxicos_alergicos],(err,rantp)=>{
            if(err){throw err}
            else
            {

              let updthc = 'UPDATE historia_clinica SET id_antecedentesp = ? WHERE id_historiacl = ?;';
              connection.query(updthc,[rantp.insertId,ids.id_historiac],(err,ok)=>{
                if(err){throw err}
                else
                {
                  console.log('OK AP');
                }
              })
            }
          });

        }
        if(JSON.stringify(hisc.habitosyfactores)!='{}')
        {
          let hyf = hisc.habitosyfactores
          let sqlhabyf = 'INSERT INTO habitosyfactores (cigarrillo, alcohol, estres, humo, polvo, ejercicio, otros) VALUES (?, ?, ?, ?, ?, ?, ?);';
          connection.query(sqlhabyf,[hyf.cigarrillo, hyf.alcohol, hyf.estres, hyf.humo, hyf.polvo, hyf.ejercicio, hyf.otros],(err,rhyf)=>{
            if(err){throw err}
            else
            {
              let updthc = 'UPDATE historia_clinica SET id_habitosyfactores = ? WHERE id_historiacl = ?;';
              connection.query(updthc,[rhyf.insertId,ids.id_historiac],(err,ok)=>{
                if(err){throw err}
                else
                {
                  console.log('OK hyf');
                }
              })

            }
          })
        }
        if(JSON.stringify(hisc.revisionpsistemas)!='{}')
        {
          let rps = hisc.revisionpsistemas;
          let sqlrps = 'INSERT INTO revisionpsistemas (card_resp_desc, vasc_desc, gastro_int_desc, genito_uri_desc, endocrino_desc, osteomuscular_desc, neurologico_dec, pielyfan_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
          connection.query(sqlrps,[rps.card_resp_desc, rps.vascular_desc, rps.gastro_int_desc, rps.genito_uri_desc, rps.endocrino_desc, rps.osteomuscular_desc, rps.neurologico_desc, rps.pielyfan_desc],(err,rrps)=>{
              if(err){throw err}
              else
              {

                let updthc = 'UPDATE historia_clinica SET id_revisionpsistemas = ? WHERE id_historiacl = ?;';
                connection.query(updthc,[rrps.insertId,ids.id_historiac],(err,ok)=>{
                  if(err){throw err}
                  else
                  {
                    console.log('OK rps');
                  }
                })

              }

          })
        }
        if(JSON.stringify(hisc.examenf)!='{}')
        {
          let ef = hisc.examenf;
          // console.log(ef);
          let sqlef = 'INSERT INTO examenf (apariencia_g,frecuencia_cardiaca, frecuencia_resp, presion_art, temperatura, talla, peso, cabeza_desc, ojos_desc, oidos_desc, nariz_desc, boca_desc, cuello_desc, torax_ma_desc, pulmones_desc, corazon_desc, abdomen_desc, genitourinario_desc, columna_desc, extremidades_desc, neurologico_desc, pielyfane_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          connection.query(sqlef,[ef.apariencia_g,ef.frecuencia_cardica, ef.frecuencia_resp, ef.presion_art, ef.temperetura, ef.talla, ef.peso, ef.cabeza_desc, ef.ojos_desc, ef.oidos_desc, ef.nariz_desc, ef.boca_desc, ef.cuello_desc, ef.torax_ma_desc, ef.pulmones_desc, ef.corazon_desc,  ef.abdomen_desc, ef.genitourinario_desc, ef.columna_desc, ef.extremidades_desc, ef.neurologico_desc, ef.pielyfane_desc],(err,ref)=>{
            if(err){throw err}
            else {
              let updthc = 'UPDATE historia_clinica SET id_examenf = ? WHERE id_historiacl = ?;';
              connection.query(updthc,[ref.insertId,ids.id_historiac],(err,ok)=>{
                if(err){ throw err}
                else
                {
                  console.log('OK ef');
                }
              })

            }
          })
        }
        console.log(hisc);
        console.log(hisc.impresion_diag);
          if(JSON.stringify(hisc.impresion_diag)!='[]' || hisc.impresion_diag != undefined)
          {
            let j = 0;
            let impd = hisc.impresion_diag;
          var isql = 'INSERT INTO historiacli_has_impresiondiag (id_historiacl, id_impresiondiag) VALUES (?, ?);';
          for (var i = 0; i < impd.length; i++) {
                connection.query(isql,[ids.id_historiac,impd[i]],(err,idrow)=>{
                  if(err){throw err}

                  else
                  {
                    j++;
                      console.log('ok ',j);
                  }
                })
                console.log('OK id');
          }
          }
          console.log(hisc.historia_opt);
            if(JSON.stringify(hisc.historia_opt)!= '{}')
            {
            var sql = 'INSERT INTO historia_opt (lensometriaOd, lensometriaOi, agudeazaVisualOd, agudeazaVisualOi, visionLejanaOd, visionLejanaOi, visionCercanaOd, visionCercanaOi,adicion, tipoLente, examenExternoOd, examenExternoOi, oftalmologiaOd, oftalmologiaOi, examenMotorOd, examenMotorOi, queratometriaOd, queratometriaOi, refraccionOd, refraccionOi, formulaFinalOd, formulaFinalOi, avvlOd, avvlOi, avvpOd, avvpOi, adicionOd, adicionOi, dnpOd, dnpOi, testIshihara,';
            var sql2 ='testEstereopsis,diagnosticoInical,conducta,medicamentos,remision,observaciones,rips,id_usuario,id_servicios) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            // console.log(sql+sql2);
            let opt = hisc.historia_opt;
            connection.query(sql+sql2,[opt.lensometriaOd,opt.lensometriaOi,opt.agudezaVisualOd,opt.agudezaVisualOi,opt.visionLejanaOd,opt.visionLejanaOi,opt.visionCercanaOd,opt.visionCercanaOi,opt.adicion,opt.tipoLente,opt.examenExternoOd,opt.examenExternoOi,opt.oftalmologiaOd,opt.oftalmologiaOi,opt.examenMotorOd,opt.examenMotorOi,opt.queratometriaOd,opt.queratometriaOi,opt.refracionOd,opt.refraccionOi,opt.formulaFinalOd,opt.formulaFinalOi,opt.avvlOd,opt.avvlOi,opt.avvpOd,opt.avvpOi,opt.adicionOd,opt.adicionOi,opt.dnpOd,opt.dnpOi,opt.testIshihara,opt.testEstereopsis,opt.diagnosticoInicial,opt.conducta,opt.medicamentos,opt.remision,opt.observaciones,opt.rips, opt.id_usuario,opt.id_servicio],(err,rop)=>{
              if(err){throw err}
              else
              {
                let updthc = 'UPDATE historia_clinica SET id_historia_opt = ? WHERE id_historiacl = ?;';
                connection.query(updthc,[rop.insertId,ids.id_historiac],(err,ok)=>{
                  if(err){ throw err}
                  else
                  {
                    console.log('OK op');
                  }
                })
              }
            });
          }
        console.log('finalizado');
        callback(null,true);
      }
    });
  }
};



histClinModule.activosHisto = (id_serv,callback) => {

  let sql = 'SELECT * FROM mod_activ WHERE id_servicios = ?;';
  connection.query(sql,[id_serv],(err,actv)=>{
    if(err){throw err}
    else
  {
    callback(null,actv);
  }
  })
}

histClinModule.darHistClinIdU = (ids, callback) => {
  if(connection)
  {
    console.log(ids);
    let sql = 'SELECT * FROM historia_clinica WHERE usuarios_id = ? AND id_servicios = ?';
    connection.query(sql,[ids.idu, ids.idser],(err,rhcl)=>{
        if(err){throw err}
        else
        {
          callback(null,rhcl);
        }
    });
  }
};

histClinModule.darHistClinCompleta = (ids, callback) => {
    if(connection)
    {
      console.log(ids);
      let sql = 'SELECT * FROM mod_activ WHERE id_servicios = ?;';
      connection.query(sql,[ids.idser],(err,ract)=>{
        if(err){throw err}
        else
        {
          ract = ract[0];
          console.log(ract.historia_opt);
          if(ract.historia_opt==1)
          {

          }
        }

      });
    }
};

histClinModule.darimpresionDiagnostica = (callback) => {
  if(connection)
  {
    let sql = 'SELECT * from impresion_diagnostica' ;
    connection.query(sql,(err,resp)=>{
      if(err){throw err}
      else {
        {
          callback(null,resp);
        }
      }
    })
  }
};


histClinModule.darHistoriaClinicaFin = (idc,callback) =>
{
  if(connection)
  {
    //PEGAR AQUI
    // console.log(id);
    var sql = 'SELECT * FROM historia_clinica WHERE historia_clinica.id_historiacl = ?;';
    var sqlaf = 'SELECT * FROM antecedentes_f WHERE id_antecedentesf = ?;';
    var sqlap = 'SELECT * FROM antecedentes_p WHERE id_antecedentesp = ?;';
    var sqlop = 'SELECT * FROM historia_opt WHERE idhistoria_opt = ?';
    var promise = new Promise(async function (res,rej){
      await connection.query(sql,idc,(err,data) => {
        // console.log(data);
        return (err) ? rej(err) :  res(data);
      })
    });
    var promiseAf = new Promise(async function(resaf,rejaf){
        // await connection.query(sql,)
    });
  promise.then(async(res1,rej1)=> {
              // console.log(res1);
              new Promise(async function(resolve, reject) {
                res1 = res1[0];
                  if(res1.id_antecedentesf != null)
                  {
                    // console.log('denrtro del if');
                    // console.log(res1.id_antecedentesf);
                    connection.query(sqlaf,[res1.id_antecedentesf],(err,resaf)=>{
                      res1.antecedentef = resaf[0];
                      return (err) ? reject(err) :  resolve(res1);
                    })
                  }
                    else{
                      res1.antecedentef = {};
                      return resolve(res1)
                    }
              }).then(async(res2,rej2)=>{
                        new Promise(function(resolve, reject) {
                          // console.log('RES 2');
                                // console.log(res2);
                                // console.log(res2.id_antecedentesp);
                        if(res2.id_antecedentesp != null)
                        {
                          connection.query(sqlap,[res2.id_antecedentesp],(err,resap)=>{
                            // console.log(resap);
                            res2.antecedentesp = resap[0];
                            return (err) ? reject(err) : resolve(res2);
                          })
                        }
                        else {
                          // console.log('FUNCIONO');
                          res2.antecedentesp = {};
                          return resolve(res2)
                        }
                        }).then(async(res3,rej3)=>{
                                new Promise(function(resolve, reject) {
                                  // console.log('RES 3');
                                        // console.log(res3);
                                        // console.log(res3.id_historia_opt);
                                        if(res3.id_historia_opt != null)
                                          {
                                            connection.query(sqlop,[res3.id_historia_opt],(err,resop)=>{
                                              // console.log(resop);
                                              res3.histoptica = resop[0];
                                              return (err) ? reject(err) : resolve(res3);
                                            })
                                          }
                                          else {
                                            // console.log('NO OPTICA');
                                            res3.histoptica = {};
                                            return resolve(res3)
                                          }
                                }).then(async(res4,rej4)=>{
                                    new Promise(function(resolve, reject) {
                                            // console.log('RES 4');
                                            // console.log(res4);
                                            if(res4.id_habitosyfactores != null)
                                            {
                                              let sqlhyf = 'SELECT * FROM habitosyfactores WHERE id_habitosyfactores = ?;';
                                              connection.query(sqlhyf,[res4.id_habitosyfactores],(err,reshf)=>{
                                                res4.habitosyfactores = reshf[0];
                                                return (err) ? reject(err): resolve(res4);
                                              })
                                            }
                                            else
                                            {
                                              // console.log('NO Habitos');
                                              res4.habitosyfactores = {};
                                              return resolve(res4)
                                            }

                                    }).then(async(res5,rej5)=>{
                                      new Promise(function(resolve, reject) {
                                        // console.log('RES5');
                                        // console.log(res5);
                                        if(res5.id_revisionpsistemas != null){
                                          let sqlrs = 'SELECT * FROM revisionpsistemas WHERE id_revisionpsistemas = ?;';
                                          connection.query(sqlrs,[res5.id_revisionpsistemas],(err,resrs)=>{
                                            // console.log(resrs);
                                            res5.revisionps = resrs[0];
                                            return (err)? reject(err): resolve(res5)
                                          })
                                          }
                                          else{
                                            res5.revisionps = {};
                                            return resolve(res5)
                                          }
                                        }).then(async(res6,rej6)=>{
                                          // console.log('RES6');
                                          // console.log(res6);
                                          new Promise(function(resolve, reject) {
                                            if(res6.id_examenf != null)
                                          {
                                              let sqlef = 'SELECT * FROM examenf WHERE id_examenf = ?;';
                                              connection.query(sqlef,[res6.id_examenf],(err,respef)=>{
                                                res5.examenf = respef[0];
                                                return (err)? reject(err): resolve(res6);
                                              })
                                            }
                                            else
                                            {
                                              res5.examenf = {};
                                              return resolve(res6);
                                            }

                                          }).then(async(res7,rej7)=>{
                                              new Promise(function(resolve, reject) {
                                                  let sqlid = 'SELECT * FROM impresion_diagnostica, historiacli_has_impresiondiag WHERE impresion_diagnostica.id_impresiondiag = historiacli_has_impresiondiag.id_impresiondiag AND historiacli_has_impresiondiag.id_historiacl = ?;';
                                                  connection.query(sqlid,[res7.id_historiacl],(err,resid)=>{
                                                    // console.log(resid);
                                                      if(JSON.stringify(resid)!= '[]')
                                                      {
                                                        res7.impresiondiag = resid;
                                                        // console.log(res7);
                                                        return (err)? reject(err): resolve(res7);
                                                      }
                                                      else {
                                                        // console.log('no existen datos');
                                                        res7.impresiondiag = [];
                                                        return resolve(res7);
                                                      }

                                                  })
                                              }).then(async(resfn,rejfn)=>{
                                                  // console.log('then fin');
                                                  // console.log(resfn);
                                                  callback(null,resfn)
                                                }).catch((err)=>{console.error(err);})
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
//PEGAR HASTA AQUI
  }
};






module.exports = histClinModule;
