const serv = require('../models/services');
const jwts = require('../models/jwt');
var fs = require('fs');
var ba64 = require("ba64");

module.exports = function(app) {

    // agrega un servicio a la base de datos retorna true en caso de logragrlo
    app.post('/services', jwts.validaAdmin, (req, res) => {
        var videos = req.body.video;
        if (videos != null) {
            videos = videos.split("/").pop();
        } else {
            {
                videos = '4Z4TxFh1tO8';
            }
        }

        var servicio = {
            id_prov: req.body.id_usuario,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            duracion: req.body.duracion,
            max_citas: req.body.max_citas,
            video: videos,
            muni: req.body.id_mncp,
            foto64: req.body.imagenes,
            precio: req.body.precio,
            descuento: req.body.descuento,
            categoria: req.body.id_ctga,
            horario: req.body.horarios,
            categoria: req.body.id_ctga,
            direccion: req.body.direccion,
            medico_id: req.body.medico_id,
            creado: req.body.creador,
            chips: req.body.chips
                //files: req.files.imagenes
        };
        console.log(servicio);
        serv.save(servicio, (err, data) => {
            // console.log(data);
            res.json(data);
        });


    });


    // devuelve un json de servicios con sus caracteristicas
    app.get('/services', (req, res) => {
        //console.log('servicios');
        serv.pruebaServicio((req, resp) => {
            res.json(resp);
        });
    });

    //retorna los servicios segun el id del provedor
    app.get('/services/:id', (req, res) => {
        console.log('dar servicio por id de provedor');
        var id = req.params.id;
        serv.DarServiceUsu(id, (err, data) => {
            //console.log(data);
            res.json(data);
        });
    });

    // da los servicios por id de municipio e id de categoria
    app.get('/services/:idm/:idc', (req, res) => {
        let ids = {
            idm: req.params.idm,
            idc: req.params.idc
        };

        serv.darServiciosMunCat(ids, (err, data) => {
            res.json(data);
        });

    });

    //elimina un servicio segun su id
    app.delete('/services/:id', jwts.validaAdmin, (req, res) => {
        var id = req.params.id;
        // console.log(req.params);
        //   console.log(req.params.id);
        serv.deleteServ(id, (err, resp) => {
            res.json(resp);
        });
    });

    // retorna un servicio con su id
    app.get('/servicess/:id', (req, res) => {
        var id = req.params.id;
        serv.darServiciosIdS(id, (err, resp) => {
            res.json(resp);
        });
    });

    app.get('/sservicio/:id', (req, res) => {
        var id = req.params.id;
        serv.onlyservicio(id, (err, resp) => {
            res.json(resp);
        });
    });

    //actualiza un servicio con la nueva informacion
    app.put('/servicioput', jwts.validaAdmin, (req, res) => {
        //console.log(req.body);
        var servi = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            duracion: req.body.duracion,
            max_citas: req.body.max_citas,
            video: req.body.video.split("/").pop(),
            precio: req.body.precio,
            descuento: req.body.descuento,
            precio_cliente_prevenir: req.body.precio - (req.body.precio * (req.body.descuento / 100)),
            direccion: req.body.direccion,
            categoria: req.body.id_ctga,
            id: req.body.id
        };
        // console.log(servi);
        serv.updateServ(servi, (err, resp) => {
            res.json(resp);
        });
    });

    app.get('/serviciosuc/:idsuc', (req, res) => {
        let ids = req.params.idsuc;
        serv.servisucu(ids, (err, resp) => {
            res.json(resp);
        })
    });

    app.get('/prom', (req, res) => {
        serv.pruebaP((err, resp) => {
            res.json(resp);
        });
    });

}