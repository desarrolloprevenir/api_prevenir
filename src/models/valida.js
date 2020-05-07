let mysql = require('mysql');
let config = require('../config');

connection = mysql.createConnection({
    host: config.domain,
    user: config.userbd,
    password: config.passwordbd,
    database: config.nombredb
});

let validamodel = {};

//valida el email y el id de los usuarios no exixsta en la base de datos
validamodel.vRegistro = (val, callback) => {
    if (connection) {
        var email = val.email;
        var id = val.id;
        // console.log(val);
        var sql = 'SELECT * FROM members WHERE id = ?;';
        connection.query(sql, [id], (err, row) => {
            if (err) {
                throw err;
            } else {
                let usu = row[0];
                // console.log('/*/*/*/*/*/*/*/*/*//');
                // console.log(row);
                if (JSON.stringify(row) == '[]') {
                    var em = 'SELECT * FROM members WHERE email = ?;';
                    connection.query(em, [email], (err, rows) => {
                        if (err) {
                            throw err;
                        } else {
                            // console.log(rows)
                            if (JSON.stringify(rows) == '[]') {
                                // console.log('usuario no existe');
                                callback(null, { 'existe': 'false' });
                            } else {
                                callback(null, [{ 'existe': 'true', 'campo': 'email' }]);
                            }
                        }
                    });

                } else {
                    // console.log('validacion de campos',usu);
                    callback(null, [{ 'existe': 'true', 'campo': 'id' }]);
                }


            }
        });
    } else {
        res.json({ 'mensaje': 'no ahy conexion a la base de datos' });
    }
};

validamodel.validaMedico = (vali, callback) => {
    if (connection) {
        // console.log(vali);
        // console.log('validando');
        //cedula,email,
        let val = 'SELECT * FROM members WHERE email = ?'
        connection.query(val, [vali.email], (err, res) => {
            if (err) { throw err } else {
                // console.log('VALIDACION DE MEMBER');
                console.log(res);
                if (JSON.stringify(res) == '[]') {
                    // console.log('CORREO NO EXISTE');
                    val = 'SELECT * FROM medicos WHERE tarj_profecional = ?';
                    connection.query(val, [vali.t_prof], (err, res1) => {
                        // console.log('VALIDACION DE MEDICO');
                        console.log(res1);
                        if (err) { throw err } else {
                            if (JSON.stringify(res1) == '[]') {
                                // console.log('NO EXISTE');
                                callback(null, { 'existe': false });
                            } else {
                                // console.log('SI EXISTE');
                                callback(null, { 'existe': 'true', 'campo': 'profesional' });
                            }
                        }
                    });
                } else {
                    callback(null, { 'existe': true, 'campo': 'email' });
                }
            }
        });
    }
};

validamodel.validaCorreo = (email, callback) => {
    if (connection) {
        let sql = 'SELECT * FROM members WHERE email = ?;';
        connection.query(sql, [email], (err, resp) => {
            if (err) { throw err } else {
                // console.log('respuesta base de datos ', resp);
                if (JSON.stringify(resp) == '[]') {
                    callback(null, false);
                } else {
                    callback(null, true);
                }
            }
        })
    }
};



module.exports = validamodel;