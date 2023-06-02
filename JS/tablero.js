var tableResultado;
var columnasNoOrderables = [];
var paisFiltro = 'Todos';
var arrayAsociativoProblemas = [];
var letraA = 'A';
var minimoPR = 0;
var maximoPR = 10;
var indicePR = -1;
var oficial = false;

$(document).ready(function(){
    cargarArrayAsociativo();
    cargarOffCanvasTablero();
    if(document.getElementById("resultadoTabla")) cargarTablero();
});

function busquedaEstadoFiltro(settings, data, dataIndex){
    if(paisFiltro == 'Todos') return true;
    else{
        if(data[2] == paisFiltro) return true;
        else return false; 
    }
}

function busquedaPR(settings, data, dataIndex){
    if(parseInt(data[3+columnasNoOrderables.length])>=minimoPR && parseInt(data[3+columnasNoOrderables.length])<=maximoPR) return true;
    else return false;
}

function cargarTablero(){
    var datos = {
        idTorneo: idTorneo
    };  
    $.ajax({
        url: "../PHP/cargarHeaderResultado.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let pos = 3;
                let template = `
                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Posición">#</th>  
                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Usuario" class="w-100">Usuario</th>
                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Nacionalidad">Pais</th>
                `;
                resp.lista.forEach(problema => {
                    template += '<th class="text-center" data-bs-toggle="tooltip" data-bs-placement="top" title="'+problema.titulo+'">'+problema.letra+'</th>';
                    columnasNoOrderables.push(pos);
                    pos++;
                });
                template += `
                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="# Problemas Aceptados">PA</th>
                    <th data-bs-toggle="tooltip" data-bs-placement="top" title="Puntos totales">Puntos</th>
                `;
                document.getElementById("cargarHeaderResultado").innerHTML = template;

                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                });
                cargarContenidoTablero();
            }
        }
    });
}

function cargarContenidoTablero(){
    var datos = {
        idTorneo: idTorneo
    }
    tableResultado = $('#resultadoTabla').DataTable({
        ajax: {
            url: '../PHP/cargarTablero.php',
            type: "POST",
            data: datos
        }
        ,
        columnDefs: [
            { responsivePriority: 1, targets: [0,1,-2,-1] },
            { responsivePriority: 3, targets: [2]},
            { responsivePriority: 4, targets: columnasNoOrderables},
            {
                targets: columnasNoOrderables,
                orderable: false
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
                                            '<td>'+((col.title.length == 1) ? arrayAsociativoProblemas[(col.title.charCodeAt(0)-letraA.charCodeAt(0))] : col.title)+':'+'</td>'+
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
        "dom": '<"filaDomDatatable"l<"filtrosTablero">>rtp'
    });
    let template = `
        <button class="btn btn-primary px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroTablero" aria-controls="offcanvasRight">Filtros</button>
    `;
    $("div.filtrosTablero").html(template);
    $("div.dataTables_length").addClass("my-2");
    $.fn.dataTable.ext.search.push(busquedaEstadoFiltro);
    $.fn.dataTable.ext.search.push(busquedaPR);
    cargarSelectPais();
    cargarSelectPR();
    setTimeout(function(){tableResultado.ajax.reload(null, false);},10000); 
}

function cargarSelectPais(){
    var datos = {
        idTorneo: idTorneo
    }
    $.ajax({
        url: "../PHP/cargarPaises.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let template = '<option value="Todos">Todos</option>';
                resp.lista.forEach(pais => {
                    template += '<option value='+pais.nombre+'>'+pais.nombre+'</option>';
                });
                document.getElementById("paisResultado").innerHTML = template;
            }

        }
    });
}

function cargarArrayAsociativo(){
    var datos = {
        idTorneo: idTorneo
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
                    resp.lista.forEach(problema => {
                        let letra = problema.letra;
                        arrayAsociativoProblemas.push(problema.letra + ' - ' + problema.titulo);       
                    });
                }
            }

        }
    });
}

function cargarOffCanvasTablero(){
    document.getElementById("offCanvasFiltroTablero").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroTablero" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="usuarioResultado" class="form-label">Usuario:</label>
                    <input type="text" id="usuarioResultado" class="form-control w-100">
                </div>
                <div class="filtroTorneo">
                    <label for="paisResultado" class="form-label">Pais:</label>
                    <select id="paisResultado" class="form-select w-100" aria-label="Default select example"></select>
                </div>
                <div class="filtroTorneo">
                    <label class="form-label mb-2">Numeros de problemas resueltos:</label>
                    <div class="d-flex justify-content-between w-100 ">
                        <label for="minimoPR" class="form-label" style="font-size:13px">Minimo</label>
                        <label for="maximoPR" class="form-label" style="font-size:13px">Maximo</label>
                    </div>
                    <div class="input-group">
                        <select id="minimoPR" class="form-select" aria-label="Default select example"></select>
                        <select id="maximoPR" class="form-select" aria-label="Default select example"></select>
                    </div>
                </div>
                <div class="filtroTorneo mx-auto">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosTablero">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    document.getElementById("usuarioResultado").addEventListener("keyup",function(){
        tableResultado.columns(1).search(document.getElementById("usuarioResultado").value);
    });
    document.getElementById("paisResultado").addEventListener("change",function(){
        paisFiltro = document.getElementById("paisResultado").value;
    });
    document.getElementById("filtrarDatosTablero").addEventListener("click",function(){
        tableResultado.draw();
    });
    document.getElementById("minimoPR").addEventListener("change",function(){
        minimoPR = parseInt(document.getElementById("minimoPR").value);
    });
    document.getElementById("maximoPR").addEventListener("change",function(){
        maximoPR = parseInt(document.getElementById("maximoPR").value);
    });
}

function cargarSelectPR(){
    let templateMinimo = '';
    let templateMaximo = '';
    let maximoValor = parseInt(columnasNoOrderables.length);
    for(let i=1;i<=maximoValor;i++){
        if(i == 0){
            templateMinimo += '<option value='+i+' selected>'+i+'</option>';
            templateMaximo += '<option value='+i+'>'+i+'</option>';
        }
        else{
            if(i == maximoValor){
                templateMaximo += '<option value='+i+' selected>'+i+'</option>';
                templateMinimo += '<option value='+i+'>'+i+'</option>';
            }
            else{
                templateMinimo += '<option value='+i+'>'+i+'</option>';
                templateMaximo += '<option value='+i+'>'+i+'</option>';
            }
        }
        
    }
    document.getElementById("minimoPR").innerHTML = templateMinimo;
    document.getElementById("maximoPR").innerHTML = templateMaximo;
}