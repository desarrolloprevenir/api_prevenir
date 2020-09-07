const events = require('../models/eventos');
var moment = require('moment');
const jwts = require('../models/jwt');

module.exports = function(app) {

    //devuelvve la lista de todos los eventos posibles
    app.get('/events', (req, res) => {
        events.darEvents((err, resp) => {
            res.json(resp);
        });
    });

    //crea eventos
    app.post('/events', (req, res) => {
        //console.log(req.body);
        var Mend = parseInt(00);
        var hinicio = moment(req.body.start).format('HH:mm:ss');
        var Finicio = moment(req.body.start).format('YYYY-MM-DD');
        var horas = hinicio.split(":");
        var mins = horas[1];
        var hora = horas[0];
        hora = parseInt(hora);
        mins = parseInt(mins);
        minsEnd = mins + Mend;
        hora = hora;
        var Hstart = hora + ":" + "00" + ":00";
        var Hend = hora + 1 + ":" + "00" + ":00";
        var starts = Finicio + " " + Hstart;
        var ends = Finicio + " " + Hend;
        //var Hend = moment(ends).format('YYYY-MM-D HH:mm:ss');
        var eventss = {
            color: req.body.color,
            start: starts,
            end: ends,
            usuario: req.body.usuario,
            consultorio: req.body.consultorio,
            servicio: req.body.servicio,
            mascota: req.body.mascota
        };
        // console.log('/*/*/*/*/*/*MIRADAA DEL EVENTO COMO LLEGA');
        // console.log(req.body);
        //console.log(starts + " "+ends);
        events.agregarEvento(eventss, (err, data) => {
            res.json(data);
        });
    });

    // retorna eventos segun el id del usuario
    app.get('/events/:id', (req, res) => {
        var id = req.params.id;
        events.darEventsIdUsuario(id, (err, row) => {
            res.json(row);
        });
    });

    app.get('/eventsb/:id', (req, res) => {
        var id = req.params.id;
        // console.log(id);
        events.darEventsBenf(id, (err, row) => {
            res.json(row);
        });
    });

    app.get('/eventsco/:idc', (req, res) => {
        events.eventsConsultorio(req.params.idc, (err, resp) => {
            res.json(resp);
        })
    })

    // retorna eventos segun el id del servicio
    app.get('/sevents/:ids', (req, res) => {
        var ids = req.params.ids;
        events.darEventsIdService(ids, (err, row) => {
            res.json(row);
        });
    });



    // elimina eventos segun el id del evento
    app.delete('/events/:id/:masc', (req, res) => {
        var el = {
            id: req.params.id,
            masc: req.params.masc
        };
        // console.log(el);
        events.eliminarEvento(el, (err, row) => {
            res.json(row);
        });
    });

    app.delete('/eventss/:ide/:idc/:masc', jwts.validaAdmin, (req, res) => {
        // console.log('PARAMETrOS DEL REQUERIE');
        // console.log(req.params);
        // console.log('PARAMETrOS DEL REQUERIE');
        let ev = {
            ide: req.params.ide,
            idc: req.params.idc,
            cate: req.params.masc
        };
        //console.log(ev);
        events.delEventSuc(ev, (err, resp) => {
            res.json(resp);
        });
    });

    app.get('/eventser/:mes/:anio/:id_serv/:masc', (req, res) => {
        ev = {
            mes: req.params.mes,
            anio: req.params.anio,
            id_servicio: req.params.id_serv,
            id_mascotas: req.params.masc
        };
        events.eventsCalendar(ev, (err, resp) => {
            res.json(resp);
        });
    });




    // app.get('/eventsuc/:mes/:anio/:id_serv',(req,res)=>{
    //   res.json(['prueba']);
    // });


    app.get('/eventsuc/:mes/:anio/:id_serv/:id_suc/:masc/:idcon', (req, res) => {
        if (req.params.idcon == 0 || req.params.idcon == '0') {
            ev = {
                mes: req.params.mes,
                anio: req.params.anio,
                id_servicio: req.params.id_serv,
                id_sucursal: req.params.id_suc,
                id_mascotas: req.params.masc
            };
            events.eventsCalendarSuc(ev, (err, resp) => {
                // console.log(resp);
                res.json(resp);
            });

        } else {

            ev = {
                mes: req.params.mes,
                anio: req.params.anio,
                id_servicio: req.params.id_serv,
                id_sucursal: req.params.id_suc,
                id_mascotas: req.params.masc,
                id_consultorio: req.params.idcon
            };
            events.eventsCalendarSucCon(ev, (err, resp) => {
                // console.log(resp);
                res.json(resp);
            });

        }

    });


}