
var ejecutarTiempo;
var table;
var maxFecha,minFecha;
var maxTiempo,minTiempo;
var numeroProblema = 0;
var maxDuracion,minDuracion;
var estado = 'Todos';
var arrayEnlaces = [];
var arrayTorneos = [];
var myModalRegistroTorneo;

$(document).ready(function(){
    if(document.getElementById("offCanvasFiltroTorneo")) cargarOffCanvasFiltroTorneo();
    if(document.getElementById("cargarModalRegistroTorneo")) cargarModalRegistrarTorneo();
    
    cargarTorneos();
});         

function cargarOffCanvasFiltroTorneo(){
    document.getElementById("offCanvasFiltroTorneo").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroTorneo" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="torneoFiltroBuscar" class="form-label">Nombre del torneo:</label>
                    <input type="text" id="torneoFiltroBuscar" class="form-control w-100">
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicio" class="form-label">Fecha del torneo:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFin">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="tiempoInicio" class="form-label">Hora del torneo:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="tiempoInicio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="tiempoFin">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="duracionInicio" class="form-label">Duración:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Desde</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="duracionInicio">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Hasta</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="duracionFin">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="selectNumeroProblemas" class="form-label">Numero de problemas:</label>
                    <select id="selectNumeroProblemas" class="form-select w-100" aria-label="Default select example">
                        <option value="0" selected>Todos</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="filtroTorneo">
                    <label for="selectEstado" class="form-label">Estado del torneo:</label>
                    <select id="selectEstado" class="form-select w-100" aria-label="Default select example">
                        <option value="Todos" selected>Todos</option>
                        <option value="Inicia">Sin iniciar</option>
                        <option value="Termina">En transcurso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>
                <div class="filtroTorneo mx-auto">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosTorneo">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    minTiempo = new Date("10/10/2010 00:00:00");
    maxTiempo = new Date("10/10/2010 23:59:59");
    minDuracion = new Date("10/10/2010 00:00:00");
    maxDuracion = new Date("10/10/2010 23:59:59");
    minFecha = new Date("1/1/1900");
    maxFecha = new Date("1/1/3000");
    if(document.getElementById("filtrarDatosTorneo")){
        document.getElementById("filtrarDatosTorneo").addEventListener("click",function(){
            table.columns(1).search(document.getElementById("torneoFiltroBuscar").value);
            table.draw();
        });
    }
    if(document.getElementById("fechaInicio")){
        document.getElementById("fechaInicio").addEventListener("change",function(){
            if(document.getElementById("fechaInicio").value == "") minFecha = new Date("1/1/1900");
            else minFecha = new Date(document.getElementById("fechaInicio").value);  
        });
    }
    if(document.getElementById("fechaFin")){
        document.getElementById("fechaFin").addEventListener("change",function(){
            if(document.getElementById("fechaFin").value == "") maxFecha = new Date("1/1/3000");
            else maxFecha = new Date(document.getElementById("fechaFin").value); 
        });
    }
    if(document.getElementById("tiempoInicio")){
        document.getElementById("tiempoInicio").addEventListener("change",function(){
            if(document.getElementById("tiempoInicio").value == "") minTiempo = new Date("10/10/2010 00:00:00");
            else minTiempo = new Date("10/10/2010 "+document.getElementById("tiempoInicio").value);  
        });
    }
    if(document.getElementById("tiempoFin")){
        document.getElementById("tiempoFin").addEventListener("change",function(){
            if(document.getElementById("tiempoFin").value == "") maxTiempo = new Date("10/10/2010 23:59:59");
            else maxTiempo = new Date("10/10/2010 "+document.getElementById("tiempoFin").value); 
        });
    }
    if(document.getElementById("selectNumeroProblemas")){
        document.getElementById("selectNumeroProblemas").addEventListener("change",function(){
            numeroProblema = document.getElementById("selectNumeroProblemas").value;
        });
    }
    if(document.getElementById("duracionInicio")){
        document.getElementById("duracionInicio").addEventListener("change",function(){
            if(document.getElementById("duracionInicio").value == "") minDuracion = new Date("10/10/2010 00:00:00");
            else minDuracion = new Date("10/10/2010 "+document.getElementById("duracionInicio").value);  
        });
    }
    if(document.getElementById("duracionFin")){
        document.getElementById("duracionFin").addEventListener("change",function(){
            if(document.getElementById("duracionFin").value == "") maxDuracion = new Date("10/10/2010 23:59:59");
            else maxDuracion = new Date("10/10/2010 "+document.getElementById("duracionFin").value); 
        });
    }
    if(document.getElementById("selectEstado")){
        document.getElementById("selectEstado").addEventListener("change",function(){
            estado = document.getElementById("selectEstado").value;
        });
    }

    $.fn.dataTable.ext.search.push(busquedaFechaFiltro);
    $.fn.dataTable.ext.search.push(busquedaTiempoFiltro);
    $.fn.dataTable.ext.search.push(busquedaProblemasFiltro);
    $.fn.dataTable.ext.search.push(busquedaDuracionFiltro);
    $.fn.dataTable.ext.search.push(busquedaEstadoFiltro);
}

function cargarModalRegistrarTorneo(){
    document.getElementById("cargarModalRegistroTorneo").outerHTML = `
    <div class="modal fade" id="modalRegistrarseTorneo" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Registro torneo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p> Torneo a inscribirse: </p>
                    <p class="fw-bold" id="torneoRegistroNombre"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="registrarTorneo">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    myModalRegistroTorneo = new bootstrap.Modal(document.getElementById('modalRegistrarseTorneo'),{});

    if(document.getElementById("registrarTorneo")){
        document.getElementById("registrarTorneo").addEventListener("click",function(){
            let elemento = $(this)[0].parentElement.parentElement.parentElement.parentElement;
            registrarseTorneo(parseInt($(elemento).attr('idTorneo')));
        });
    }
}

function cargarTorneos(){                          
    table = $('#torneosTabla').DataTable({
        ajax: {
            url: '../PHP/cargarTorneos.php',
            type: "POST",
            data: {metodo: "tabla"},
            dataSrc: function (json){
                arrayTorneos = [];
                console.log(json.data);
                json.data.forEach(torneo => {
                    if(torneo.estado != 2){
                        arrayTorneos.push({id: torneo.idTorneo, estado: torneo.estado, fechaInicio: torneo.fechaInicio+' '+torneo.horaInicio, fechaFin: torneo.fechaFin});
                    }
                });
                return json.data;
            } 
        }
        ,
        "columns": [
            { "data": "idTorneo" },
            { "data": "nombre" },
            { "data": "fechaInicio"},
            { "data": "horaInicio" },
            { "data": "duracion" },
            { "data": "numeroProblema"},
            { "data": "cartelEstado" },
            { "data": "enlace" }
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
        "order": [[ 2, "desc" ]]
        ,
        columnDefs: [ {
            targets: [ 2 ],
            orderData: [ 2, 3 ]
        }
        ,
        { responsivePriority: 1, targets: [1,7] },
        { responsivePriority: 2, targets: [6] },
        { responsivePriority: 3, targets: [4,5] },
        { responsivePriority: 4, targets: [2,3]}
        ,
        {
            targets: [0,6,7],
            orderable: false
        }
        ,
        {
            targets: [0],
            visible: false
        }
        ]
        ,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]]
        ,
        "dom": '<"filaDomDatatable"l<"filtrosTorneo">>rtp'
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
                                    return '<table class="table">'+data+'</table>';
                                }
                                else return false;
                            }
            }
        }
    });
    $("div.filtrosTorneo").html('<button class="btn btn-primary px-4 my-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroTorneo" aria-controls="offcanvasRight">Filtros</button>');
    $("div.dataTables_length").addClass("my-2");
    actualizarTiempo();
}

function busquedaFechaFiltro(settings, data, dataIndex){
    var date = new Date(data[2]);
    if(( minFecha <= date  && date <= maxFecha )) return true;
    return false;
}

function busquedaTiempoFiltro(settings, data, dataIndex){
    var time = new Date("10/10/2010 "+data[3]);
    if(( minTiempo <= time  && time <= maxTiempo )) return true;
    return false;
}

function busquedaDuracionFiltro(settings, data, dataIndex){
    var duracion = new Date("10/10/2010 "+data[4]);
    if(( minDuracion <= duracion  && duracion <= maxDuracion )) return true;
    return false;
}

function busquedaProblemasFiltro(settings, data, dataIndex){
    if(numeroProblema == 0) return true;
    else{
        if(numeroProblema == parseInt(data[5])) return true;
        else return false; 
    }
}

function busquedaEstadoFiltro(settings, data, dataIndex){
    if(estado == 'Todos') return true;
    else{
        if(data[6].includes(estado)) return true;
        else return false; 
    }
}

function actualizarTiempo(){
    ejecutarTiempo = setInterval(mostrarTiempo,1000);
}

function mostrarTiempo(){
    if(arrayTorneos.length){
        let i = 0;
        while(i<arrayTorneos.length){
            if(arrayTorneos[i].estado){
                let valor = ((new Date(arrayTorneos[i].fechaFin).getTime())-Date.now());
                if(valor > 0){
                    table.cell(table.row($('tr[idtorneo="'+arrayTorneos[i].id+'"]')).index(),6).data("<span>"+cartelEstadoTorneo(arrayTorneos[i].estado)+"</span> <br> <span class='colorGris' style='font-size:13px;'>"+tiempoRestanteTorneo(Math.ceil(((new Date(arrayTorneos[i].fechaFin).getTime())-Date.now())/1000))+"</span>" );
                }
                else{
                    arrayTorneos[i].estado++;
                    table.cell(table.row($('tr[idtorneo="'+arrayTorneos[i].id+'"]')).index(),6).data("<span>"+cartelEstadoTorneo(arrayTorneos[i].estado)+"</span>" );
                }
            }
            else{
                let valor = ((new Date(arrayTorneos[i].fechaInicio).getTime())-Date.now());
                if(valor > 0){
                    table.cell(table.row($('tr[idtorneo="'+arrayTorneos[i].id+'"]')).index(),6).data("<span>"+cartelEstadoTorneo(arrayTorneos[i].estado)+"</span> <br> <span class='colorGris' style='font-size:13px;'>"+tiempoRestanteTorneo(Math.ceil(((new Date(arrayTorneos[i].fechaInicio).getTime())-Date.now())/1000))+"</span>" );
                }
                else{
                    arrayTorneos[i].estado++;
                    table.cell(table.row($('tr[idtorneo="'+arrayTorneos[i].id+'"]')).index(),6).data("<span>"+cartelEstadoTorneo(arrayTorneos[i].estado)+"</span> <br> <span class='colorGris' style='font-size:13px;'>"+tiempoRestanteTorneo(Math.ceil(((new Date(arrayTorneos[i].fechaFin).getTime())-Date.now())/1000))+"</span>" );
                    actualizarEnlace(arrayTorneos[i].id);
                }
            }
            if(arrayTorneos[i].estado == 2){
                arrayTorneos.splice(i,1);
            }
            else{
                i++;
            }
        }
    }
    else{
        clearInterval(ejecutarTiempo);
    }
}

function actualizarEnlace(idTorneo){
    $.ajax({
        url: "../PHP/session.php",
        type: "GET",
        success: function(respuesta){
            if(respuesta == 'no'){
                table.cell(table.row($('tr[idtorneo="'+idTorneo+'"]')).index(),7).data('<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Ingresar</a>');
            }
            else{
                resp = JSON.parse(respuesta);
                if(parseInt(resp.activo)){
                    table.cell(table.row($('tr[idtorneo="'+idTorneo+'"]')).index(),7).data('<a href="torneo.html?idTorneo='+idTorneo+'" class="btn btn-primary" target="_blank">Ingresar</a>');
                }
                else{
                    table.cell(table.row($('tr[idtorneo="'+idTorneo+'"]')).index(),7).data('<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Ingresar</a>');
                }
            }
        }
    });
}

$(document).on('click', '.accionNombreTorneo', function(){
    let nombre = $(this)[0].parentElement.parentElement.children[0].innerHTML;
    document.getElementById("torneoRegistroNombre").innerHTML = nombre;
    let eIdTorneo = $(this)[0].parentElement.parentElement;
    let idTorneo = $(eIdTorneo).attr('idTorneo');
    document.getElementById("modalRegistrarseTorneo").setAttribute("idTorneo", idTorneo);
});

$("#cargarTorneos").on('click', '.indice-torneo', function(){
    let ind = $(this).index();
    console.log(ind);
});

function registrarseTorneo(idTorneo){
    var datos = {
        idTorneo: idTorneo
    }
    $.ajax({
        url: "../PHP/inscribirseTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                cartelNotificacion(resp.mensaje);
                myModalRegistroTorneo.hide();
                actualizarEnlace(idTorneo);
            }
        }
    });
}

function ordenSegundos(a,b){
    if(a.segundos < b.segundos) return -1; 
    else return 1
}

function cargarEnlace(){
    
    $.ajax({
        url: "../PHP/cargarEnlaceTorneos.php",
        type: "GET",
        success: function(respuesta){
            if(respuesta == 'N' || respuesta == 'NA'){
                if(respuesta == 'N'){
                    for(let i=0;i<table.columns(0).data().count();i++){
                        if(arrayEnlaces[i].estado == 0){
                            table.cell(i,7).data('<a href="#Session" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Registrarse</a>');
                        }
                        else{
                            table.cell(i,7).data('<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Ingresar</a>');
                        }
                    }
                }
                else{
                    for(let i=0;i<table.columns(0).data().count();i++){
                        if(arrayEnlaces[i].estado == 0){
                            table.cell(i,7).data('<a href="#Session" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Registrarse</a>');
                        }
                        else{
                            table.cell(i,7).data('<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Ingresar</a>');
                        }
                    }
                }
            }
            else{
                let resp = JSON.parse(respuesta);
                console.log(resp);
                console.log(arrayEnlaces);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                }
                else{
                    let indice = 0;
                    for(let i=0;i<table.columns(0).data().count();i++){
                        if(indice < resp.lista.length && arrayEnlaces[i].id == resp.lista[indice]){
                            table.cell(i,7).data('<a href="torneo.html?idTorneo='+arrayEnlaces[i].id+'" class="btn btn-primary" target="_blank">Ingresar</a>');
                            indice++;
                        }
                        else{
                            if(arrayEnlaces[i].estado != 0){
                                table.cell(i,7).data('<a href="torneo.html?idTorneo='+arrayEnlaces[i].id+'" class="btn btn-primary" target="_blank">Ingresar</a>');
                            }
                            else{
                                table.cell(i,7).data('<a href="#RegistroTorneo" class="btn btn-success accionNombreTorneo" data-bs-toggle="modal" data-bs-target="#modalRegistrarseTorneo">Registrarse</a>');
                            }
                        }
                    }
                }
            }
        }
    });
}

