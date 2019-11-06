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

histClinModule.nuevaHistoria = (hisc,callback) =>{
  if(connection)
  {
    // console.log(hisc);

    var ids={};
    let inshist = 'INSERT INTO historia_clinica (tipo_consulta, motiv_oconsulta, enfermedades_preex, usuarios_id, id_servicios) VALUES (?, ?, ?, ?, ?);'
    connection.query(inshist,[hisc.tipo_consulta,hisc.motivo_consulta,hisc.enfermedades_preex,hisc.usuario_id,hisc.id_servicios],(err,histoc)=>{
      if(err){throw err }
      else {
        ids.id_historiac = histoc.insertId;
        // console.log(hisc.historia_opt);
        if(JSON.stringify(hisc.antecedentes_f)!='{}')
        {
          console.log('ANTECEDENTES FAMILIARES');
          let antf = hisc.antecedentes_f;
          let sqlAntF = 'INSERT INTO antecedentes_f (cardiopatias, diabetes, hipertension, asma, enfermadad_psiquiatrica, efisema, cancer, epilepcia) VALUES (?,?,?,?,?,?,?,?)';
          connection.query(sqlAntF,[antf.cardiopatias,antf.diabetes,antf.hipertension,antf.asma,antf.enfermedad_psiquiatrica,antf.efisema,antf.cancer,antf.epilepcia],(err,antf)=>{
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
          let sqlrps = 'INSERT INTO revisionpsistemas (card_resp, card_resp_desc, vascular, vasc_desc, gastro_int, gastro_int_desc, genito_uri, genito_uri_desc, endocrino, endocrino_desc, osteomuscular, osteomuscular_desc, neurologico, neurologico_dec, pielyfan, pielyfan_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
          connection.query(sqlrps,[rps.card_resp, rps.card_resp_desc, rps.vascular, rps.vascular_desc, rps.gastro_int, rps.gastro_int_desc, rps.genito_uri, rps.genito_uri_desc, rps.endocrino, rps.endocrino_desc, rps.osteomuscular, rps.osteomuscular_desc, rps.neurologico, rps.neurologico_desc, rps.pielyfan, rps.pielyfan_desc],(err,rrps)=>{
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
          let sqlef = 'INSERT INTO examenf (frecuencia_cardiaca, frecuencia_resp, presion_art, temperatura, talla, peso, cabeza, cabeza_desc, ojos, ojos_desc, oidos, oidos_desc, nariz, nariz_desc, boca, boca_desc, cuello, cuello_desc, torax_ma, torax_ma_desc, pulmones, pulmones_desc, corazon, corazon_desc, abdomen, abdomen_desc , genitourinario, genitourinario_desc, columna, columna_desc, exremidades, extremidades_desc, neurologico, neurologico_desc, pielyfane, pielyfane_desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          connection.query(sqlef,[ef.frecuencia_cardica, ef.frecuencia_resp, ef.presion_art, ef.temperetura, ef.talla, ef.peso, ef.cabeza, ef.cabeza_desc, ef.ojos, ef.ojos_desc, ef.oidos, ef.oidos_desc, ef.nariz, ef.nariz_desc, ef.boca, ef.boca_desc, ef.cuello, ef.cuello_desc, ef.torax_ma, ef.torax_ma_desc, ef.pulmones, ef.pulmones_desc, ef.corazon, ef.corazon_desc, ef.abdomen, ef.abdomen_desc, ef.genitourinario, ef.genitourinario_desc, ef.columna, ef.columna_desc, ef.extremidades, ef.extremidades_desc, ef.neurologico, ef.neurologico_desc, ef.pielyfane, ef.pielyfane_desc],(err,ref)=>{
            if(err){throw err}
            else {
              let updthc = 'UPDATE historia_clinica SET id_revisionpsistemas = ? WHERE id_historiacl = ?;';
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
          if(JSON.stringify(hisc.historia_opt)!='{}')
          {
            var sql = 'INSERT INTO historia_opt (motivoCons, antecedentes, lensometriaOd, lensometriaOi, agudeazaVisualOd, agudeazaVisualOi, visionLejanaOd, visionLejanaOi, visionCercanaOd, visionCercanaOi,adicion, tipoLente, examenExternoOd, examenExternoOi, oftalmologiaOd, oftalmologiaOi, examenMotorOd, examenMotorOi, queratometriaOd, queratometriaOi, refraccionOd, refraccionOi, formulaFinalOd, formulaFinalOi, avvlOd, avvlOi, avvpOd, avvpOi, adicionOd, adicionOi, dnpOd, dnpOi, testIshihara,';
            var sql2 ='testEstereopsis,diagnosticoInical,conducta,medicamentos,remision,observaciones,tipo_consulta,rips,id_usuario,id_servicios) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            // console.log(sql+sql2);
            connection.query(sql+sql2,[opt.motivoConsulta,opt.antecedentes,opt.lensometriaOd,opt.lensometriaOi,opt.agudezaVisualOd,opt.agudezaVisualOi,opt.visionLejanaOd,opt.visionLejanaOi,opt.visionCercanaOd,opt.visionCercanaOi,opt.adicion,opt.tipoLente,opt.examenExternoOd,opt.examenExternoOi,opt.oftalmologiaOd,opt.oftalmologiaOi,opt.examenMotorOd,opt.examenMotorOi,opt.queratometriaOd,opt.queratometriaOi,opt.refracionOd,opt.refraccionOi,opt.formulaFinalOd,opt.formulaFinalOi,opt.avvlOd,opt.avvlOi,opt.avvpOd,opt.avvpOi,opt.adicionOd,opt.adicionOi,opt.dnpOd,opt.dnpOi,opt.testIshihara,opt.testEstereopsis,opt.diagnosticoInicial,opt.conducta,opt.medicamentos,opt.remision,opt.observaciones,opt.tipoConsulta,opt.rips, opt.id_usuario,opt.id_servicio],(err,rop)=>{
              if(err){throw err}
              else
              {
                let updthc = 'UPDATE historia_clinica SET id_revisionpsistemas = ? WHERE id_historiacl = ?;';
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

histClinModule.darimpresionDiagnostica = (lk,callback) => {
  if(connection)
  {
    let sql = 'SELECT * from impresion_diagnostica' ;
    connection.query(sql,[lk,lk],(err,resp)=>{
      if(err){throw err}
      else {
        {
          callback(null,resp);
        }
      }
    })
  }
};




module.exports = histClinModule;