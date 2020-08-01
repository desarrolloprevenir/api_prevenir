let mysql = require('mysql');
let config = require('../config');
let jwts = require('jsonwebtoken');
let fs = require('fs');
let imgmodule = require('./imagenes')
var rn = require('random-number');
var ba64 = require("ba64");
var regH = require("./horario");
var diasH = require("./dias");
var hora = require('./horario');
var fotoss = require('./fotos');
var eject = require('./ejecucion');
var async = require("async");
var catei = require("./inventario")

connection = mysql.createConnection({
    host: config.domain,
    user: config.userbd,
    password: config.passwordbd,
    database: config.nombredb
});

let servmodule = {};

// guardaba servicios pero no funciona
servmodule.save = (data, callback) => {
    // console.log('adentro del save nuevo vamo a ver');
    // console.log(data.medico_id);
    // console.log(data.id_prov);
    img = data.foto64;
    nombre = data.nombre;
    horario = data.horario;
    var idInd = 0;
    var respuesta = [];
    var horarios;
    var p = 0;
    var mensaje = [];
    var cliente = data.precio * ((100 - data.descuento) / 100);
    var sql = 'INSERT INTO servicios(nombre,descripcion,duracion,max_citas_ves,video,precio,descuento,precio_cliente_prevenir,id_provedores,creadoPor) values (?,?,?,?,?,?,?,?,?,?);';
    connection.query(sql, [data.nombre, data.descripcion, data.duracion, data.max_citas, data.video, data.precio, data.descuento, cliente, data.id_prov, data.creado], (err, res) => {
        if (err) {
            throw err
        } else {


            // console.log('CHIPSSSSS', data.chips);
            // Agregar palabras clave
            if (data.chips.length >= 1) {

                // console.log('CHIPSSSSS DENTRO DEL IF');

                for (let i = 0; i < data.chips.length; i++) {
                    // data.chips[i].servicios_id_servicios = res.insertId;
                    // console.log('DESPUES DEL FOR', data.chips);
                    let sqlChips = "INSERT INTO palabras_clave (palabra_clave, servicios_id_servicios) values (?,?);";

                    connection.query(sqlChips, [data.chips[i].nombre, res.insertId], (err, result) => {

                        if (err) {
                            // console.log('fallo insersion palabras clave');
                            throw err;
                        }
                        // console.log('registro palabras clave exitoso', result);
                    });

                }



            }


            // id de insercion de el servicios
            // console.log('AGREGADO EL SERVICIO', res);
            var idinsert = res.insertId;
            idInd = res.insertId;
            // console.log(data.categoria);
            if (data.categoria == 3) {
                console.log('Creando una Optica');
                cate = {
                    "nombre": "Material Lentes",
                    "descripcion": "descripcion categoria",
                    "id_provedor": data.id_prov,
                    "sucursales": '[]'
                };

                let sqlin = 'INSERT INTO categoria_inv (nombre, descripcion,id_provedor) VALUES (?, ?,?);';
                connection.query(sqlin, [cate.nombre, cate.descripcion, cate.id_provedor], (err, respin) => {
                    if (err) { throw err } else {
                        console.log('ok');
                    }
                })
            }
            sqlss = 'INSERT INTO servicios_categoria (servicios_idservicios, categoria_idcategoria) VALUES (?, ?)';
            // console.log('id_Servicio'+idInd+'/*/*/*'+'Id Cate'+data.categoria);
            connection.query(sqlss, [idInd, data.categoria], (err, row) => {
                if (err) {
                    throw err;
                } else {
                    // console.log('AGREGADA SERVICIO CATEGORIA');
                    var p = 1;
                    var respons = [];
                    for (var i = 0; i < img.length; i++) {
                        var foto = img[i];
                        var options = {
                            min: 00001,
                            max: 999999,
                            integer: true
                        }
                        var rand = rn(options);
                        var name = data.nombre + '_' + rand + data.duracion + '_' + idinsert + rand
                        var fotos = foto.base64Image;
                        var pathView = "/servicios/" + name;
                        var newPath = 'src/public/servicios/' + name;
                        pathView = pathView;
                        ba64.writeImageSync(newPath, fotos);
                        var fotoe = {
                            nombre: name,
                            id: idinsert,
                            pathV: pathView,
                            pathI: newPath
                        };
                        // console.log(fotoe);
                        fotoss.fotosSer(fotoe, (err, res) => {
                            // console.log(res);
                            if (p == img.length) {
                                // console.log(respons[1]);
                                var mensaje = [{ 'agregado': true }];
                                mensaje.fotos = respons;

                                callback(null, mensaje);
                            }
                            p++;
                        });
                    }
                }
            });
        }
    });
};






// Da servicios por provedor para el listado de el provedor al agregar un servicio o listarlos
servmodule.DarServiceUsu = (ids, callback) => {
    // console.log('prueba de servicios *****************');
    if (connection) {
        // console.log(ids);
        var sql = 'SELECT servicios.*, categoria.nombre as categoria,categoria.id_categoria FROM servicios, categoria, servicios_categoria WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND servicios_categoria.categoria_idcategoria = categoria.id_categoria AND servicios.id_provedores = ? AND servicios.eliminado = 0 ORDER BY servicios.createdupdate desc;';
        var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios, consultorio, usuarios WHERE comentarios.id_consultorio = consultorio.id_consultorio AND comentarios.usuarios_id = usuarios.id AND consultorio.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';

        connection.query(sql, [ids], (err, row) => {
            if (err) {
                throw err
            } else {
                if (JSON.stringify(row) != '[]') {
                    // console.log(row);
                    var p = 1;
                    var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
                    var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
                    var jsonServ = [];
                    //  console.log('fuera de la consulta')
                    var jsonServ = [];
                    row.forEach((serv) => {
                        // console.log(serv.idservicios)
                        var id = serv.id_servicios;
                        // console.log('ID SERVICIO');
                        // console.log(id);
                        connection.query(sql1, [id], (err, ft) => {
                            console.log('********************************************* ver');
                            console.log(ft);
                            if (err) { throw err } else {
                                // console.log('DENTRO DEL QUERY');
                                // console.log(id);
                                // console.log(ft);
                                // console.log(ft);
                                ft = ft[0];
                                serv.foto = ft.ruta;
                            }
                        });
                        connection.query(sql, [id], (err, resp) => {
                            // console.log('dentro de la consulta '+id)
                            if (err) {
                                throw err
                            } else {
                                serv.fotos = resp;
                                //console.log(resp);
                                connection.query(sel, [id], (err, com) => {
                                    if (err) { throw err } else {
                                        serv.coment = com;
                                        jsonServ.push(serv);
                                        if (p >= row.length) {
                                            callback(null, jsonServ);
                                            //console.log('find de la consulta');
                                        }
                                        p++;
                                    }
                                });
                            }
                        });

                        // Sentencia para obtener las palabras clave de acuerdo al id de un servicio
                        var sqlChips = 'select palabra_clave from palabras_clave where servicios_id_servicios = ' + id;

                        connection.query(sqlChips, (err, chips) => {

                            if (err) {
                                throw err;
                            } else {
                                // console.log('CHIPSSSSSSSSSS', chips);

                                if (chips.length >= 1) {
                                    var palabras;
                                    for (let i = 0; i < chips.length; i++) {
                                        // palabras = chips[i].palabra_clave;
                                        if (!palabras) {
                                            palabras = chips[i].palabra_clave;
                                        } else {
                                            palabras = palabras + ' ' + chips[i].palabra_clave;
                                        }
                                    }

                                    serv.palabras_clave = palabras;
                                } else {
                                    serv.palabras_clave = "";
                                }
                            }
                        });


                    });
                } else {
                    callback(null, [{ 'vacio': true }]);
                }
            }
        });

    }
    // console.log('prueba');

};




// devuelve los servicios para el ususario
servmodule.pruebaServicio = (callback) => {
    // console.log('prueba de servicios')
    if (connection) {
        // console.log('************///**/*/*///////////////*/*/*/*/*/*/*/*/*/*/*/');
        var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria  FROM servicios, categoria, servicios_categoria WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios and categoria.id_categoria = servicios_categoria.categoria_idcategoria AND servicios.eliminado = 0';
        connection.query(sql, (err, row) => {
            if (err) {

            } else {
                var p = 1;
                var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';

                var jsonServ = [];
                //  console.log('fuera de la consulta')
                var jsonServ = [];
                row.forEach((serv) => {
                    // console.log(serv.idservicios)
                    var id = serv.id_servicios;
                    //console.log(id);
                    connection.query(sql, [id], (err, resp) => {
                        // console.log('dentro de la consulta '+id)
                        if (err) {
                            throw err;
                        } else {
                            serv.foto = resp;
                            //console.log(resp);
                            // console.log('/////////******* valor p '+p)
                            //console.log('/////////******* valor row '+row.length);
                            connection.query(sel, [id], (err, com) => {
                                if (err) { throw err } else {
                                    serv.coment = com;
                                    jsonServ.push(serv);
                                    if (p >= row.length) {
                                        callback(null, jsonServ);
                                        //console.log('find de la consulta');
                                    }
                                    p++
                                }
                            });

                        }
                    });
                });

            }
        });

    }
    //  console.log('prueba');
};


// da los servicios para el ususario
servmodule.darServicios = (callback) => {
    var jsonServicios = [];
    if (connection) {
        // console.log('servicios/2do rchivo');
        var sql = 'SELECT servicios.* FROM servicios WHERE servicios.eliminado = 0 ';
        connection.query(sql, (err, row) => {
            if (err) {
                // console.log('error');
                var mensaje = { 'mensaje': 'error al cargar servicios', 'carga': 'false' };
                callback(null, mensaje);
            } else {
                //jsonServicios = row;
                if (row.length >= 1) {
                    imgmodule.darImagenesServ(row, (err, resp) => {
                        //console.log(resp);
                        callback(null, resp);

                    });
                }
            }
        });

    }

};


// da servicios por el id de del servicio
servmodule.darServiciosIdS = (id, callback) => {
    // console.log('prueba de servicios')
    if (connection) {
        var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria and servicios.id_servicios = ? AND servicios.eliminado = 0';
        var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios, consultorio, usuarios WHERE comentarios.id_consultorio = consultorio.id_consultorio AND comentarios.usuarios_id = usuarios.id AND consultorio.id_servicios = ? ORDER BY comentarios.createdAt asc LIMIT 3;';
        connection.query(sql, [id], (err, row) => {
            if (err) {
                throw err;
            } else {
                // console.log(row);
                var p = 1;
                var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
                var jsonServ = [];
                //  console.log('fuera de la consulta')
                var jsonServ = [];
                row.forEach((serv) => {
                    // console.log(serv.idservicios)
                    var id = serv.id_servicios;
                    //console.log(id);
                    connection.query(sql, [id], (err, resp) => {
                        // console.log('dentro de la consulta '+id)
                        if (err) {
                            throw err
                        } else {
                            // console.log(row);
                            if (JSON.stringify(row) != '[]') {
                                var p = 1;
                                var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
                                var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
                                var jsonServ = [];
                                //  console.log('fuera de la consulta')
                                var jsonServ = [];
                                row.forEach((serv) => {
                                    // console.log(serv.idservicios)
                                    var id = serv.id_servicios;
                                    //console.log(id);
                                    connection.query(sql1, [id], (err, ft) => {
                                        if (err) { throw err } else {
                                            ft = ft[0];
                                            serv.foto = ft.ruta;
                                        }
                                    });
                                    connection.query(sql, [id], (err, resp) => {
                                        // console.log('dentro de la consulta '+id)
                                        if (err) {

                                        } else {
                                            serv.fotos = resp;
                                            //console.log(resp);
                                            connection.query(sel, [id], (err, com) => {
                                                if (err) { throw err } else {
                                                    serv.coment = com;
                                                    jsonServ.push(serv);
                                                    if (p >= row.length) {
                                                        callback(null, jsonServ);
                                                        //console.log('find de la consulta');
                                                    }
                                                    p++
                                                }
                                            });
                                        }
                                    });
                                });
                            } else {
                                callback(null, [{ 'vacio': true }])
                            }
                        }
                    });
                });

            }
        });

    }
};


// da servicios por el id de del servicio
servmodule.darServiciosMunCat = (ids, callback) => {
    //console.log('////////////////Servicios ')
    var idm = ids.idm;
    var idc = ids.idc;
    // console.log('ID DE CATEGORIAS');
    // console.log(idm);
    if (connection) {
        if (idc == 0 || idc == '0') {
            console.log('////////////////Servicios por muunicipios/////////// ')

            if (idc != 20) {
                console.log('cargando');
                var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria, municipio.id_municipio, consultorio.eliminado as consul FROM servicios, servicios_categoria, categoria, municipio, sucursales, consultorio WHERE sucursales.id_sucursales = consultorio.id_sucursales AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND sucursales.id_municipio = municipio.id_municipio AND municipio.id_municipio= ? AND categoria_idcategoria != 20 AND consultorio.eliminado = 0 GROUP BY servicios.id_servicios;';
                var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios, consultorio, usuarios WHERE comentarios.id_consultorio = consultorio.id_consultorio AND comentarios.usuarios_id = usuarios.id ORDER BY comentarios.createdAt asc LIMIT 3;';
            } else {
                //arrgelar para mascotas IMPORTANTE
                console.log('cargando');
                var sql = 'SELECT servicios.*, consultorio.nombre as consultorio, categoria.nombre as categoria, categoria.id_categoria as id_categoria, municipio.id_municipio FROM servicios, servicios_categoria, categoria, municipio, sucursales, consultorio WHERE sucursales.id_sucursales = consultorio.id_sucursales AND consultorio.id_servicios = servicios.id_servicios AND servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND sucursales.id_municipio = municipio.id_municipio AND municipio.id_municipio= ? AND categoria_idcategoria = 20 AND consultorio.eliminado = 0 GROUP BY servicios.id_servicios;';
                var sel = 'SELECT comentarios_masc.* FROM comentarios_masc, consultorio, mascotas WHERE comentarios_masc.id_consultorio = consultorio.id_consultorio AND comentarios_masc.id_mascotas = mascotas.id_mascotas AND consultorio.id_servicios = ? ORDER BY comentarios_masc.createdAt asc LIMIT 3;';
            }

            connection.query(sql, [idm], (err, row) => {
                if (err) {
                    throw err
                } else {
                    // console.log('row cargado');
                    // console.log(row);
                    if (JSON.stringify(row) != '[]') {
                        var p = 1;
                        var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
                        var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
                        var jsonServ = [];
                        //  console.log('fuera de la consulta')
                        var jsonServ = [];
                        row.forEach((serv) => {
                            // console.log(serv.idservicios)
                            var id = serv.id_servicios;
                            //console.log(id);
                            connection.query(sql1, [id], (err, ft) => {
                                if (err) { throw err } else {
                                    ft = ft[0];
                                    serv.foto = ft.ruta;
                                }
                            });
                            connection.query(sql, [id], (err, resp) => {
                                // console.log('dentro de la consulta '+id)
                                if (err) {

                                } else {
                                    serv.fotos = resp;
                                    //console.log(resp);
                                    connection.query(sel, [id], (err, com) => {
                                        if (err) { throw err } else {
                                            serv.coment = com;
                                            jsonServ.push(serv);
                                            if (p >= row.length) {
                                                callback(null, jsonServ);
                                                //console.log('find de la consulta');
                                            }
                                            p++
                                        }
                                    });
                                }
                            });


                            // Sentencia para obtener las palabras clave de acuerdo al id de un servicio
                            var sqlChips = 'select palabra_clave from palabras_clave where servicios_id_servicios = ' + id;

                            connection.query(sqlChips, (err, chips) => {

                                if (err) {
                                    throw err;
                                } else {
                                    // console.log('CHIPSSSSSSSSSS', chips);

                                    if (chips.length >= 1) {
                                        var palabras;
                                        for (let i = 0; i < chips.length; i++) {
                                            // palabras = chips[i].palabra_clave;
                                            if (!palabras) {
                                                palabras = chips[i].palabra_clave;
                                            } else {
                                                palabras = palabras + ' ' + chips[i].palabra_clave;
                                            }
                                        }

                                        serv.palabras_clave = palabras;
                                    } else {
                                        serv.palabras_clave = "";
                                    }
                                }
                            });


                        });




                    } else {
                        callback(null, [{ 'vacio': true }])
                    }
                }
            });
        } else {
            if (idc != 20) {
                // console.log('CARGANDO DIFERNTE DE 20 ');
                var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, consultorio, sucursales WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND servicios_categoria.categoria_idcategoria = categoria.id_categoria  AND servicios.id_servicios = consultorio.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND sucursales.id_municipio = ? AND categoria.id_categoria = ? AND categoria_idcategoria != 20 AND servicios.eliminado = 0 AND consultorio.eliminado = 0 GROUP BY servicios.id_servicios;';
                var sel = 'SELECT comentarios.*,usuarios.avatar, CONCAT(usuarios.nombre," ",usuarios.apellidos) as nombre FROM comentarios, consultorio, usuarios WHERE comentarios.id_consultorio = consultorio.id_consultorio AND comentarios.usuarios_id = usuarios.id ORDER BY comentarios.createdAt asc LIMIT 3;';
            } else {
                var sql = 'SELECT servicios.*, categoria.nombre as categoria, categoria.id_categoria as id_categoria FROM servicios, servicios_categoria, categoria, consultorio, sucursales WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND servicios_categoria.categoria_idcategoria = categoria.id_categoria  AND servicios.id_servicios = consultorio.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND sucursales.id_municipio = ? AND categoria.id_categoria = ? AND categoria_idcategoria = 20 AND servicios.eliminado = 0 AND consultorio.eliminado = 0;';
                var sel = 'SELECT comentarios_masc.* FROM comentarios_masc, consultorio, mascotas WHERE comentarios_masc.id_consultorio = consultorio.id_consultorio AND comentarios_masc.id_mascotas = mascotas.id_mascotas AND consultorio.id_servicios = ? ORDER BY comentarios_masc.createdAt asc LIMIT 3;';
            }
            //console.log('////////////////Servicios por municipos y categorias ')
            connection.query(sql, [idm, idc], (err, row) => {
                if (err) {
                    throw err
                } else {
                    // console.log(row);
                    if (JSON.stringify(row) != '[]') {
                        var p = 1;
                        var sql1 = 'SELECT * FROM fotos where servicios_idservicios = ? limit 1';
                        var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
                        var jsonServ = [];
                        //  console.log('fuera de la consulta')
                        var jsonServ = [];
                        row.forEach((serv) => {
                            // console.log(serv.idservicios)
                            var id = serv.id_servicios;
                            //console.log(id);

                            connection.query(sql1, [id], (err, ft) => {
                                if (err) { throw err } else {
                                    ft = ft[0];
                                    serv.foto = ft.ruta;
                                }
                            });
                            connection.query(sql, [id], (err, resp) => {
                                // console.log('dentro de la consulta '+id)
                                if (err) {

                                } else {
                                    serv.fotos = resp;
                                    //console.log(resp);
                                    connection.query(sel, [id], (err, com) => {
                                        if (err) { throw err } else {
                                            serv.coment = com;
                                            jsonServ.push(serv);
                                            if (p >= row.length) {
                                                callback(null, jsonServ);
                                                //console.log('find de la consulta');
                                            }
                                            p++
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        callback(null, [{ 'vacio': true }])
                    }

                }
            });
        }
    }
};




// elimina un servicio de la base de datos
servmodule.deleteServ = (id, callback) => {
    if (connection) {
        console.log('ELIMINA SERVICIO');
        var sql4 = 'SELECT COUNT(consultorio.id_consultorio) as citas FROM consultorio WHERE consultorio.id_servicios = ? AND eliminado = 0;';
        connection.query(sql4, [id], (err, row) => {
            if (err) { throw err } else {
                // console.log(row)
                row = row[0]
                if (row.citas >= 1) {
                    // console.log('no eliminado');
                    console.log('NO ENTRA NO ELIMINA');
                    callback(null, false);
                } else {
                    // hora.eliminarHorario(id,(err,res)=>{
                    // var sql1 = 'DELETE FROM fotos where servicios_idservicios = ?';
                    // var sql2 = 'DELETE FROM servicios_categoria WHERE servicios_idservicios = ?';
                    var sql = 'UPDATE servicios SET eliminado = 1 WHERE id_servicios = ?;';
                    // var sql3 = 'DELETE FROM medicos WHERE servicios_idservicios = ?';


                    // console.log('borrando fotos');
                    // connection.query(sql1,[id],(err,res)=>{
                    // if(err){throw err;}
                    // else {
                    // {
                    // console.log('borrando categoria');
                    // connection.query(sql2,[id],(err,res2)=>{
                    // if(err){throw err;}
                    // else
                    // {
                    // console.log('borrando servicio');
                    connection.query(sql, [id], (err, row) => {
                        if (err) {
                            callback(null, false);
                        } else {
                            callback(null, true);
                        }
                    });
                    // }
                    // });
                    // }
                    // }
                    // });
                    // });
                }
            }
        });
    }
};

//devuelve un servicio por su id
servmodule.onlyservicio = (id, callback) => {
    let sql = 'SELECT servicios.*, categoria.nombre as categoria FROM servicios,categoria, servicios_categoria WHERE servicios.id_servicios = servicios_categoria.servicios_idservicios AND categoria.id_categoria = servicios_categoria.categoria_idcategoria AND servicios.id_servicios = ?;';
    connection.query(sql, [id], (err, row) => {
        if (err) { throw err } else {

            row = row[0];
            if (row.video != '') {
                // console.log(row);
                let video = 'https://youtu.be/' + row.video;
                row.video = video;
            } else {
                row.video = 'https://youtu.be/4Z4TxFh1tO8';
            }
            callback(200, row);
        }
    });
};

servmodule.updateServ = (serv, callback) => {
    if (connection) {
        // console.log('////////***********');
        // console.log(serv);
        var sql = 'UPDATE servicios SET nombre=?,descripcion=?,duracion=?,max_citas_ves =?,video=?,precio=?,descuento=?,precio_cliente_prevenir=?,direccion=? WHERE id_servicios=?;'
            // let sql1 = 'UPDATE servicios_categoria set categoria_idcategoria = ? where servicios_idservicios = ?';
        connection.query(sql, [serv.nombre, serv.descripcion, serv.duracion, serv.max_citas, serv.video, serv.precio, serv.descuento, serv.precio_cliente_prevenir, serv.direccion, serv.id], (err, resp) => {
            if (err) { throw err } else {
                // connection.query(sql1,[serv.categoria,serv.id],(err,row)=>{
                // if(err){throw err}
                // else
                // {
                callback(200, true);
                // }
                // });
            }
        });
    }
};


servmodule.serviciosMedicoProv = (ids, callback) => {
    if (connection) {
        // console.log('id uno a uno');
        // console.log(ids);
        let idser = 0;
        var servi
        var p = 1;
        let respu = [];
        let serv = 'SELECT servicios.nombre,servicios.id_servicios,servicios.*, servicios_categoria.categoria_idcategoria FROM servicios, provedores, medicos, servicios_categoria  WHERE servicios.medico_id = medicos.medico_id AND servicios.id_provedores = provedores.id_provedor AND servicios_categoria.servicios_idservicios = servicios.id_servicios AND medicos.medico_id = ? AND provedores.id_provedor = ?;';
        var sql = 'SELECT * FROM fotos where servicios_idservicios = ?';
        connection.query(serv, [ids.id, ids.idp], (err, ser) => {
            // console.log(ser);
            if (err) { throw err } else {
                // ids.serv = ser;
                // console.log(ser);
                // for (var i = 0; i < ser.length; i++) {
                //   idser = ser[i].id_servicios;
                //   servi = ser[i];
                //   // console.log(idser);
                //   connection.query(sql,[idser],(err,reft)=>{
                //     if(err){throw err}
                //     else
                //     {
                //       console.log(reft);
                //       // servi.foto = (retf);
                //       console.log(servi);
                //       console.log(p);
                //       console.log(ser.length);
                //       servi.foto = reft;
                //       respu.push(servi);
                //       if(p>=ser.length)
                //       {
                //         console.log('RESPUESTA');
                //         console.log(respu);
                //         callback(null,respu);
                //       }
                //         p++
                //     }
                //   });
                // }



                ser.forEach((data) => {

                    // console.log(data.id_servicios);
                    connection.query(sql, [data.id_servicios], (err, row1) => {
                        // console.log('PRUEBOTA');
                        data.fotos = row1;
                        respu.push(data);
                        // console.log(respu.length);
                    });
                });
                // console.log('respuesta');
                callback(null, respu);

            }
        });
    }
};


servmodule.serviciosMedicoProvedor = (pr, callback) => {
    if (connection) {
        let p = 1;
        // console.log('id uno a uno');
        // console.log(prs);
        let servi = [];
        let serv = 'SELECT servicios.nombre,servicios.id_servicios,servicios.*, servicios_categoria.categoria_idcategoria, consultorio.id_consultorio FROM servicios, provedores, medicos, servicios_categoria, consultorio  WHERE consultorio.medico_id = medicos.medico_id AND servicios.id_servicios = consultorio.id_servicios AND servicios.id_provedores = provedores.id_provedor AND servicios_categoria.servicios_idservicios = servicios.id_servicios AND medicos.medico_id = ? AND provedores.id_provedor = ? AND consultorio.eliminado = 0;';
        // console.log(pr);
        connection.query(serv, [pr.id, pr.idp], (err, row) => {
            if (err) { throw err } else {

                if (JSON.stringify(row) == '[]') {
                    pr.serv = [];
                    callback(null, pr)
                } else {

                    for (var i = 0; i < row.length; i++) {

                        eject.fotosSer(row[i], (err, resp) => {
                            // console.log(resp);
                            servi.push(resp);
                            // p++;
                            // console.log(p);
                            if (p >= row.length) {
                                // console.log(servi);
                                pr.serv = servi;
                                callback(null, pr);
                            } else {
                                p++
                                // console.log(servi);
                                // console.log(p);
                            }
                        });

                    }
                    //fin else
                }
            }


        });
        // })
        //           // for use with Node-style callbacks...
        //
        //
        // var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
        // var configs = {};
        //
        // async.forEachOf(obj, (value, key, callback) => {
        // fs.readFile(__dirname + value, "utf8", (err, data) => {
        //   if (err) return callback(err);
        //   try {
        //       configs[key] = JSON.parse(data);
        //   } catch (e) {
        //       return callback(e);
        //   }
        //   callback();
        // });
        // }, err => {
        // if (err) console.error(err.message);
        // // configs is now a map of JSON data
        // doSomethingWith(configs);
        // });



    }
};

servmodule.servisucu = (idsu, callback) => {
    if (connection) {
        var sql = 'SELECT servicios.*, servicios_categoria.categoria_idcategoria as id_categoria, consultorio.id_consultorio FROM servicios, consultorio, sucursales, servicios_categoria WHERE servicios.id_servicios = consultorio.id_servicios AND consultorio.id_sucursales = sucursales.id_sucursales AND servicios_categoria.servicios_idservicios = servicios.id_servicios AND sucursales.id_sucursales = ? AND consultorio.eliminado = 0 AND servicios.eliminado = 0;';
        connection.query(sql, [idsu], (err, row) => {
            if (err) { throw err } else {
                // console.log(row);
                callback(null, row)
            }
        });
    }
};

servmodule.pruebaP = (callback) => {
    var sql = 'select * FROM members;';
    var promise = new Promise(function(res, rej) {
        connection.query(sql, (err, data) => {
            return (err) ? rej(err) : res(data)
        })
    });

    promise
        .then((resolve, reject) => {
            var con = 0;
            var datos = resolve;
            // console.log(datos);
            for (var i = 0; i < datos.length; i++) {
                // console.log(datos[i]);
                con++;
                // console.log(con);
            }
            // console.log('DESPUES DEL FOR');
            return con
        })
        .then((res, rej) => {
            // console.log(res);
            callback(null, res)
        })
        .catch((err) => { console.error(err); })
};


module.exports = servmodule;