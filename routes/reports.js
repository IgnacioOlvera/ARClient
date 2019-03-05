var con = require('../connection.js');
var mongoose = require('mongoose');
var express = require('express');
var middleware = require('../middlewares/authentication.js');
var api = express.Router();
var Type = require('../models/type');
var Report = require('../models/report');
var Log = require('../models/log');
//get customers reports
api.get('/types/:id?', middleware.ensureAuth, function (req, res) {
    try {
        if (req.payload.nombre == "Operaciones" || req.payload.nombre == "Admon") {
            if (req.params.id) {
                Type.find({ _id: req.params.id }, function (err, types) {
                    if (err)
                        res.status(500).send({ data: "Server Internal Error" })
                    else {
                        res.status(200).send({ data: types });
                    }
                });
            } else {
                Type.find({}, function (err, types) {
                    if (err)
                        throw err
                    else {
                        res.status(200).send({ data: types });
                    }
                });
            }

        } else {
            if (req.params.id) {
                Type.find({ _id: req.params.id }, function (err, types) {
                    if (err)
                        res.status(500).send({ data: "Server Internal Error" })
                    else {
                        res.status(200).send({ data: types });
                    }
                });
            } else {
                Type.find({ customer: req.payload.id }, function (err, types) {
                    if (err)
                        throw err
                    else {
                        res.status(200).send({ data: types });
                    }
                });
            }
        }

    } catch (error) {
        res.status(500).send({ data: "Server Internal Error" })
    }

});

api.get('/log/:report', middleware.ensureAuth, function getLogs(req, res) {
    if (req.params.report) {
        let report = req.params.report
        Log.find({ "report": report }, { "values": 1 }, function (err, logs) {
            if (err) {
                res.status(500).send({ message: "Error al Obtener Registros" })
            } else {
                res.status(200).send({ data: logs })
            }
        });
    }
})

api.put('/graphMaker/:report', middleware.ensureAuth, function (req, res) {
    let fields = req.body.data;
    let query = `{ "$group":{ "_id":"$values.PartNumber", ${fields} } }`;
    try {
        query = JSON.parse(query);
        Log.aggregate([{ $match: { report: mongoose.Types.ObjectId(req.params.report) } }, query]).exec(function (err, rows) {
            if (err)
                res.status(500).send({ data: "Server Internal Error" })
            else {
                if (rows.length > 0) {
                    res.status(200).send({ data: rows })
                } else {
                    res.send({ data: "No records found" })
                }

            }
        })
    } catch (error) {
        res.status(500).send({ data: "Server Internal Error" })
    }



})

api.get('/getReports/:id?', middleware.ensureAuth, function (req, res) {
    if (req.params.id) {
        try {
            Report.aggregate([
                {
                    $match: {
                        "type": mongoose.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $addFields: {
                        week: {
                            $week: {
                                $dateFromString: {
                                    dateString: '$act_date',
                                    timezone: 'America/New_York'
                                }
                            }

                        }
                    }
                }
            ], function (err, types) {
                if (err)
                    throw err
                else {
                    res.status(200).send({ data: types });
                }
            });
        } catch (error) {
            res.status(500).send("Ocurrió un error");
        }
    } else {
        res.status(200).send({ data: [] });
    }
});
api.get('/getDetails/:id', function (req, res) {
    if (req.params.id) {
        Report.find({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, report) {
            if (err)
                throw err;
            else {
                res.status(200).send(report);
            }
        });
    }
});

api.get('/getGraphs/:report/:type', middleware.ensureAuth, function (req, res) {
    let customer = req.payload;
    let report = req.params.report;
    let type = req.params.type;
    if (type == '1') {
        let sql = `select p.part_number part_number, sum(l.ng1)  ng1, sum(l.ng2)  ng2, sum(l.ng3)  ng3, sum(l.ng4)  ng4, sum(l.ng5)  ng5, sum(l.ng6)  ng6, sum(l.ng7)  ng7, sum(l.ng8)  ng8, sum(l.ng9)  ng9 from reports r join inspectionreports_logs l on r._id = l.fk_report join parts p on l.fk_part = p._id where r._id = ${report} group by p.part_number `;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else {
                try {
                    let data = {};
                    data.partes = [];
                    data.series = [];
                    data.categorias = ['NG 1', 'NG 2', 'NG 3', 'NG 4', 'NG 5', 'NG 6', 'NG 7', 'NG 8', 'NG 9'];
                    data.ngs = [[], [], [], [], [], [], [], [], []];
                    for (let index = 0; index < rows.length; index++) {
                        const record = rows[index];
                        data.partes.push(record.part_number);
                        data.ngs[0].push(record.ng1);
                        data.ngs[1].push(record.ng2);
                        data.ngs[2].push(record.ng3);
                        data.ngs[3].push(record.ng4);
                        data.ngs[4].push(record.ng5);
                        data.ngs[5].push(record.ng6);
                        data.ngs[6].push(record.ng7);
                        data.ngs[7].push(record.ng8);
                        data.ngs[8].push(record.ng9);
                    }
                    for (let index = 0; index < 9; index++) {
                        data.series.push({
                            name: `NG ${index + 1}`,
                            type: 'bar',
                            data: data.ngs[index],
                            label: {
                                show: true,
                                position: 'inside',
                                fontStyle: 'italic'
                            }
                        });
                    }
                    res.send({ data: data });
                } catch (e) {

                }
            }
        });
    } else if (type == '2') {
        let sql = `select p.part_number part_number, sum(l.ng1)  ng1, sum(l.ng2)  ng2, sum(l.ng3)  ng3, sum(l.ng4)  ng4, sum(l.ng5)  ng5, sum(l.ng6)  ng6, sum(l.ng7)  ng7, sum(l.ng8)  ng8, sum(l.ng9)  ng9, sum(l.ng10)  ng10, sum(l.ng11)  ng11, sum(l.ng12)  ng12, sum(l.ng13)  ng13, sum(l.ng14)  ng14, sum(l.ng15)  ng15, sum(l.ng16)  ng16, sum(l.ng17)  ng17, sum(l.ng18)  ng18 from reports r join inspectionreports_logs l on r._id = l.fk_report join parts p on l.fk_part = p._id where r._id = ${report} group by p.part_number `;
        con.query(sql, function (err, rows) {
            if (err) throw err
            else {
                try {
                    let data = {};
                    data.partes = [];
                    data.series = [];
                    data.categorias = ['NG 1', 'NG 2', 'NG 3', 'NG 4', 'NG 5', 'NG 6', 'NG 7', 'NG 8', 'NG 9', 'NG 10', 'NG 11', 'NG 12', 'NG 13', 'NG 14', 'NG 15', 'NG 16', 'NG 17', 'NG 18'];
                    data.ngs = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
                    for (let index = 0; index < rows.length; index++) {
                        const record = rows[index];
                        data.partes.push(record.part_number);
                        data.ngs[0].push(record.ng1);
                        data.ngs[1].push(record.ng2);
                        data.ngs[2].push(record.ng3);
                        data.ngs[3].push(record.ng4);
                        data.ngs[4].push(record.ng5);
                        data.ngs[5].push(record.ng6);
                        data.ngs[6].push(record.ng7);
                        data.ngs[7].push(record.ng8);
                        data.ngs[8].push(record.ng9);
                        data.ngs[9].push(record.ng10);
                        data.ngs[10].push(record.ng11);
                        data.ngs[11].push(record.ng12);
                        data.ngs[12].push(record.ng13);
                        data.ngs[13].push(record.ng14);
                        data.ngs[14].push(record.ng15);
                        data.ngs[15].push(record.ng16);
                        data.ngs[16].push(record.ng17);
                        data.ngs[17].push(record.ng18);
                    }
                    for (let index = 0; index < 18; index++) {
                        data.series.push({
                            name: `NG ${index + 1}`,
                            type: 'bar',
                            data: data.ngs[index],
                            label: {
                                show: true,
                                position: 'inside',
                                fontStyle: 'italic'
                            }
                        });
                    }
                    res.send({ data: data });
                } catch (e) {

                }
            }
        });
    } else if (type == '3') {

    }

});

//Consultas para Clientes
//Piezas NG y errores de cliente
api.get('/getngparts', middleware.ensureAuth, function (req, res) {
    let customer = req.payload;
    con.query(`select p.part_number, p.name, sum(ng1 + ng2 + ng3 + ng4 + ng5 + ng6 + ng7 + ng8 + ng9 + ng10 + ng11 + ng11 + ng11 + ng11 + ng11 + ng11 + ng11 + ng12 + ng13 + ng14 + ng15 + ng16 + ng17 + ng18) total_ng, sum(ok_pcs)                                         ok, sum(pending_pcs)                                    pending from customers c join (select * from reports where fk_customer = ${customer.id}) r on c._id = r.fk_customer join inspectionreports_logs l on r._id = l.fk_report join parts p on l.fk_part = p._id group by l.fk_part;`, function (err, rows) {
        if (err) throw err
        else
            res.send(rows);
    });
});

//Piezas NG y OK ordenadas por fecha de cliente
api.get('/getokandngparts', middleware.ensureAuth, function (req, res) {
    let customer = req.payload;
    con.query(`select p.name part_name, sum(ok_pcs) ok,sum(ng_1 + ng_2 + ng_3 + ng_4 + ng_5 + ng_6 + ng_7 + ng_8) ng, sum(pending_pcs) pending from logs join (select * from reports where fk_customer = ${customer.id}) r on fk_report = r._id join parts p on r.fk_part = p._id group by p.name;`, function (err, data) {
        if (err) throw err
        else
            res.send(data);
    });
});

module.exports = api;