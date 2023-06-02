var tableTorneos;
var filtroTorneoDuracionMinima,filtroTorneoDuracionMaxima;
var selectFiltroNivelTorneo = "Todos";
var fechaMinimaTorneoCreacion,fechaMaximaTorneoCreacion;
var horaMinimaTorneoCreacion,horaMaximaTorneoCreacion;
var fechaMinimaTorneoInicio,fechaMaximaTorneoInicio;
var horaMinimaTorneoInicio,horaMaximaTorneoInicio;
var myModalCrearTorneo;


$(document).ready(function(){
    if(document.getElementById("tablaTorneos")) cargarTablaTorneos();
    if(document.getElementById("offCanvasFiltroTorneos")) cargarOffCanvasFiltroTorneo();
    if(document.getElementById("modalCrearTorneo")) cargarModalCrearTorneo();
});

function cargarTablaTorneos(){
    tableTorneos = $('#tablaTorneos').DataTable({
        ajax: {
            url: '../PHP/cargarTorneos.php',
            type: "POST",
            data: {metodo: "admin"}
        }
        ,
        "columns": [
            { "data": "idTorneo" },
            { "data": "nombre" },
            { "data": "duracion" },
            { "data": "nivelTorneoCartel"},
            { "data": "fechaCreacion" },
            { "data": "horaCreacion" },
            { "data": "fechaInicio" },
            { "data": "horaInicio" },
            { "data": "configurar" },
            { "data": "estadistica" }
        ]
        ,
        columnDefs: [
            { responsivePriority: 1, targets: [0,1,8,9] },
            { responsivePriority: 3, targets: [3] },
            { responsivePriority: 4, targets: [2]},
            { responsivePriority: 5, targets: [4,5,6,7]},
            {
                targets: [8,9],
                orderable: false
            }
        ]
        ,
        "order": [[ 0, "desc" ]]
        ,
        responsive: true
        ,
        responsive: {
            details: {
                renderer:   function ( api, rowIdx, columns ) {
                                var data = $.map( columns, function ( col, i ) {
                                    return col.hidden ?
                                        '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
                                            '<td>'+col.title+datoExtraFechaTorneo(i)+'</td> '+
                                            '<td class="text-end">'+col.data+'</td>'+
                                        '</tr>' :
                                        '';
                                } ).join('');

                                if(data){
                                    return '<table class="table">'+data+'</table>';
                                }
                                else return false;
                            }
            }
        }
        ,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]]
        ,
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast":"Último",
                "sNext":"Siguiente",
                "sPrevious": "Anterior"
            },
            "sProcessing":"Procesando...",
        }
        ,
        "dom": '<"filaDomDatatable"l<"filtrosTorneos">>rtp'
    });
    $(".filtrosTorneos").html('<div class="btn-group my-2" role="group" aria-label="Basic example"><button class="btn btn-primary px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroTorneos" aria-controls="offcanvasRight">Filtros</button><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalCrearTorneo">Crear Torneo</button></div>');
    setTimeout(function(){
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    },1000);
}

function datoExtraFechaTorneo(indiceTabla){
    switch(indiceTabla){
        case 4: return " de Creación:";
        case 5: return " de Creación:";
        case 6: return " Inicio:";
        case 7: return " Inicio:";
        case 8: return " Configurar:";
        case 9: return " Estadistica:";
        default: return ":";
    }
}

function cargarOffCanvasFiltroTorneo(){
    document.getElementById("offCanvasFiltroTorneos").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroTorneos" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5>Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="torneoFiltroBuscar" class="form-label">Nombre del torneo:</label>
                    <input type="text" id="torneoFiltroBuscar" class="form-control w-100">
                </div>
                <div class="filtroTorneo">
                    <label for="horaMinimaDuracion" class="form-label">Duración:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Minimo</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaMinimaDuracion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Maximo</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaMaximaDuracion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="selectFiltroTorneoNivel" class="form-label">Nivel torneo:</label>
                    <select id="selectFiltroTorneoNivel" class="form-select w-100" aria-label="Default select example">
                        <option value="Todos">Todos</option>
                        <option value="Bloqueado">Bloqueado</option>
                        <option value="Pausado">Pausado</option>
                        <option value="Publico">Publico</option>
                    </select>
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicioTorneoCreacion" class="form-label">Fecha Creacion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioTorneoCreacion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaInicioTorneoCreacion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="horaInicioTorneoCreacion" class="form-label">Hora creacion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaInicioTorneoCreacion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaFinTorneoCreacion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicioTorneoInicio" class="form-label">Fecha Inicio:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioTorneoInicio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFinTorneoInicio">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="horaInicioTorneoInicio" class="form-label">Hora Inicio:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaInicioTorneoInicio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaFinTorneoInicio">
                    </div>
                </div>
                <div class="filtroTorneo mx-auto">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosTorneos">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    filtroTorneoDuracionMinima = "00:00:00";
    filtroTorneoDuracionMaxima = "23:59:59";

    fechaMinimaTorneoCreacion = "1990-01-01";
    fechaMaximaTorneoCreacion = "3000-01-01";
    horaMinimaTorneoCreacion = "00:00:00";
    horaMaximaTorneoCreacion = "23:59:59";

    fechaMinimaTorneoInicio = "1990-01-01";
    fechaMaximaTorneoInicio = "3000-01-01";
    horaMinimaTorneoInicio = "00:00:00";
    horaMaximaTorneoInicio = "23:59:59";

    $("#horaMinimaDuracion").on("change",function(){
        if($("#horaMinimaDuracion").val() != "") filtroTorneoDuracionMinima = $("#horaMinimaDuracion").val();
        else filtroTorneoDuracionMinima = "00:00:00";
    });
    $("#horaMaximaDuracion").on("change",function(){
        if($("#horaMaximaDuracion").val() != "") filtroTorneoDuracionMaxima = $("#horaMaximaDuracion").val();
        else filtroTorneoDuracionMaxima = "23:59:59";
    });

    $("#selectFiltroTorneoNivel").on("change",function(){
        selectFiltroNivelTorneo = $("#selectFiltroTorneoNivel").val()
    });

    $("#fechaInicioTorneoCreacion").on("change",function(){
        if($("#fechaInicioTorneoCreacion").val() != "") fechaMinimaTorneoCreacion = $("#fechaInicioTorneoCreacion").val();
        else fechaMinimaTorneoCreacion = "1990-01-01";
    });
    $("#fechaFinTorneoCreacion").on("change",function(){
        if($("#fechaFinTorneoCreacion").val() != "") fechaMaximaTorneoCreacion = $("#fechaFinTorneoCreacion").val();
        else fechaMaximaTorneoCreacion = "3000-01-01";
    });
    $("#horaInicioTorneoCreacion").on("change",function(){
        if($("#horaInicioTorneoCreacion").val() != "") horaMinimaTorneoCreacion = $("#horaInicioTorneoCreacion").val();
        else horaMinimaTorneoCreacion = "00:00:00";
    });
    $("#horaFinTorneoCreacion").on("change",function(){
        if($("#horaFinTorneoCreacion").val() != "") horaMaximaTorneoCreacion = $("#horaFinTorneoCreacion").val();
        else horaMaximaTorneoCreacion = "23:59:59";
    });

    $("#fechaInicioTorneoInicio").on("change",function(){
        if($("#fechaInicioTorneoInicio").val() != "") fechaMinimaTorneoInicio = $("#fechaInicioTorneoInicio").val();
        else fechaMinimaTorneoInicio = "1990-01-01";
    });
    $("#fechaFinTorneoInicio").on("change",function(){
        if($("#fechaFinTorneoInicio").val() != "") fechaMaximaTorneoInicio = $("#fechaFinTorneoInicio").val();
        else fechaMaximaTorneoInicio = "3000-01-01";
    });
    $("#horaInicioTorneoInicio").on("change",function(){
        if($("#horaInicioTorneoInicio").val() != "") horaMinimaTorneoInicio = $("#horaInicioTorneoInicio").val();
        else horaMinimaTorneoInicio = "00:00:00";
    });
    $("#horaFinTorneoInicio").on("change",function(){
        if($("#horaFinTorneoInicio").val() != "") horaMaximaTorneoInicio = $("#horaFinTorneoInicio").val();
        else horaMaximaTorneoInicio = "23:59:59";
    });


    $("#filtrarDatosTorneos").on("click",function(){
        tableTorneos.columns(1).search($("#torneoFiltroBuscar").val());
        tableTorneos.draw();
    });

    $.fn.dataTable.ext.search.push(busquedaDuracionFiltroTorneo);
    $.fn.dataTable.ext.search.push(busquedaFechaFiltroTorneoCreacion);
    $.fn.dataTable.ext.search.push(busquedaHoraFiltroTorneoCreacion);
    $.fn.dataTable.ext.search.push(busquedaFechaFiltroTorneoInicio);
    $.fn.dataTable.ext.search.push(busquedaHoraFiltroTorneoInicio);
    $.fn.dataTable.ext.search.push(busquedaFiltroTorneoNivel);
}

function busquedaDuracionFiltroTorneo(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[2]);
    var minimo = new Date('2010/10/10 '+filtroTorneoDuracionMinima);
    var maximo = new Date('2010/10/10 '+filtroTorneoDuracionMaxima);
    if(( minimo <= date  && date <= maximo )) return true;
    console.log("Nande");
    return false;
}

function busquedaFechaFiltroTorneoCreacion(settings, data, dataIndex){
    var date = new Date(data[4]);
    var minimo = new Date(fechaMinimaTorneoCreacion);
    var maximo = new Date(fechaMaximaTorneoCreacion);
    if(( minimo <= date && date <= maximo )) return true;
    return false;
}

function busquedaHoraFiltroTorneoCreacion(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[5]);
    var minimo = new Date('2010/10/10 '+horaMinimaTorneoCreacion);
    var maximo = new Date('2010/10/10 '+horaMaximaTorneoCreacion);
    if(( minimo <= date  && date <= maximo )) return true;
    return false;
}

function busquedaFechaFiltroTorneoInicio(settings, data, dataIndex){
    var date = new Date(data[6]);
    var minimo = new Date(fechaMinimaTorneoInicio);
    var maximo = new Date(fechaMaximaTorneoInicio);
    if(( minimo <= date && date <= maximo )) return true;
    return false;
}

function busquedaHoraFiltroTorneoInicio(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[7]);
    var minimo = new Date('2010/10/10 '+horaMinimaTorneoInicio);
    var maximo = new Date('2010/10/10 '+horaMaximaTorneoInicio);
    if(( minimo <= date  && date <= maximo )) return true;
    return false;
}

function busquedaFiltroTorneoNivel(settings, data, dataIndex){
    if(selectFiltroNivelTorneo == 'Todos') return true;
    else{
        if(data[3] == selectFiltroNivelTorneo) return true;
        else return false; 
    }
}

function cargarModalCrearTorneo(){
    document.getElementById("modalCrearTorneo").outerHTML = `
    <div class="modal fade" id="modalCrearTorneo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Crear Torneo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="torneoNombreCreacion" class="form-label">Nombre del torneo:</label>
                    <input type="text" class="form-control" placeholder="Nombre" id="torneoNombreCreacion">
                    <div class="invalid-feedback" id="cartelErrorNombreTorneo"></div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary px-4" id="btn-crearTorneo">Crear</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalCrearTorneo = new bootstrap.Modal(document.getElementById('modalCrearTorneo'),{});

    $("#torneoNombreCreacion").on("keyup",function(){
        $("#torneoNombreCreacion").removeClass("is-invalid");
    });
    $("#btn-crearTorneo").on("click",function(){
        crearTorneo();
    }); 
}

function crearTorneo(){
    let nombreTorneo = $("#torneoNombreCreacion").val();
    if(nombreTorneo != ""){
        var exp = new RegExp(/^[A-Za-z0-9À-ÿ\u00f1\u00d1\s]+$/g);
        if(exp.test(nombreTorneo)){
            var datos = {
                nombreTorneo: nombreTorneo
            }
            $.ajax({
                url: "../PHP/crearTorneo.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    var resp = JSON.parse(respuesta);
                    if(resp.error){
                        myModalCrearTorneo.hide();
                        cartelNotificacion(resp.mensaje)
                        console.log(resp.descripcion);
                    }
                    else{
                        myModalCrearTorneo.hide();
                        cartelNotificacion("Torneo creado");
                        tableTorneos.ajax.reload(null, false);
                    }
                }
            });
        }
        else{
            cartelInput("torneoNombreCreacion",false,"cartelErrorNombreTorneo","Solo letras,numeros y espacios");
        }
    }   
    else{
        cartelInput("torneoNombreCreacion",false,"cartelErrorNombreTorneo","Completar el campo");
    }
}

