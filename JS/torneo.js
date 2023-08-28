var idTorneo;
var idProblema;

var tiempoRestoTorneo = 999;
var tiempoRestanteDetalleTorneo;
var banderaTiempoRestante = false;
var arrayTippyCargado = [];
var datosTorneo;

var tableProblema;

var tableEnvio;
var maxFechaEnvio,minFechaEnvio;
var maxTiempoEnvio,minTiempoEnvio;
var problemaFiltro = 0;
var respuestaFiltro = 'Todos';
var lenguajeFiltro = 'Todos';

var tablePregunta;
var maxFechaPregunta,minFechaPregunta;
var maxTiempoPregunta,minTiempoPregunta;
var problemaFiltroPregunta = 'Todos';
var ajaxReloadPregunta;
var preguntaRespuestaFiltro = 'Todos';

$(document).ready(function(){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);

    if(urlParams.get('idTorneo')) idTorneo = urlParams.get('idTorneo');
    else window.location = "index.html";

    if(urlParams.get('idTorneo')) idProblema = urlParams.get('idProblema');

    if(document.getElementById("l1")) document.getElementById("l1").href = "torneo.html?idTorneo="+idTorneo;
    if(document.getElementById("l2")) document.getElementById("l2").href = "envios.html?idTorneo="+idTorneo;
    if(document.getElementById("l3")) document.getElementById("l3").href = "tablero.html?idTorneo="+idTorneo;
    if(document.getElementById("l4")) document.getElementById("l4").href = "preguntas.html?idTorneo="+idTorneo;


    if(document.getElementById("modalEnvio")) cargarModalEnvio();
    if(document.getElementById("filtroOffcanvasEnvio")) cargarOffCanvasEnvio();
    if(document.getElementById("offCanvasPreguntas")) cargarOffCanvasPreguntas();
    if(document.getElementById("modalEditarVerPregunta")) cargarModalVerPregunta();
    if(document.getElementById("modalPreguntas")) cargarModalPreguntas();
    if(document.getElementById("offCanvasDatosTorneos")) cargarOffCanvasDatosTorneo();
    if(document.getElementById("cargarProblemasTorneo")) cargarProblemasDelTorneo();
    if(document.getElementById("cargarDatosProblemas")) cargarDatosProblema();
    if(document.getElementById("cargarTablaEnvios")) cargarEnvios();
    if(document.getElementById("preguntaTabla")) cargarTablaPreguntas();
});

function cargarDatosTorneo(){
    var datos = {
        idTorneo: idTorneo,
        metodo: 'torneo'
    };
    $.ajax({
        url: "../PHP/cargarTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                resp = resp.respuesta;
                console.log(resp);
                datosTorneo = {estado: resp.estado, fechaInicio: resp.fechaInicio, fechaFin: resp.fechaFin};
                if(resp.nombre != $("#torneoNombreMenu")) $("#torneoNombreMenu").html(resp.nombre+' <i class="bi bi-layout-sidebar-reverse"></i>');
                if(resp.nombre != $("#nombreTorneoOffCanvas").html()) $("#nombreTorneoOffCanvas").html(resp.nombre);
                if(parseInt(resp.posicion) != parseInt($("#posicionTabla").html())) $("#posicionTabla").html(resp.posicion);
                if(parseInt(resp.totalAceptado) != parseInt($("#numeroDeProblemasCorrectos").html())) $("#numeroDeProblemasCorrectos").html(resp.totalAceptado);
                if(parseInt(resp.numeroDeProblema) != parseInt($("#numeroTotalDeProblemas").html())) $("#numeroTotalDeProblemas").html(resp.numeroDeProblema);
                if(resp.ultimosEnvios.length){
                    let template = '';
                    resp.ultimosEnvios.forEach(envio => {
                        template += `
                            <tr id="envio${envio.idEnvio}">
                                <td data-bs-toggle="tooltip2" data-bs-placement="left" title="${envio.nombre}">${envio.letra}</td>
                                <td>${envio.respuesta}</td>
                            </tr>
                        `;
                    });
                    $("#contenidoUltimosEnviosOffCanvas").html(template);
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip2"]'))
                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl)
                    });
                }
                else{
                    $("#contenidoUltimosEnviosOffCanvas").html(`
                        <tr>
                            <td colspan="3" class="text-center">Ningun envio encontrado</td>
                        </tr>
                    `);
                }
                if(!resp.estado){
                    $("#tiempoRestanteOffCanvas").html(resp.duracion);
                }
                else{
                    if(resp.estado == 1){
                        if(!banderaTiempoRestante){
                            $("#progreso-inicio-fin-torneo").attr('max',(new Date(resp.fechaFin)-new Date(resp.fechaInicio)))
                            mostrarTiempoRestanteTorneo();
                            banderaTiempoRestante = true;
                        }
                    }
                    else{
                        $("#progreso-inicio-fin-torneo").attr('max',(new Date(resp.fechaFin)-new Date(resp.fechaInicio)))
                        $("#progreso-inicio-fin-torneo").attr('value',(new Date(resp.fechaFin)-new Date(resp.fechaInicio)))
                        $("#tiempoRestanteOffCanvas").html('Finalizado');
                    }
                }
            }
        }
    });
}

function cargarOffCanvasDatosTorneo(){
    document.getElementById("offCanvasDatosTorneos").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasDatosTorneo" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="nombreTorneoOffCanvas"></h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="d-flex justify-content-between mb-2">
                <span>Tiempo restante:</span>
                <span id="tiempoRestanteOffCanvas"></span>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>Inicio</span>
                    <span class="text-end">Fin</span>
                </div>
                <div class="progress w-100">
                    <progress id="progreso-inicio-fin-torneo" max="100" value="0" class="bg-white w-100"></progress>
                </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-2">
                <span>Posición en la tabla:</span>
                <span id="posicionTabla">0</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span># Problemas correctos:</span>
                <span id="numeroDeProblemasCorrectos"></span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <span>Total de problemas:</span>
                <span id="numeroTotalDeProblemas"></span>
            </div>
            <hr>
            <div>
                <span>Mis ultimos envios:</span>
                <table class="table" style="font-size: 13px;">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th w-100></th>
                        </tr>
                    </thead>
                    <tbody id="contenidoUltimosEnviosOffCanvas"></tbody>
                </table>
            </div>
        </div>
    </div>
    `;
    cargarDatosTorneo();
}

function cargarProblemasDelTorneo(){
    var datos = {
        idTorneo: idTorneo,
        tabla: 'NO'
    }
    $.ajax({
        url: "../PHP/cargarProblemasTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.mostrar){
                    document.getElementById("cargarProblemasTorneo").innerHTML = `
                        <table id="problemaTabla" class="table table-hover nowrap" style="width: 100%; font-size: 14px;">
                            <thead class="borderEspecialTabla">
                                <tr>
                                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Letra">#</th>
                                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Titulo del problema" class="w-100">Nombre</th>
                                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Tiempo limite en segundos">Tiempo</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    `;
                    tableProblema = $('#problemaTabla').DataTable({
                        ajax: {
                            url: '../PHP/cargarProblemasTorneo.php',
                            type: "POST",
                            data: {idTorneo: idTorneo, tabla: 'SI'}
                        }
                        ,
                        "columns": [
                            { "data": "letra" },
                            { "data": "titulo" },
                            { "data": "limite" },
                            { "data": "envio" },
                            { "data": "verproblema" }
                        ]
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
                        columnDefs: [ 
                            { responsivePriority: 1, targets: [0,1,4] },
                            { responsivePriority: 2, targets: [3] },
                            { responsivePriority: 3, targets: [2] },
                            {
                                targets: [3,4],
                                orderable: false
                            }
                        ]
                        ,
                        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]]
                        ,
                        "dom": '<"filaDomDatatable"lf<"todos-los-problemas">>rtp'
                        ,
                        responsive: true
                        ,
                        responsive: {
                            details: {
                                renderer:   function ( api, rowIdx, columns ) {
                                                var data = $.map( columns, function ( col, i ) {
                                                    return col.hidden ?
                                                        '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
                                                            '<td>'+ ((col.title != '') ? (col.title+':') : 'Boton:') +'</td> '+
                                                            '<td class="text-end">'+col.data+'</td>'+
                                                        '</tr>' :
                                                        '';
                                                } ).join('');
    
                                                if(data){
                                                    return '<table class="table table-dark table-hover">'+data+'</table>';
                                                }
                                                else return false;
                                            }
                            }
                        }
                    });
                    $("div.todos-los-problemas").html('<a href="problema.html?idTorneo='+idTorneo+'&idProblema=todos" class="btn btn-sm btn-secondary" role="button" target="_blank">Ver todos los problemas</a>');
                    $("div.dataTables_length").addClass("my-2");
                    $("div.dataTables_filter").addClass("my-2");
                    $("div.todos-los-problemas").addClass("my-2");
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl)
                    });

                    setTimeout(function(){tableProblema.ajax.reload(null, false);},10000);  
                }
                else{
                    document.getElementById("cargarProblemasTorneo").innerHTML = `
                        <div class="card-body p-5">
                            <h4 class="card-title text-center">Inicia en:</h4>
                            <h1 class="card-title text-center" id="time-torneo1"></h1>
                            <p class="card-text text-center fs-5 text-muted" id="time-torneo2"></p>
                        </div>
                    `;
                    mostrarTiempoRestante();
                }
            }
        }
    });
}

$(document).on('click', '.accionEnvio', function(){
    let element = $(this)[0].parentElement.parentElement;
    let idP = $(element).attr('idProblema');
    document.getElementById("selectedProblemaEnvio").value = idP;
    myModalEnvioTorneo.show();
});

$(document).on('click', '.accionEnvioProblema', function(){
    let element = $(this)[0].parentElement;
    let idP = $(element).attr('idProblema');
    document.getElementById("selectedProblemaEnvio").value = idP;
    myModalEnvioTorneo.show();
});

function cargarDatosProblema(){
    var datos = {
        idProblema: idProblema,
        idTorneo: idTorneo
    }
    $.ajax({
        url: "../PHP/cargarProblema.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.mostrar){
                    let template = '';
                    let titulo = '';
                    resp.lista.forEach(problema => {
                        titulo = problema.letra + ' - ' +problema.titulo;
                        template += `
                            <div class="hoja-problema">
                                <div class="d-flex justify-content-between align-items-end">
                                    <p class="titulo-problema">${problema.titulo}</p>
                                    <p class="letra-problema">Problema: ${problema.letra}</p>
                                </div>
                                <hr>
                                <div class="text-justify texto-legible">${problema.descripcion}</div>
                                <p class="sub-titulo-problema">Entrada</p>
                                <hr>
                                <div class="text-justify texto-legible">${problema.entrada}</div>
                                <p class="sub-titulo-problema">Salida</p>
                                <hr>
                                <div class="text-justify texto-legible">${problema.salida}</div>
                                <p class="sub-titulo-problema">Ejemplos</p>
                        `;
                        problema.tests.forEach(test => {
                            template += `
                                <div class="card mb-3">
                                    <div class="card-header">Entrada</div>
                                    <div class="card-body">${test.testEntrada}</div>
                                </div>
                                <div class="card mb-3">
                                    <div class="card-header">Salida</div>
                                    <div class="card-body">${test.testSalida}</div>
                                </div>
                            `;
                        });
                        template += `
                                <div class="w-100 footerEnvio">
                                    <div class="input-group" idProblema="${problema.idProblemas}">
                                        <input type="text" class="form-control bg-white" value="Problema ${problema.letra}: ${problema.titulo}" readonly>
                                        <button class="btn btn-primary accionEnvioProblema" type="button">Enviar <i class="bi bi-file-earmark-arrow-up"></i></button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    if(idProblema == 'todos') $(document).prop('title', 'Todos los problemas');
                    else $(document).prop('title', titulo);
                    document.getElementById("cargarDatosProblemas").innerHTML = template;
                }
                else{
                    cartelNotificacion("Torneo no iniciado");
                    console.log("El torneo no dio inicio aun");
                }
            }
        }
    });
}

function mostrarTiempoRestante(){
    mostrarTiempoRestanteCartel();
    tiempoRestanteDetalleTorneo = setInterval(mostrarTiempoRestanteCartel,1000);
}

function mostrarTiempoRestanteCartel(){
    let valor = mostrarTiempoRestanteMasDetalle(parseInt((new Date(datosTorneo.fechaInicio)-Date.now())/1000));
    let n = valor.length;
    if(n){
        document.getElementById("time-torneo1").innerHTML = valor[0];
        let template = '';
        for(let i=1;i<n;i++){
            template += valor[i]+' ';
        }
        document.getElementById("time-torneo2").innerHTML = template;
        tiempoRestoTorneo--;
    }
    else{
        cargarDatosTorneo();
        cargarProblemasDelTorneo();
        clearInterval(tiempoRestanteDetalleTorneo);
    }
}

function mostrarTiempoRestanteTorneo(){
    mostrarTiempoRestanteCartelTorneo();
    tiempoRestanteDetalleTorneo = setInterval(mostrarTiempoRestanteCartelTorneo,1000);
}

function mostrarTiempoRestanteCartelTorneo(){
    let valor = mostrarTiempoRestanteMasDetalle(parseInt((new Date(datosTorneo.fechaFin)-Date.now())/1000));
    let n = valor.length;
    if(n){
        let template = '';
        for(let i=0;i<n;i++){
            template += valor[i]+' ';
        }
        $("#tiempoRestanteOffCanvas").html(template);
        $("#progreso-inicio-fin-torneo").attr('value',(Date.now()-new Date(datosTorneo.fechaInicio)));
    }
    else{
        $("#progreso-inicio-fin-torneo").attr('max',100);
        $("#progreso-inicio-fin-torneo").attr('value',100);
        $("#tiempoRestanteOffCanvas").html("Finalizado");
        clearInterval(tiempoRestanteDetalleTorneo);
    }
}

function cargarModalEnvio(){
    document.getElementById("modalEnvio").outerHTML = `
        <div class="modal fade" id="modalEnvioTorneo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Envio</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="selectedProblemaEnvio" class="form-label">Problema:</label>
                        <select class="form-select mb-3" id="selectedProblemaEnvio" aria-label="Seleccione un problema"></select>
                        <label for="archivo-envio-torneo" class="form-label">Archivo solución:</label>
                        <input id="archivo-envio-torneo" name="envio" type="file" class="file" data-show-preview="false">
                        <div id="kartik-file-errors"></div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="enviarProblema();">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    myModalEnvioTorneo = new bootstrap.Modal(document.getElementById('modalEnvioTorneo'),{});
    $("#archivo-envio-torneo").fileinput({
        uploadUrl: "../PHP/envio.php", 
        uploadAsync: false,
        minFileCount: 1,
        maxFileCount: 1,
        showUpload: false, 
        showRemove: false,
        autoReplace: true,
        language: 'es',
        elErrorContainer: '#kartik-file-errors',
        allowedFileExtensions: ["cpp", "c", "java","py"]
    });
    cargarSelectModalProblema();
}

function cargarSelectModalProblema(){
    var datos = {
        idTorneo: idTorneo,
        tabla: 'NO'
    }
    $.ajax({
        url: "../PHP/cargarProblemasTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.mostrar){
                    let template = '';
                    resp.lista.forEach(problema => {
                        template += '<option value='+problema.idProblema+'>'+problema.letra+' - '+problema.titulo+'</option>';
                    });
                    document.getElementById("selectedProblemaEnvio").innerHTML = template;
                }
            }

        }
    });
}

function cargarOffCanvasEnvio(){
    document.getElementById("filtroOffcanvasEnvio").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroEnvio" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="problemas-envio" class="form-label">Problema:</label>
                    <select id="problemas-envio" class="form-select w-100" aria-label="Default select example"></select>
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicioEnvio" class="form-label">Fecha del envio:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioEnvio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFinEnvio">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="tiempoInicioEnvio" class="form-label">Hora del envio:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="tiempoInicioEnvio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="tiempoFinEnvio">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="respuestaEnvio" class="form-label">Respuesta:</label>
                    <select id="respuestaEnvio" class="form-select w-100" aria-label="Default select example">
                        <option value="Todos" selected>Todos</option>
                        <option value="Aceptado">Aceptado</option>
                        <option value="Respuesta Incorrecta">Respuesta Incorrecta</option>
                        <option value="Error en tiempo de Ejecucion">Error en tiempo de Ejecucion</option>
                        <option value="Tiempo Limite Excedido">Tiempo Limite Excedido</option>
                        <option value="Compilacion Fallida">Compilacion Fallida</option>
                        <option value="En espera">En espera</option>
                    </select>
                </div>
                <div class="filtroTorneo">
                    <label for="lenguaje" class="form-label">Lenguaje:</label>
                    <select id="lenguaje" class="form-select w-100" aria-label="Default select example">
                        <option value="Todos" selected>Todos</option>
                        <option value="C">C</option>
                        <option value="C++">C++</option>
                        <option value="Java">Java</option>
                        <option value="Python">Python</option>
                    </select>
                </div>
                <div class="filtroTorneo mx-auto">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosEnvio">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    cargarSelectOffCanvasProblema();
    minTiempoEnvio = new Date("10/10/2010 00:00:00");
    maxTiempoEnvio = new Date("10/10/2010 23:59:59");
    minFechaEnvio = new Date("1/1/1900");
    maxFechaEnvio = new Date("1/1/3000");

    if(document.getElementById("filtrarDatosTorneo")){
        document.getElementById("filtrarDatosTorneo").addEventListener("click",function(){
            table.draw();
        });
    }
    if(document.getElementById("fechaInicioEnvio")){
        document.getElementById("fechaInicioEnvio").addEventListener("change",function(){
            if(document.getElementById("fechaInicioEnvio").value == "") minFechaEnvio = new Date("1/1/1900");
            else minFechaEnvio = new Date(document.getElementById("fechaInicioEnvio").value);  
        });
    }
    if(document.getElementById("fechaFinEnvio")){
        document.getElementById("fechaFinEnvio").addEventListener("change",function(){
            if(document.getElementById("fechaFinEnvio").value == "") maxFechaEnvio = new Date("1/1/3000");
            else maxFechaEnvio = new Date(document.getElementById("fechaFinEnvio").value); 
        });
    }
    if(document.getElementById("tiempoInicioEnvio")){
        document.getElementById("tiempoInicioEnvio").addEventListener("change",function(){
            if(document.getElementById("tiempoInicioEnvio").value == "") minTiempoEnvio = new Date("10/10/2010 00:00:00");
            else minTiempoEnvio = new Date("10/10/2010 "+document.getElementById("tiempoInicioEnvio").value);  
        });
    }
    if(document.getElementById("tiempoFinEnvio")){
        document.getElementById("tiempoFinEnvio").addEventListener("change",function(){
            if(document.getElementById("tiempoFinEnvio").value == "") maxTiempoEnvio = new Date("10/10/2010 23:59:59");
            else maxTiempoEnvio = new Date("10/10/2010 "+document.getElementById("tiempoFinEnvio").value); 
        });
    }
    if(document.getElementById("problemas-envio")){
        document.getElementById("problemas-envio").addEventListener("change",function(){
            problemaFiltro = document.getElementById("problemas-envio").value;
        });
    }
    if(document.getElementById("respuestaEnvio")){
        document.getElementById("respuestaEnvio").addEventListener("change",function(){
            respuestaFiltro = document.getElementById("respuestaEnvio").value;
        });
    }
    if(document.getElementById("lenguaje")){
        document.getElementById("lenguaje").addEventListener("change",function(){
            lenguajeFiltro = document.getElementById("lenguaje").value;
        });
    }
    if(document.getElementById("filtrarDatosEnvio")){
        document.getElementById("filtrarDatosEnvio").addEventListener("click",function(){
            tableEnvio.draw();
        });
    }

    $.fn.dataTable.ext.search.push(busquedaFechaFiltroEnvio);
    $.fn.dataTable.ext.search.push(busquedaTiempoFiltro);
    $.fn.dataTable.ext.search.push(busquedaProblemasFiltro);
    $.fn.dataTable.ext.search.push(busquedaRespuestaFiltro);
    $.fn.dataTable.ext.search.push(busquedaLenguajeFiltro);
}

function cargarSelectOffCanvasProblema(){
    var datos = {
        idTorneo: idTorneo,
        tabla: 'NO'
    }
    $.ajax({
        url: "../PHP/cargarProblemasTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.mostrar){
                    let template = '<option value="0">Todos</option>';
                    resp.lista.forEach(problema => {
                        template += '<option value='+problema.letra+'>'+problema.letra+' - '+problema.titulo+'</option>';
                    });
                    document.getElementById("problemas-envio").innerHTML = template;
                }
            }

        }
    });
}

function busquedaFechaFiltroEnvio(settings, data, dataIndex){
    let fecha = data[3].split('-')
    var date = new Date(fecha[1]+'/'+fecha[0]+'/'+fecha[2]);
    if(( minFechaEnvio <= date  && date <= maxFechaEnvio )) return true;
    return false;
}

function busquedaTiempoFiltro(settings, data, dataIndex){
    var time = new Date("10/10/2010 "+data[4]);
    if(( minTiempoEnvio <= time  && time <= maxTiempoEnvio )) return true;
    return false;
}

function busquedaProblemasFiltro(settings, data, dataIndex){
    if(parseInt(problemaFiltro) == 0) return true;
    else{
        if(problemaFiltro == data[1]) return true;
        else return false; 
    }
}

function busquedaRespuestaFiltro(settings, data, dataIndex){
    if(respuestaFiltro == 'Todos') return true;
    else{
        if(data[5].includes(respuestaFiltro)) return true;
        else return false; 
    }
}

function busquedaLenguajeFiltro(settings, data, dataIndex){
    if(lenguajeFiltro == 'Todos') return true;
    else{
        if(data[6] == lenguajeFiltro) return true;
        else return false; 
    }
}

function cargarEnvios(){
    var datos = {
        idTorneo: idTorneo
    }
    tableEnvio = $('#envioTabla').DataTable({
        ajax: {
            url: '../PHP/cargarEnvios.php',
            type: "POST",
            data: datos
        }
        ,
        "columns": [
            { "data": "idEnvio" },
            { "data": "letra" },
            { "data": "titulo" },
            { "data": "fechaEnvio" },
            { "data": "horaEnvio" },
            { "data": "respuesta" },
            { "data": "lenguaje" }
        ]
        ,
        columnDefs: [
            { responsivePriority: 1, targets: [1,2,5] },
            { responsivePriority: 2, targets: [0] },
            { responsivePriority: 3, targets: [6]},
            { responsivePriority: 4, targets: [3,4]}
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
                                            '<td>'+col.title+':'+'</td> '+
                                            '<td class="text-end">'+col.data+'</td>'+
                                        '</tr>' :
                                        '';
                                } ).join('');

                                if(data){
                                    return '<table class="table table-hover table-light">'+data+'</table>';
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
        "dom": '<"filaDomDatatable"l<"filtrosEnvios">>rtp'
    });
    $("div.filtrosEnvios").html('<div class="btn-group my-2" role="group" aria-label="Basic example"><button class="btn btn-primary px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroEnvio" aria-controls="offcanvasRight">Filtros</button><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalEnvioTorneo">Enviar <i class="bi bi-file-earmark-arrow-up"></i></button></div>');
    $("div.dataTables_length").addClass("my-2");

    setTimeout(function(){tableEnvio.ajax.reload(null, false);},30000); 
}

function enviarProblema(){
    var datos = new FormData();
    datos.append('archivo',$('#archivo-envio-torneo')[0].files[0]);
    datos.append('idProblema',document.getElementById("selectedProblemaEnvio").value);
    datos.append('idTorneo',idTorneo);
    $.ajax({
        url: "../PHP/subirEnvio.php",
        type: "POST",
        data: datos,
        processData: false,
        contentType: false,
        cache: false,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalEnvioTorneo.hide();
            }
            else{
                if(resp.envio){
                    juez(resp.idEnvio);
                }
                cartelNotificacion(resp.mensaje);
                myModalEnvioTorneo.hide();
            }
        }
    });
}

function juez(idEnv){
    var datos = {
        idEnvio: idEnv,
        idTorneo: idTorneo
    }
    $.ajax({
        async: true,
        url: "../PHP/juez.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                console.log(resp.descripcion);
            }
            cartelNotificacion(resp.mensaje);
            tableEnvio.ajax.reload(null, false);
        }
    });
}

function cargarTablaPreguntas(){
    var datos = {
        idTorneo: idTorneo
    }
    tablePregunta = $('#preguntaTabla').DataTable({
        ajax: {
            url: '../PHP/cargarPreguntas.php',
            type: "POST",
            data: datos
        }
        ,
        "columns": [
            { "data": "indice" },
            { "data": "idPregunta" },
            { "data": "usuario" },
            { "data": "problemaTitulo" },
            { "data": "pregunta" },
            { "data": "respuesta"},
            { "data": "fechaPregunta" },
            { "data": "horaPregunta" },
            { "data": "acciones" }
        ]
        ,
        columnDefs: [
            { responsivePriority: 1, targets: [6,8] },
            { responsivePriority: 2, targets: [3,4,5] },
            { responsivePriority: 3, targets: [2] },
            { responsivePriority: 4, targets: [1]},
            { responsivePriority: 5, targets: [6,7]},
            {
                targets: [8],
                orderable: false
            }
            ,
            {
                targets: [0],
                visible: false
            }
        ]
        ,
        "order": [[ 0, "asc" ]]
        ,
        responsive: true
        ,
        responsive: {
            details: {
                renderer:   function ( api, rowIdx, columns ) {
                                var data = $.map( columns, function ( col, i ) {
                                    return col.hidden ?
                                        '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
                                            '<td>'+col.title+':'+'</td> '+
                                            '<td class="text-end">'+col.data+'</td>'+
                                        '</tr>' :
                                        '';
                                } ).join('');

                                if(data){
                                    return '<table class="table table-hover table-light">'+data+'</table>';
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
        "dom": '<"filaDomDatatable"l<"filtrosMisPregunta">>rtp'
    });
    $("div.filtrosMisPregunta").html('<div class="btn-group my-2" role="group" aria-label="Basic example"><button class="btn btn-primary px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroPregunta" aria-controls="offcanvasRight">Filtros</button><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#modalPreguntar">Preguntar</button></div>');

    ajaxReloadPregunta = setInterval(function(){tablePregunta.ajax.reload( null, false );},10000);
}

function cargarOffCanvasPreguntas(){
    document.getElementById("offCanvasPreguntas").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroPregunta" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="usuario-pregunta" class="form-label">Usuario:</label>
                    <input id="usuario-pregunta" class="form-control w-100" placeholder="Usuario">
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicioPregunta" class="form-label">Fecha de la pregunta:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioPregunta">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFinPregunta">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="horaInicioPregunta" class="form-label">Hora de la pregunta:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaInicioPregunta">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaFinPregunta">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="problema-pregunta" class="form-label">Problema:</label>
                    <select id="problema-pregunta" class="form-select w-100" aria-label="Default select example"></select>
                </div>
                <div class="mb-3">
                    <label for="pregunta1" class="form-label">Preguntas:</label>
                    <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="pregunta1" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="pregunta1">Todas</label>

                        <input type="radio" class="btn-check" name="btnradio" id="pregunta2" autocomplete="off">
                        <label class="btn btn-outline-primary" for="pregunta2">Sin responder</label>

                        <input type="radio" class="btn-check" name="btnradio" id="pregunta3" autocomplete="off">
                        <label class="btn btn-outline-primary" for="pregunta3">Respondida</label>
                    </div>
                </div>
                <div class="filtroTorneo">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosPregunta">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    minFechaPregunta = "1990-01-01";
    maxFechaPregunta = "3000-01-01";
    minTiempoPregunta = "00:00:00";
    maxTiempoPregunta = "23:59:59";

    document.getElementById("fechaInicioPregunta").addEventListener("change",function(){
        if(document.getElementById("fechaInicioPregunta").value != '') minFechaPregunta = document.getElementById("fechaInicioPregunta").value;
        else minFechaPregunta = "1990-01-01";
    });
    document.getElementById("fechaFinPregunta").addEventListener("change",function(){
        if(document.getElementById("fechaFinPregunta").value != '') maxFechaPregunta = document.getElementById("fechaFinPregunta").value;
        else maxFechaPregunta = "3000-01-01";
    });
    document.getElementById("horaInicioPregunta").addEventListener("change",function(){
        if(document.getElementById("horaInicioPregunta").value != '') minTiempoPregunta = document.getElementById("horaInicioPregunta").value;
        else minTiempoPregunta = "00:00:00";
    });
    document.getElementById("horaFinPregunta").addEventListener("change",function(){
        if(document.getElementById("horaFinPregunta").value != '') maxTiempoPregunta = document.getElementById("horaFinPregunta").value;
        else maxTiempoPregunta = "23:59:59";
    });
    document.getElementById("problema-pregunta").addEventListener("change",function(){
        problemaFiltroPregunta = document.getElementById("problema-pregunta").value;
    });
    document.getElementById("pregunta1").addEventListener("click",function(){
        preguntaRespuestaFiltro = 'Todos';
    });
    document.getElementById("pregunta2").addEventListener("click",function(){
        preguntaRespuestaFiltro = 'SR';
    });
    document.getElementById("pregunta3").addEventListener("click",function(){
        preguntaRespuestaFiltro = 'CR';
    });
    $.fn.dataTable.ext.search.push(busquedaFechaFiltroPregunta);
    $.fn.dataTable.ext.search.push(busquedaProblemasFiltroPregunta);
    $.fn.dataTable.ext.search.push(busquedaTiempoFiltroPregunta);
    $.fn.dataTable.ext.search.push(busquedaRespuestaFiltroPregunta);
    document.getElementById("filtrarDatosPregunta").addEventListener("click",function(){
        tablePregunta.columns(2).search(document.getElementById("usuario-pregunta").value);
        tablePregunta.draw();
    }); 
    cargarSelectOffCanvasPregunta();
}

function cargarSelectOffCanvasPregunta(){
    var datos = {
        idTorneo: idTorneo,
        tabla: 'NO'
    }
    $.ajax({
        url: "../PHP/cargarProblemasTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.mostrar){
                    let template2 = '';
                    let template = '<option value="Todos">Todos</option>';
                    resp.lista.forEach(problema => {
                        template += '<option value='+problema.titulo+'>'+problema.letra+' - '+problema.titulo+'</option>';
                        template2 += '<option value='+problema.idProblema+'>'+problema.letra+' - '+problema.titulo+'</option>';;
                    });
                    document.getElementById("problema-pregunta").innerHTML = template;
                    document.getElementById("problema-pregunta-modal").innerHTML = template2;
                    document.getElementById("problema-pregunta-ver-modal").innerHTML = template2;
                }
            }

        }
    });
}

function busquedaFechaFiltroPregunta(settings, data, dataIndex){
    let fecha = data[6].split('-');
    var date = new Date(fecha[1]+'/'+fecha[0]+'/'+fecha[2]);
    var minimo = new Date(minFechaPregunta);
    var maximo = new Date(maxFechaPregunta);
    if(( minimo <= date && date <= maximo )) return true;
    return false;
}

function busquedaTiempoFiltroPregunta(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[7]);
    var minimo = new Date('2010/10/10 '+minTiempoPregunta);
    var maximo = new Date('2010/10/10 '+maxTiempoPregunta);
    if(( minimo <= date  && date <= maximo )) return true;
    return false;
}

function busquedaProblemasFiltroPregunta(settings, data, dataIndex){
    if(problemaFiltroPregunta == 'Todos') return true;
    else{
        if(data[3].includes(problemaFiltroPregunta)) return true;
        else return false; 
    }
}

function busquedaRespuestaFiltroPregunta(settings, data, dataIndex){
    if(preguntaRespuestaFiltro == 'Todos') return true;
    else{
        if(preguntaRespuestaFiltro == 'SR'){
            if(data[5]=="No respondido aún"){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            if(preguntaRespuestaFiltro == 'CR'){
                if(data[5]!="No respondido aún"){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }
}

function cargarModalPreguntas(){
    document.getElementById("modalPreguntas").outerHTML = `
    <div class="modal fade" id="modalPreguntar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Preguntar</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="Escribir aqui su pregunta" class="form-label">Seleccione un problema:</label>
                    <select id="problema-pregunta-modal" class="form-select mb-3" aria-label="Default select example"></select>
                    <label for="contenidoPregunta" class="form-label">Pregunta:</label>
                    <textarea class="form-control mb-3" placeholder="Escribir aqui su pregunta" id="contenidoPregunta" rows="4" onkeyup="limpiarInput('contenidoPregunta');"></textarea>
                    <div class="invalid-feedback" id="cartelErrorEnviarPregunta"></div>
                    <div class="alert alert-secondary alert-dismissible fade show" role="alert">
                        <i class="bi bi-exclamation-circle"></i>
                        <strong> Leer: </strong> Cuando realicé la pregunta, dispone de 15 minutos para poder editarla, fuera de ese tiempo no se podrá editar su pregunta.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="enviarPregunta();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalPreguntar = new bootstrap.Modal(document.getElementById('modalPreguntar'),{});
    $('#modalPreguntar').on('hidden.bs.modal',function () {
        $('#contenidoPregunta').val("");
    })
}

function enviarPregunta(){
    var datos = {
        pregunta: $('#contenidoPregunta').val(),
        problema: document.getElementById("problema-pregunta-modal").value,
        metodo: 'Subir',
        idTorneo: idTorneo
    }
    if(datos.pregunta != ''){
        $.ajax({
            url: "../PHP/subirPregunta.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                }
                else{
                    cartelNotificacion(resp.mensaje);
                    tablePregunta.ajax.reload();
                }
                myModalPreguntar.hide();
            }
        });
    }
    else{
        document.getElementById("cartelErrorEnviarPregunta").innerHTML = 'Llenar el campo';
        document.getElementById("contenidoPregunta").classList.add("is-invalid");
    }
}

function cargarModalVerPregunta(){
    document.getElementById("modalEditarVerPregunta").outerHTML = `
    <div class="modal fade" id="modalVerPregunta" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Pregunta</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="modalVerPreguntaForm">
                        <label for="usuarioVerPregunta" class="form-label">Preguntado por:</label>
                        <input class="form-control mb-3" readonly placeholder="Usuario" id="usuarioVerPregunta">
                        <label for="problema-pregunta-ver-modal" class="form-label">Problema:</label>
                        <select id="problema-pregunta-ver-modal" class="form-select mb-3" aria-label="Default select example" disabled></select>
                        <label for="contenidoVerPregunta" class="form-label">Pregunta:</label>
                        <textarea class="form-control mb-3" placeholder="Escribir aqui su pregunta" id="contenidoVerPregunta" rows="4" onkeyup="limpiarInput('contenidoVerPregunta');" readonly></textarea>
                        <div class="invalid-feedback">No dejar el campo vacio</div>
                        <div class="d-none" id="siRespuesta"> 
                            <label for="usuarioVerPregunta" class="form-label">Respondido por:</label>
                            <input class="form-control mb-3" readonly placeholder="Usuario" id="adminVerPregunta" readonly>
                            <label for="contenidoRespuesta" class="form-label">Respuesta:</label>
                            <textarea class="form-control mb-3" id="contenidoRespuesta" rows="4" onkeyup="limpiarInput('contenidoRespuesta');" readonly></textarea>
                            <div class="invalid-feedback">No dejar el campo vacio</div>
                        </div>
                        <div class="alert alert-secondary d-none" role="alert" id="noRespuesta">
                            <i class="bi bi-exclamation-circle mx-1"></i>
                            No contiene ninguna respuesta aun.
                        </div>
                    </form>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <div class="d-flex">
                        <button type="button" class="btn btn-danger mx-1 d-none" id="botonEditarPregunta" disabled>Editar</button>
                        <button type="button" class="btn btn-primary mx-1" id="botonGuardarPregunta" disabled>Guardar Cambios</button>
                        <button type="button" class="btn btn-danger mx-1 d-none" id="botonEditarRespuesta" disabled>Editar</button>
                        <button type="button" class="btn btn-primary mx-1 d-none" id="botonResponder" disabled>Responder</button>
                        <button type="button" class="btn btn-primary mx-1 d-none" id="botonGuardarRespuesta" disabled>Guardar Cambios</button>
                    </div>  
                </div>
            </div>
        </div>
    </div>
    `;
    myModalVerPregunta = new bootstrap.Modal(document.getElementById('modalVerPregunta'),{});


    document.getElementById("modalVerPregunta").addEventListener('hidden.bs.modal', function (event) {
        document.getElementById("modalVerPreguntaForm").reset();
        $("#botonEditarPregunta").prop("disabled",true);
        $("#botonResponder").prop("disabled",true);
        $("#botonGuardarPregunta").prop("disabled",true);
        $("#botonGuardarRespuesta").prop("disabled",true);
        $("#botonEditarRespuesta").prop("disabled",true);
        $("#contenidoVerPregunta").attr("readonly", true);
        $("#contenidoRespuesta").attr("readonly", true);
        $("#problema-pregunta-ver-modal").prop("disabled",true);
        $("#contenidoVerPregunta").removeClass("is-invalid");
        $("#contenidoRespuesta").removeClass("is-invalid");
        $("#botonEditarRespuesta").addClass("d-none");
        $("#botonResponder").addClass("d-none");
        $("#botonGuardarRespuesta").addClass("d-none");
        $("#botonGuardarPregunta").removeClass("d-none");
        $("#botonEditarPregunta").addClass("d-none");
        $("#siRespuesta").addClass("d-none");
        $("#noRespuesta").addClass("d-none");
    });

    document.getElementById("botonGuardarPregunta").addEventListener('click',function(){
        var datos = {
            pregunta: $('#contenidoVerPregunta').val(),
            problema: document.getElementById("problema-pregunta-ver-modal").value,
            id: $("#modalVerPreguntaForm").attr('idPregunta'),
            metodo: 'Editar',
            idTorneo: idTorneo
        }
        if(datos.pregunta != ''){
            $.ajax({
                url: "../PHP/subirPregunta.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    let resp = JSON.parse(respuesta);
                    if(resp.error){
                        cartelNotificacion(resp.mensaje);
                        console.log(resp.descripcion);
                        myModalVerPregunta.hide();
                    }
                    else{
                        cartelNotificacion(resp.mensaje);
                        myModalVerPregunta.hide();
                        tablePregunta.ajax.reload();
                    }
                }
            });
        }
        else{
            $("#contenidoVerPregunta").addClass("is-invalid");
        }
    }); 

    document.getElementById("botonEditarPregunta").addEventListener('click',function(){
        $("#contenidoVerPregunta").attr("readonly", false);
        $("#problema-pregunta-ver-modal").prop("disabled",false);
        $("#botonGuardarPregunta").prop("disabled",false);
        $("#contenidoVerPregunta").focus();
        $("#botonEditarPregunta").prop("disabled",true);
    });

    document.getElementById("botonResponder").addEventListener('click',function(){
        var datos = {
            idPregunta: $("#modalVerPreguntaForm").attr('idPregunta'),
            respuesta: $("#contenidoRespuesta").val(),
            problema: document.getElementById("problema-pregunta-ver-modal").value,
            idTorneo: idTorneo,
            metodo: 'Responder'
        }
        console.log(datos);
        if(datos.respuesta != ''){
            $.ajax({
                url: "../PHP/subirPregunta.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    let resp = JSON.parse(respuesta);
                    if(resp.error){
                        cartelNotificacion(resp.mensaje);
                        myModalVerPregunta.hide();
                        console.log(resp.descripcion);
                    }
                    else{
                        cartelNotificacion(resp.mensaje);
                        myModalVerPregunta.hide();
                        tablePregunta.ajax.reload();
                    }
                }
            });
        }
        else{
            $("#contenidoRespuesta").addClass("is-invalid");
        }
    });

    document.getElementById("botonEditarRespuesta").addEventListener("click",function(){
        $("#botonEditarRespuesta").prop("disabled",true);
        $("#contenidoRespuesta").attr("readonly", false);
        $("#contenidoRespuesta").focus();
        $("#botonGuardarRespuesta").prop("disabled",false);
    });

    document.getElementById("botonGuardarRespuesta").addEventListener("click",function(){
        var datos = {
            idRespuesta: $("#siRespuesta").attr('idRespuesta'),
            respuesta: $("#contenidoRespuesta").val(),
            metodo: 'Editar'
        }
        if(datos.respuesta != ''){
            $.ajax({
                url: "../PHP/subirPregunta.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    let resp = JSON.parse(respuesta);
                    if(resp.error){
                        cartelNotificacion(resp.mensaje);
                        console.log(resp.descripcion);
                    }
                    else{
                        cartelNotificacion(resp.mensaje);
                        myModalVerPregunta.hide();
                        tablePregunta.ajax.reload();
                    }
                }
            });
        }
        else{
            $("#contenidoRespuesta").addClass("is-invalid");
        }
    });
}

$(document).on('click','.verProblema',function(){
    let elemento = $(this)[0].parentElement.parentElement;
    let idPregunta = $(elemento).attr('idPregunta');
    var datos = {
        idPregunta: idPregunta
    }
    console.log(datos);
    $.ajax({
        url: "../PHP/cargarPregunta.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            console.log(resp);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                $("#modalVerPreguntaForm").attr('idPregunta',resp.pregunta.idPregunta);
                document.getElementById("usuarioVerPregunta").value = resp.pregunta.usuario;
                document.getElementById("contenidoVerPregunta").value = resp.pregunta.pregunta;
                document.getElementById("problema-pregunta-ver-modal").value = resp.pregunta.problema;
                if(resp.pregunta.nivel == 1){
                    if(resp.pregunta.banderaEditar){
                        $("#botonEditarPregunta").removeClass("d-none");
                        $("#botonEditarPregunta").prop("disabled",false);
                    }
                    else{
                        $("#botonEditarPregunta").removeClass("d-none");
                    }
                }
                if(resp.pregunta.banderaResponder){
                    $("#siRespuesta").removeClass("d-none");
                    document.getElementById("adminVerPregunta").value = resp.pregunta.datosRespuesta.usuario;
                    $("#contenidoRespuesta").val(resp.pregunta.datosRespuesta.preguntaRespuesta);
                    $("#siRespuesta").attr('idRespuesta',resp.pregunta.datosRespuesta.idRespuesta);
                    if(resp.pregunta.nivel > 1){
                        $("#botonGuardarPregunta").addClass("d-none");
                        $("#botonEditarRespuesta").removeClass("d-none");
                        $("#botonGuardarRespuesta").removeClass("d-none");
                        if(resp.pregunta.datosRespuesta.banderaEditarRespuesta){
                            $("#botonEditarRespuesta").prop("disabled",false);
                        }
                    }
                }
                else{
                    if(resp.pregunta.nivel > 1){
                        document.getElementById("adminVerPregunta").value = document.getElementById("textoUsuario").innerHTML;
                        $("#siRespuesta").removeClass("d-none");
                        $("#botonGuardarPregunta").addClass("d-none");
                        $("#botonResponder").removeClass("d-none");
                        $("#botonResponder").prop("disabled",false);
                        $("#contenidoRespuesta").attr("readonly", false);
                        setTimeout(() => {
                            $("#contenidoRespuesta").focus(); 
                        }, 500);  
                    }
                    else{
                        $("#noRespuesta").removeClass("d-none");
                    }
                }
            }
        }
    });
});