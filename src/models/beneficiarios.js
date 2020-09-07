let mysql = require('mysql');
let config = require('../config');
let ciclo = require('../controler/ciclos');

connection = mysql.createConnection({
    host: config.domain,
    user: config.userbd,
    password: config.passwordbd,
    database: config.nombredb
});

let benefModule = {};

//agrega benedficiarios con los respectivos campos solicitados
benefModule.agregarBeneficiario = (benef, callback) => {
    if (connection) {
        if (benef.cuenta == true || benef.cuenta == 'true') {
            ciclo.generaSalt((err, gen) => {
                benef.cod = gen;
                // console.log(gen);
                // console.log(benef.cod);
            });
            var sql1 = 'INSERT INTO members (email, admin, password, salt) VALUES ( ?, ?, ?,?)';
            connection.query(sql1, [benef.correo, 'false', 'donPass', benef.cod], (err, row) => {
                if (err) {
                    throw err;
                } else {
                    // console.log(row);
                    var id = row.insertId;
                    var add = 'INSERT INTO usuarios (cedula,correo, nombre, apellidos, telefono,telefonowatshapp,fecha_nacimiento,usuariosBf_id, parentescos_id_parentescos,members_id,id_pais) VALUES (?,?,?,?,?,?,?,?,?,?,?);';
                    // //console.lo.log(benef);
                    connection.query(add, [benef.ident, benef.correo, benef.nombre, benef.apellidos, benef.tel, benef.tel, benef.fecha_n, benef.id_usu, benef.parent, id, benef.pais], (err, res) => {
                        if (err) { callback(null, err) } else {
                            res = res.protocol41;
                            callback(null, res);
                        }
                    });


                }
            });
        } else {
            var add = 'INSERT INTO usuarios (cedula, nombre, apellidos, telefono,telefonowatshapp,fecha_nacimiento,usuariosBf_id, parentescos_id_parentescos,id_pais) VALUES (?,?,?,?,?,?,?,?,?);';
            // //console.lo.log(benef);
            connection.query(add, [benef.ident, benef.nombre, benef.apellidos, benef.tel, benef.tel, benef.fecha_n, benef.id_usu, benef.parent, benef.pais], (err, res) => {
                if (err) { callback(null, err) } else {
                    {
                        res = res.protocol41;
                        callback(null, res)
                    }
                }
            });
        }
    }
};

//retorna los beneficiarios por el id del titular
benefModule.darBenefId = (id, callback) => {
    var sel = 'SELECT usuarios.*, parentescos.nombre as parentesco FROM usuarios,parentescos WHERE usuarios.parentescos_id_parentescos = parentescos.id_parentescos and usuariosBf_id = ? and parentescos_id_parentescos != 17;'
    if (connection) {
        connection.query(sel, [id], (err, row) => {
            if (err) { callback(500, err) } else { callback(null, row) }
        });
    }
};

module.exports = benefModule;