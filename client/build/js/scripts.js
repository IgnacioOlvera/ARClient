$('#vinetas').html(`<ul class="nav side-menu"> <li> <a href='/'> <i class="fa fa-home"></i> Inicio </a> </li></ul> `);

$('#logout').on('click', function () {
    localStorage.clear();
    window.location.replace("/login");
});
if (!localStorage.getItem('authorization') && window.location.pathname != '/login') {
    window.location.replace("/login");
}

function initInicio() {
    let modal = "";

    let tabla_reportes = $('#tablareportes').DataTable({
        ajax: {
            type: 'GET',
            url: '/getReports',
            headers: { authorization: localStorage.getItem('authorization') }
        },
        columns: [
            {
                data: '_id',
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: `typeInfo`,
                render: function (data, type, row, meta) {
                    return row.ServiceName + " Week:" + row.week
                }
            },
            { data: '_id' }
        ], "createdRow": function (row, data) {
            //modal += `<div style="display:none" id="InfoReporteModal-${data._id}" class="modal fade in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="modal-label-${data._id}">Información de Reporte</h4> </div> <div class="modal-body"> <div class="row"> <form id="InfoReporteForm-${data._id}" class="form-horizontal form-label-left"> <div class="col-md-6"> <div class="form-group"> <label>Name Of Service</label> <input type="text" disabled  style="background-color:transparent; border:none; box-shadow:none"  value="${data.ServiceName}" class="form-control" id="codeService" name="ServiceCode" placeholder="Enter Service Name"> </div> <div class="form-group"> <label>Invoice Number</label> <input type="text" disabled  style="background-color:transparent; border:none; box-shadow:none"  value="${data.invoice}" class="form-control" id="invoice" name="invoice" placeholder="Enter Invoice Number"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label>Lot Number QMC</label> <input type="text" disabled  style="background-color:transparent; border:none; box-shadow:none"  value="${data.LotNumber}" class="form-control" id="numberQMC" name="LotNumberQMC" placeholder="Enter Lot Number for QMC"> </div> <div class="form-group"> <label>Start Date</label> <input type=text disabled  style="background-color:transparent; border:none; box-shadow:none" name='fecha_inicio' value="${data.act_date}" placeholder="Fecha de Ingreso" class="form-control" id="fecha_inicio" aria-describedby="inputSuccess2Status"> </div> </div> </form> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-primary editar"  data-form="#InfoReporteForm-${data._id}" data-id="${data._id}">Guardar</button> </div> </div> </div> </div>`


            modal += `<div style="display:none" id="InfoReporteModal-${data._id}" class="modal fade in" tabindex="-1" role="dialog" aria-hidden="true" style="display: block; padding-right: 15px;"> <div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="modal-label-${data._id}">Información de Reporte</h4> </div> <div class="modal-body"> <div class="row"> <form id="InfoReporteForm-${data._id}" class="form-horizontal form-label-left"> <div class="col-md-6"> <div class="form-group"> <label>Name Of Service</label> <input disabled style="border:none; background-color:transparent box-shadow:none" type="text" value="${data.ServiceName}" class="form-control" id="codeService" name="ServiceName" placeholder="Enter Service Name"> </div> <div class="form-group"> <label>Invoice Number</label> <input disabled style="border:none; background-color:transparent; box-shadow:none" type="text" value="${data.invoice}" class="form-control" id="invoice" name="invoice" placeholder="Enter Invoice Number"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label>Lot Number QMC</label> <input disabled style="border:none; background-color:transparent; box-shadow:none;" type="text" value="${data.LotNumber}" class="form-control" id="numberQMC" name="LotNumberQMC" placeholder="Enter Lot Number for QMC"> </div> </div> </form><label><h3>Human Resource</h3></label><div id="employees-${data._id}"><div class="pull-right" style="display:block;"></div>`;

            for (let index = 0; index < data.hr.employees.length; index++) {
                const element = data.hr.employees[index];
                modal += `<div class="row" style="display:inline-block"> <form class="employees"> <div class="form-group col-md-4"> <label>Employee</label> <input disabled style="border:none; background-color:transparent; box-shadow:none" value="${element.employees}" type="text" id="employees" name="employees" placeholder="Empleados en Turno" class="form-control"> </div> <div class="form-group col-md-3"> <label>Turno</label> <select disabled id="shift" name="shift" class="form-control"><option value="${element.shift}">Turno ${element.shift}</option> <option value="1">Primer Turno</option> <option value="2">Segundo Turno</option> <option value="3">Tercer Turno</option> </select> </div> <div class="form-group col-md-4"> <label>Invested Hours</label> <input disabled style="border:none; background-color:transparent; box-shadow:none" type="text" value="${element.hours}" name="hours" placeholder="Hours Worked" class="form-control" id="hours"> </div> <div class="col-xs-1"></div> </form> </div>`;
            }

            modal += `</div><hr><div id="supervisors-${data._id}"> <div class="pull-right"> </div>`;

            for (let index = 0; index < data.hr.supervisors.length; index++) {
                const element = data.hr.supervisors[index];
                modal += `<div class="row" style="display:inline-block"> <form class="supervisor"> <div class="form-group col-md-4"> <label>Supervisors</label> <input disabled style="border:none; background-color:transparent; box-shadow:none" value="${element.employees}" type="text" id="supervisors" name="employees" placeholder="Empleados en Turno" class="form-control"> </div> <div class="form-group col-md-3"> <label>Turno</label> <select disabled id="shift" name="shift" class="form-control"><option value="${element.shift}">Turno ${element.shift}</option> <option value="1">Primer Turno</option> <option value="2">Segundo Turno</option> <option value="3">Tercer Turno</option> </select> </div> <div class="form-group col-md-4"> <label>Invested Hours</label> <input disabled style="border:none; background-color:transparent; box-shadow:none" value="${element.hours}" type="text" name="hours" placeholder="Hours Worked" class="form-control" id="hours"> </div> <div class="col-xs-1"></div> </form></div>`
            }

            modal += `</div></div> </div> <div class="modal-footer"> </div> </div> </div> </div>`;

            $(row).attr({ 'data-type': data.type });
            let op = $(row).children()[2];
            $(op).html(`<button type="button" class="btn btn-primary info" data-type="${data.type}" data-id="${data._id}" title="Ver Registros"><span class="fa fa-eye"></span></button><button type="button" class="btn btn-warning " data-toggle="modal"  title="Ver Información" data-target="#InfoReporteModal-${data._id}"><span class="fa fa-edit"></span></button>`);
        }, 'searching': false
    });
    let idReport = ""
    tabla_reportes.on('draw', function () {
        $('#tablareportes tbody tr').hide();
        $('#modales').html(modal);
        modal = "";
        $('.info').on('click', function () {
            $('#info').show();
            idReport = $(this).data('id');
            let type = $(this).data('type');
            $('#grafo').css('width', $('.x_content').width());
            $.ajax({
                url: `/types/${type}`,
                method: 'GET',
                headers: { authorization: localStorage.getItem("authorization") },
                success: function (result) {
                    let model = result.data[0];
                    report = model._id;
                    let columns = [{
                        data: '_id',
                        render: function (data, type, row, meta) {
                            return meta.row + meta.settings._iDisplayStart + 1;
                        }
                    }];
                    tabla = `<h3>${t}</h3><table class="table table-striped table-bordered logs" id="info-${model._id}">
                    <thead><tr><th>Item</th>`;
                    for (let index = 0; index < model.attributes.length; index++) {
                        const attr = model.attributes[index];
                        tabla += `<th name="${attr.alias}" data-type="${attr.dataType || null}" data-default="${attr.default}">${attr.name}</th>`
                        //Crear vector de columnas para ajax
                        columns.push({ mData: `values.${attr.alias}`, defaultContent: "" });
                    }
                    tabla += `</tr></thead></table>`
                    $('#logs').html(tabla);

                    tableLogs = $(`#info-${model._id}`).DataTable({
                        ajax: {
                            url: `/log/${idReport}`,
                            method: 'GET',
                            headers: { authorization: localStorage.getItem("authorization") }
                        },
                        keys: true,
                        'createdRow': function (row, data, dataIndex) {
                            $(row).attr('data-id', data._id);
                        },
                        aoColumns: columns,
                        "ordering": false, "searching": false, "paging": false, dom: 'Bfrtip',
                        buttons: [
                            {
                                extend: 'excel',
                                text: 'Save as Excel'
                            }
                        ]
                    });
                },
                failure: function (result) { },
                error: function (result) { }
            });
        });
    });
    let attrs = [];
    var t = ""

    $.ajax({
        url: "/types",
        type: 'GET',
        dataType: 'json',
        headers: { authorization: localStorage.getItem("authorization") },
        success: function (result) {
            let types = result.data;
            let content = "";
            for (let index = 0; index < types.length; index++) {
                const item = types[index];
                content += `<a data-type="${item._id}" data-index="${index}" data-owner="${item.customer}" class="btn btn-primary btn-lg btn-block btn-huge tipo">${item.name}</a>`;
                let a = [];
                for (let index = 0; index < item.attributes.length; index++) {
                    const element = item.attributes[index];
                    if (element.dataType == "number") {
                        a.push(element.alias);
                    }
                }
                attrs.push(a);
            }
            $('#tipos').html(content);
            $('.tipo').on('click', function () {
                $('#info').hide();
                $('.tipo').removeClass('active');
                $(this).addClass('active');
                $('#tablareportes tbody tr').show();
                $('#grafo').html("");
                $('#rName').html($(this).html())
                t = $(this).html();
                $('#tablareportes tbody').find('tr').hide();
                $('#tablareportes tbody').find(`[data-type=${$(this).data('type')}]`).show();
                let a = attrs[$(this).index()];
                $('#options').html("<div class='row'>");
                for (let index = 0; index < a.length; index++) {
                    $('#options').append(`<input class="options" class="col-md-1" type="checkbox" name="${a[index]}" value="${a[index]}"> ${a[index]}`)
                }
                $('#options').append("</div>");
                $('.options').on('click', function () {
                    let fields = "";
                    if ($('.options:checked').length > 0) {
                        let graphData = {
                            legend: [],
                            partes: [],
                            series: []
                        }
                        for (let index = 0; index < $('.options:checked').length; index++) {
                            const option = $('.options:checked')[index];
                            fields += `"${$(option).val()}":{ "$sum": "$values.${$(option).val()}"  },`;
                        }
                        $.ajax({
                            type: "PUT",
                            url: "/graphMaker/" + idReport,
                            data: { data: fields.slice(0, -1) },
                            dataType: "json",
                            headers: { authorization: localStorage.getItem("authorization") },
                            success: function (response) {
                                let info = response.data;
                                //recorre los registros
                                for (let index = 0; index < info.length; index++) {
                                    const part = info[index];//toma el registros
                                    graphData.partes.push(part._id)//agrega número de parte

                                    for (const key in part) {//recorre los valores del registro
                                        if (graphData.legend.indexOf(key) == -1 & key != "_id") {//agrega categorías que no sean :id
                                            graphData.legend.push(key);
                                        }
                                    }
                                }
                                for (let index = 0; index < graphData.legend.length; index++) {
                                    const value = graphData.legend[index];
                                    let data = []
                                    for (let log = 0; log < info.length; log++) {
                                        const parte = info[log];
                                        data.push(parte[value]);
                                    }
                                    graphData.series.push({
                                        name: value,
                                        type: 'bar',
                                        barGap: 0,
                                        data: data
                                    })
                                }
                                graphOptions = {
                                    color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'shadow'
                                        }
                                    },
                                    legend: {
                                        data: graphData.legend
                                    },
                                    toolbox: {
                                        show: true,
                                        orient: 'vertical',
                                        left: 'right',
                                        top: 'center',
                                        feature: {
                                            mark: { show: true },
                                            dataView: { show: true, title: 'Data View', readOnly: false, lang: ['Data View', 'Turn Off', 'Refresh'] },
                                            magicType: { show: true, title: { line: "Lines", bar: "Bars", stack: 'Stacks', tiled: 'Tiled' }, type: ['line', 'bar', 'stack', 'tiled'] },
                                            restore: { show: true, title: 'Restore' },
                                            saveAsImage: { show: true, title: "Save as Image" }
                                        }
                                    },
                                    xAxis: [
                                        {
                                            type: 'category',
                                            axisTick: { show: false },
                                            data: graphData.partes
                                        }
                                    ],
                                    yAxis: [
                                        {
                                            type: 'value'
                                        }
                                    ],
                                    series: graphData.series
                                };
                                let ng_graph = echarts.init(document.getElementById('grafo'));
                                ng_graph.setOption(graphOptions);

                            },
                            failure: function (result) {
                                $.notify(result.data)
                            },
                            error: function (result) {
                                $.notify(result.data)
                            }
                        });
                    } else {
                        $.notify("No data selected");
                    }
                });

            });

        },
        failure: function (result) {
            $.notify("Ha ocurrido un Error");
        },
        error: function (result) {
            window.location = '/login'
            $.notify("Ha ocurrido un Error");
        }
    });
}

function initParts() {
    let modales = "", select = "";

    let TablaPartes = $('#partes').DataTable({//Inicializar tabla de clientes.
        'ajax': {
            'url': '/getparts',
            'type': 'GET',
            "xhrFields": { withCredentials: true },
            "headers": { authorization: localStorage.getItem("authorization") },
        },
        columns: [
            { data: '_id' },
            { data: 'name' },
            { data: 'description' },
            { data: '_id' }
        ], "createdRow": function (row, data) {
            modales += `<div style="display:none" id="modal-${data._id}" class="modal fade  in" tabindex="-1" role="dialog" aria-hidden="true"
            style="display: block; padding-right: 15px;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">Información de Parte</h4>
                    </div>
                    <div class="modal-body">
                        <form id="info-parte-${data._id}" class="form-horizontal form-label-left">
                            <div class="col-md-12">
                                <div class="item form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12">
                                        Nombre de la Parte
                                        <span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <input type="text" value="${data.name}" name="nombre" id="nombre-${data._id}" class="form-control col-md-7 col-xs-12"
                                            placeholder="Nombre de la Parte" />
                                    </div>
                                </div>
                                <div class="item form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12">
                                        Número de Parte
                                        <span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <input type="text" name="part_number" value="${data.part_number}"  id="part_number-${data._id}" class="form-control col-md-7 col-xs-12"
                                            placeholder="Número de Parte" />
                                    </div>
                                </div>
                                <div class="item form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12">
                                        Descripción
                                        <span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <input type="text" name="descripcion" value="${data.description}"  id="descripcion-${data._id}" class="form-control col-md-7 col-xs-12"
                                            placeholder="Descripción" />
                                    </div>
                                </div>
                                <div class="item form-group">
                                    <label class="control-label col-md-3 col-sm-3 col-xs-12">
                                        Cliente
                                        <span class="required">*</span>
                                    </label>
                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                        <select class="form-control col-md-7 col-xs-12" name="cliente" id="selec_cliente_${data._id}">
                                        <option value="${data.fk_customer}" selected>${data.client}</option>
                                        ${select}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="editar-${data._id}" data-target="${data._id}" type="button" class="btn btn-primary editar">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>`;
            $(row).attr("data-parte", data._id);
            let op = $(row).children()[2];
            $(op).html(`<button type="button" class="btn btn-primary" data-toggle="modal" title="Editar" data-target="#modal-${data._id}"><span class="fa fa-edit"></span></button><button data-target="${data._id}" type="button" title="Eliminar" class="btn btn-danger eliminar"><span class="fa fa-times"></span></button>`);
            $('#modales').html(modales);
        }, "columnDefs": [
            {
                "targets": [0],
                "visible": false
            }
        ], "bPaginate": false, "searching": false, "ordering": false,
    }).draw();

    TablaPartes.on('draw', function () {
        $('.editar').on('click', function () {
            let parte = $(this).data("target");
            let form = $(`#info-parte-${parte}`).serializeObject();
            form.id_parte = parte;
            if (form.nombre !== undefined && form.descripcion !== undefined && form.cliente !== undefined && typeof form.nombre === "string" && typeof form.descripcion === "string" && typeof form.cliente === "string") {
                $.ajax({
                    url: "/parts/0",
                    type: 'POST',
                    dataType: "json",
                    headers: { authorization: localStorage.getItem("authorization") },
                    data: form,
                    xhrFields: { withCredentials: true },
                    success: function (result) {
                        $(`#modal-${parte}`).modal('toggle');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $.notify("Parte Editada Correctamente");
                        TablaPartes.ajax.reload().draw();
                    },
                    failure: function (result) {
                        $.notify("Ha ocurrido un Error");
                    },
                    error: function (result) {
                        $.notify("Ha ocurrido un Error");
                    }
                });
            } else {
                alert("Faltan Campos");
            }

        });
        $('.eliminar').on('click', async function () {
            $.ajax({
                url: "/part/" + $(this).data("target"),
                type: 'PUT',
                headers: { authorization: localStorage.getItem("authorization") },
                success: function () {
                    $.notify("Parte Eliminada Correctamente");
                    TablaPartes.ajax.reload().draw();
                },
                failure: function () {
                    $.notify("Ha ocurrido un Error");
                },
                error: function (result) {
                    $.notify("Ha ocurrido un Error");
                }
            });
        });
    });



    $('#registroParte').on('click', function () {
        let form = $('#RegistrarParteForm').serializeObject();
        if (form.nombre !== undefined && form.descripcion !== undefined && form.cliente !== undefined && typeof form.nombre === "string" && typeof form.descripcion === "string" && typeof form.cliente === "string") {
            $.ajax({
                url: "/parts/1",
                type: 'POST',
                dataType: "json",
                headers: { authorization: localStorage.getItem("authorization") },
                data: form,
                xhrFields: { withCredentials: true },
                success: function (result) {
                    TablaPartes.ajax.reload().draw()
                    $.notify("Parte Registrada Correctamente");
                    $(`#AgregarParteModal`).modal('toggle');
                },
                failure: function (result) {
                    $.notify("Ha ocurrido un Error");
                },
                error: function (result) {
                    $.notify("Ha ocurrido un Error");
                }
            });
        } else {
            $.notify("Ha ocurrido un Error");;
        }

    });
}

function initLogin() {
    $('#login').on('click', async function () {
        let data = {
            correo: $("#usuario").val(),
            pass: $("#pass").val()
        }
        if (data.correo != "" && data.pass != "") {
            $.ajax({
                url: '/log',
                type: 'POST',
                dataType: 'json',
                data: data,
                success: function (result) {
                    localStorage.setItem("authorization", result.token);
                    window.location.replace("/");
                },
                failure: function (result) {
                    $.notify(result.message);
                },
                error: function (result) {
                    $.notify(result.message);
                }
            });
        } else {
            $.notify('Falta Ingresar Usuario y/o Contraseña');
        }
    });
    $(document).on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#login').trigger("click");
        }
    });
}
(function ($) {//Función para transformar las formas en json
    $.fn.serializeObject = function () {

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };


        this.build = function (base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function (key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function () {

            // skip invalid keys
            if (!patterns.validate.test(this.name)) {
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if (k.match(patterns.push)) {
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if (k.match(patterns.fixed)) {
                    merge = self.build([], k, merge);
                }

                // named
                else if (k.match(patterns.named)) {
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);
function init_daterangepicker() {
    if ("undefined" != typeof $.fn.daterangepicker) {
        var a = function (a, b, c) {
            $("#reportrange span").html(a.format("DD/MMMM/YYYY") + " - " + b.format("DD/MMMM/YYYY"))
        }
            , b = {
                startDate: moment(),
                showDropdowns: !0,
                showWeekNumbers: !0,
                timePicker: !1,
                timePickerIncrement: 1,
                timePicker12Hour: !0,
                ranges: {
                    Hoy: [moment(), moment()],
                    Ayer: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                    "Últimos 7 días": [moment().subtract(6, "days"), moment()],
                    "Últimos 30 días": [moment().subtract(29, "days"), moment()],
                    "Este Mes": [moment().startOf("month"), moment().endOf("month")],
                    "Mes Pasado": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                },
                opens: "left",
                buttonClasses: ["btn btn-default"],
                applyClass: "btn-small btn-primary",
                cancelClass: "btn-small",
                format: "MM/DD/YYYY",
                separator: " a ",
                locale: {
                    applyLabel: "Terminar",
                    cancelLabel: "Limpiar",
                    fromLabel: "Desde",
                    toLabel: "Hasta",
                    customRangeLabel: "Personalizar",
                    daysOfWeek: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
                    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                    firstDay: 1
                }
            };
        $("#reportrange span").html(moment().subtract(29, "days").format("DD/MMMM/YYYY") + " - " + moment().format("DD/MMMM/YYYY")),
            $("#reportrange").daterangepicker(b, a),
            $("#reportrange").on("show.daterangepicker", function () {

            }),
            $("#reportrange").on("hide.daterangepicker", function () {

            }),
            $("#reportrange").on("apply.daterangepicker", async function (a, b) {
                let fecha_inicio = b.startDate.format("DD/MM/YYYY");
                let fecha_final = b.endDate.format("DD/MM/YYYY");
                let data = {};

                if (fecha_inicio == fecha_final) {
                    data.fecha = b.startDate.format("DD/MM/YYYY")

                } else {
                    data.fecha_inicio = b.startDate.format("DD/MM/YYYY");
                    data.fecha_final = b.endDate.format("DD/MM/YYYY");
                }
                let url = "/movimientosFecha"
                let options = {
                    method: 'post',
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json", authorization: getCookie("authorization") }
                }

                let pet = await fetch(url, options);
                let movimientos = await pet.json();
                $('#MovimientosInfo tbody tr').hide();
                movimientos.forEach(movimiento => {
                    $(`[data-id="${movimiento.id_movimiento}"]`).show();
                });
                mov.page.len(-1).draw();

            }),
            $("#reportrange").on("cancel.daterangepicker", function (a, b) {

            }),
            $("#options1").click(function () {
                $("#reportrange").data("daterangepicker").setOptions(b, a)
            }),
            $("#options2").click(function () {
                $("#reportrange").data("daterangepicker").setOptions(optionSet2, a)
            }),
            $("#destroy").click(function () {
                $("#reportrange").data("daterangepicker").remove()
            })
    }
}
