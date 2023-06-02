var idTorneo;
var editorDescripcion;
var editorEntrada;
var editorSalida;
var ventanaEmergenteSinGuardar;
var ventanaEmergenteEliminar;
var ventanaEmergenteEliminarArchivo;
var ventanaBorrarCasosSalida;
var ventanaErrorGenerar;
var ventanaBorrarCasosTodos;
var myModalVerCasos;
var myModalCrearProblema;
var myModalSubirCasos; 
var archivoSolucion;
var tableCasos;
var banderaSinGuardar = false;

$(document).ready(function(){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    idTorneo = urlParams.get('idTorneo');
    if(document.getElementById("modalCrearProblema")) cargarModalCrearProblema();
    if(document.getElementById("modalSubirCasos")) cargarModalSubirCasos();
    if(document.getElementById("modaVerTest")) cargarModalVerCasos();
    if(document.getElementById("archivo-envio-solucion")){
        archivoSolucion = $("#archivo-envio-solucion").fileinput({
            uploadUrl: "../PHP/subirArchivoSolucion.php", 
            uploadAsync: false,
            minFileCount: 1,
            maxFileCount: 1,
            showUpload: true, 
            showRemove: false,
            showPreview: false,
            autoReplace: true,
            language: 'es',
            allowedFileExtensions: ["cpp", "c", "java","py"],
            elErrorContainer: "#cartel-error-archivo-solucion",
            uploadExtraData: function() {
                return {
                    idProblema: $("#id-problema-cargar").attr("idProblema")
                }
            }
        });
        $('#archivo-envio-solucion').on('filebatchuploadsuccess', function(event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra, 
            response = data.response, reader = data.reader;
            var resp = data.response;
            if(response.uploaded){
                cartelNotificacion(resp.mensaje);
                switch(resp.ext){
                    case "c":   $("#logo-lenguaje").prop('src',"../Imagenes/c.png");
                                $("#codigo-solucion-subido").html(resp.nombre);
                                break;
                    case "cpp": $("#logo-lenguaje").prop('src',"../Imagenes/cplus.png");
                                $("#codigo-solucion-subido").html(resp.nombre);
                                break;
                    case "java":$("#logo-lenguaje").prop('src',"../Imagenes/java.png");
                                $("#codigo-solucion-subido").html(resp.nombre);
                                break;
                    case "py":  $("#logo-lenguaje").prop('src',"../Imagenes/python.png");
                                $("#codigo-solucion-subido").html(resp.nombre);
                                break;
                }
                $("#eliminar-codigo-solucion").prop("disabled",false);
            }  
            else{
                $("#cartel-error-archivo-solucion").html(response.mensaje);
            }
            $('#archivo-envio-solucion').fileinput('clear');
        });
    }

    ClassicEditor.create( document.querySelector( '#editorDescripcion' ), {
        ui: {
            viewportOffset: { top: 143, right: 0, bottom: 0, left: 0},
        },
        language: 'es',
        toolbar: {
            items: [ 'heading', '|' , 'bold', 'italic', '|',  'undo', 'redo', '|', 'numberedList', 'bulletedList' ],
            shouldNotGroupWhenFull: true
        }
    } )
    .then( newEditor => {
        editorDescripcion = newEditor;
        editorDescripcion.model.document.on('change:data',sinGuardar);
    } )
    .catch( error => {
        console.log( error );
    } );

    ClassicEditor.create( document.querySelector( '#editorEntrada' ), {
        language: 'es',
        toolbar: {
            items: [ 'heading', '|' ,'bold', 'italic', '|',  'undo', 'redo', '|', 'numberedList', 'bulletedList' ],
            shouldNotGroupWhenFull: true
        }
    } )
    .then( newEditor => {
        editorEntrada = newEditor;
        editorEntrada.model.document.on('change:data',sinGuardar);
    } )
    .catch( error => {
        console.log( error );
    } );

    ClassicEditor.create( document.querySelector( '#editorSalida' ), {
        language: 'es',
        toolbar: {
            items: [ 'heading', '|' ,'bold', 'italic', '|',  'undo', 'redo', '|', 'numberedList', 'bulletedList' ],
            shouldNotGroupWhenFull: true
        }
    } )
    .then( editor => {
        editorSalida = editor;
        editorSalida.model.document.on('change:data',sinGuardar);
    } )
    .catch( error => {
        console.log(error);
    });

    $("#problemaEditarTitulo").on("keyup",sinGuardar);
    $("#problemaEditarLimite").on("keyup",sinGuardar);
    $("#problemaEditarEtiqueta").on("change",sinGuardar);
    $("#select-test-publicos").on("change",sinGuardar);
    $("#eliminar-codigo-solucion").on("click",modalPreguntaEliminarArchivo);
    $("#generar-test-salida").on("click",generarCasosSalida);
    $("#borrar-todo-salida").on("click",modalBorrarCasosSalida);
    $("#borrar-todo-casos").on("click",modalBorrarCasosTodos);
    
    tableCasos = $('#tablaCasos').DataTable({
        columnDefs: [
            {
                targets: [0],
                visible: false
            }
            ,
            {
                targets: [0,2,3,4],
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
                                            '<td>'+col.title+':</td> '+
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
        "dom": '<"d-flex justify-content-between flex-wrap"<"m-1"l><"m-1"f>>t'
    });

    cargarDatosDelTorneo();
});

function sinGuardar(){
    if($("#id-problema-cargar").attr("idProblema") != ""){
        if(!banderaSinGuardar){
            banderaSinGuardar = true;
            $("#id-problema-editor").append(" (Sin guardar)");
            $("#problema-guardar").prop("disabled",false);
        }
    }
}

function cargarModalCrearProblema(){
    document.getElementById("modalCrearProblema").outerHTML = `
    <div class="modal fade" id="modalCrearProblema" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Crear Problema</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="problemaNombreCreacion" class="form-label">Título del problema:</label>
                    <input type="text" class="form-control" placeholder="Título" id="problemaNombreCreacion">
                    <div class="invalid-feedback" id="cartelErrorNombreProblema"></div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary px-4" id="btn-crearProblema">Crear</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalCrearProblema = new bootstrap.Modal(document.getElementById('modalCrearProblema'),{});
    $("#problemaNombreCreacion").on("keyup",function(){
        $("#problemaNombreCreacion").removeClass("is-invalid");
    });
    $("#btn-crearProblema").on("click",function(){
        crearProblema();
    }); 
}

function cargarModalSubirCasos(){
    document.getElementById("modalSubirCasos").outerHTML = `
    <div class="modal fade" id="modalSubirCasos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Subir casos de prueba</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="problemaNombreCreacion" class="form-label">Casos de entrada (.in):</label>
                    <input id="subir-casos-entrada" name="casos[]" type="file" multiple>
                    <div id="cartel-error-casos-entrada"></div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary px-4" id="btn-subirCasos">Subir</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalSubirCasos = new bootstrap.Modal(document.getElementById('modalSubirCasos'),{});
    $("#subir-casos-entrada").fileinput({
        theme: "explorer-fa",
        uploadAsync: false,
        minFileCount: 1,
        maxFileCount: 200,
        showUpload: false, 
        showRemove: false,
        showPreview: true,
        autoReplace: false,
        language: 'es',
        allowedFileExtensions: ["in"],
        elErrorContainer: "#cartel-error-casos-entrada",
        uploadExtraData: function() {
            return {
                idProblema: $("#id-problema-cargar").attr("idProblema")
            }
        },
        preferIconicPreview: true,
        previewFileIconSettings: {
            'in': '<i class="bi bi-file-earmark"></i>'
        },
        fileActionSettings: {
            showUpload: false
        }
    });
    $("#btn-subirCasos").on("click",function(){
        subirCasosEntrada();
    });
}

function cargarModalVerCasos(){
    document.getElementById("modaVerTest").outerHTML = `
    <div class="modal fade" id="modalVerCasos" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ver-test-titulo"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body overflow-scroll">
                    <div class="card mb-3" style="height: 300px">
                        <div class="card-header">
                            <div class="d-flex align-items-center justify-content-between">
                                <span>Entrada</span>
                                <a href="#" type="button" class="btn btn-secondary btn-sm" id="enlace-descargar-entrada" title="Descargar" disabled><i class="bi bi-download"></i></a>
                            </div>
                        </div>
                        <div class="card-body text-nowrap overflow-scroll" id="test-contenido-entrada"></div>
                    </div>
                    <div class="card" style="height: 300px">
                        <div class="card-header">
                            <div class="d-flex align-items-center justify-content-between">
                                <span>Salida</span>
                                <a href="#" type="button" class="btn btn-secondary btn-sm" id="enlace-descargar-salida" title="Descargar" disabled><i class="bi bi-download"></i></a>
                            </div>
                        </div>
                        <div class="card-body text-nowrap overflow-scroll" id="test-contenido-salida"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary ml-auto" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalVerCasos = new bootstrap.Modal(document.getElementById('modalVerCasos'),{});

    document.getElementById('modalVerCasos').addEventListener('hidden.bs.modal', function () {
        $("#enlace-descargar-entrada").prop('href','#');
        $("#enlace-descargar-salida").prop('href','#');
        $("#enlace-descargar-entrada").prop('download','#');
        $("#enlace-descargar-entrada").prop('download','#');
        $("#test-contenido-entrada").html('');
        $("#test-contenido-entrada").html('');
    });
}

function cargarDatosDelTorneo(){
    var datos = {
        idTorneo : idTorneo,
        metodo: 'admin'
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
                let torneo = resp.respuesta;
                $("#nombreTorneoEditor").val(torneo.nombre);
                $("#fechaTorneoEditor").val(torneo.fechaInicio);
                $("#horaTorneoEditor").val(torneo.horaInicio);
                $("#duracionTorneoEditor").val(torneo.duracion);
                $("#penalTorneoEditor").val(torneo.tiempoPenalizacion);
                $("#selectTorneoEditor").val(torneo.nivelTorneo);
                cargarDatosProblemas();
            }
        }
    });
}

function guardarDatosTorneo(){
    if(verificarDatosTorneo()){
        var datos = {
            idTorneo: idTorneo,
            nombreTorneo: $("#nombreTorneoEditor").val(),
            fechaInicioTorneo: $("#fechaTorneoEditor").val(),
            horaInicioTorneo: $("#horaTorneoEditor").val(),
            duracionTorneo: $("#duracionTorneoEditor").val(),
            penalizacion: $("#penalTorneoEditor").val(),
            nivel: $("#selectTorneoEditor").val(),
            metodo: "actualizar"
        }
        $.ajax({
            url: "../PHP/editarTorneo.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    console.log(resp.descripcion);
                }
                cartelNotificacion(resp.mensaje);
            }
        });
    }
}

function verificarDatosTorneo(){
    let bandera = true;
    var exp = new RegExp(/^[A-Za-z0-9À-ÿ\u00f1\u00d1\s]+$/g);
    if($("#nombreTorneoEditor").val() == "" || !exp.test($("#nombreTorneoEditor").val())){
        cartelInput("nombreTorneoEditor",false,"cartelTorneoEditorNombre","Nombre no valido");
        bandera = false;
    }
    if(!controlFecha($("#fechaTorneoEditor").val())){
        cartelInput("fechaTorneoEditor",false,"cartelTorneoEditorFechaInicio","Fecha no valida");
        bandera = false;
    }
    if(!controlHora($("#horaTorneoEditor").val())){
        cartelInput("horaTorneoEditor",false,"cartelTorneoEditorHoraInicio","Hora no valida");
        bandera = false;
    }
    if(!controlHora($("#duracionTorneoEditor").val())){
        cartelInput("duracionTorneoEditor",false,"cartelTorneoEditorDuracion","Duración no valida");
        bandera = false;
    }
    if(isNaN($("#penalTorneoEditor").val())){
        cartelInput("penalTorneoEditor",false,"cartelTorneoEditorTiempoPenalizacion","Tiempo de penalizacion no valido");
        bandera = false;
    }
    return bandera;
}

function cargarDatosProblemas(){
    var datos = {
        idTorneo: idTorneo,
        metodo: "lista"
    }
    $.ajax({
        url: "../PHP/cargarProblemas.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let template = '';
                let templateSelect = '';
                resp.lista.forEach(problema => {
                    template += `
                        <button type="button" class="btn btn-outline-dark text-truncate w-100 mb-2 cargarProblema" idProblema="${problema.idProblema}" title="${problema.titulo}" problema=" - ${problema.titulo}">${problema.letra}</button>
                    `;
                    templateSelect += "<option value="+problema.letra+">"+problema.letra+"</option>";
                });
                $("#cargarProblemas").html(template);
                $("#problemaEditarEtiqueta").html(templateSelect);
                $("#problema-guardar").prop('disabled',true);
                $("#problema-eliminar").prop('disabled',true);
                $('#archivo-envio-solucion').fileinput('lock');
                $("#subir-casos-prueba-btn").prop('disabled',true);
                if($("#id-problema-cargar").attr("idProblema")!="") cargarProblema($("#id-problema-cargar").attr("idProblema"));
            }
        }
    });
}

$(document).on('click', '.cargarProblema', function(){
    let element = $(this)[0];
    if(!$(element).hasClass("active")){
        let idProblema = $(element).attr('idProblema');
        let idProblemaAnterior = $("#id-problema-cargar").attr('idProblema');
        $("#id-problema-cargar").attr('idProblema',idProblema);
        if(banderaSinGuardar){
            let contenido = `
                <div class="d-flex align-items-center justify-content-between">
                    <i class="bi bi-exclamation-circle m-2" style="font-size: 2rem;"></i>
                    <div class="text-center">
                        <p class="mb-0"> Se han producidos cambios en el problema </p>
                        <p class="mb-0"> ¿Desea guardarlos estos cambios? </p>
                    </div>
                </div>
            `;
            let botones = `
                <div class="d-flex justify-content-between w-100">
                    <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaEmergenteSinGuardar);">Cancelar</button>
                    <div class="d-flex">
                        <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaEmergenteSinGuardar); cargarProblema(${idProblema});">No guardar</button>
                        <button type="button" class="btn btn-primary" onclick="Swal.close(ventanaEmergenteSinGuardar); guardarProblema(${idProblemaAnterior});">Si, guardar</button>
                    </div>
                </div>
            `;
            ventanaEmergenteSinGuardar = Swal.fire({
                html: contenido,
                showConfirmButton: false,
                footer: botones
            });
        }
        else{
            cargarProblema(idProblema);
        }
    }
});

function cargarProblema(idProblema){
    var datos = {
        idProblema: idProblema,
        idTorneo: idTorneo,
        metodo: "cargar"
    }
    $.ajax({
        url: "../PHP/cargarProblemas.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let problema = resp.datos;
                console.log(problema);
                $("#problemaEditarTitulo").val(problema.titulo);
                $("#problemaEditarEtiqueta").val(problema.letra);
                $("#problemaEditarLimite").val(problema.limite);
                editorDescripcion.setData(problema.descripcion);
                editorEntrada.setData(problema.entrada);
                editorSalida.setData(problema.salida);
                switch(problema.ext){
                    case "c":   $("#logo-lenguaje").prop('src',"../Imagenes/c.png");
                                $("#codigo-solucion-subido").html(problema.archivo);
                                break;
                    case "cpp": $("#logo-lenguaje").prop('src',"../Imagenes/cplus.png");
                                $("#codigo-solucion-subido").html(problema.archivo);
                                break;
                    case "java":$("#logo-lenguaje").prop('src',"../Imagenes/java.png");
                                $("#codigo-solucion-subido").html(problema.archivo);
                                break;
                    case "py":  $("#logo-lenguaje").prop('src',"../Imagenes/python.png");
                                $("#codigo-solucion-subido").html(problema.archivo);
                                break;
                    default:    $("#logo-lenguaje").prop('src',"../Imagenes/oval.png");
                                $("#codigo-solucion-subido").html("Ningún codigo subido");
                                break;
                }
                tableCasos.clear();
                let ne = parseInt(problema.test);
                let ns = parseInt(problema.testSalida);

                for(let i=0;i<ne;i++){ 
                    let fila = tableCasos.row.add([i+1,'test'+(i+1),(i < ns) ? 'test'+(i+1) : '','<button type="button" class="btn btn-secondary btn-sm mostrar-test-contenido" title="Ver caso de prueba"><i class="bi bi-eye"></i></button>','<button type="button" class="btn btn-secondary btn-sm eliminar-test" title="Eliminar" ><i class="bi bi-trash"></i></button>']).node();
                    $(fila).addClass("align-middle");
                    $(fila).attr("in",true);
                    $(fila).attr("dato",i+1);
                    (i < ns) ? $(fila).attr("out",true) : $(fila).attr("out",false);
                }

                if(ne > ns){
                    $("#generar-test-salida").prop('disabled',false);
                }
                else{
                    $("#generar-test-salida").prop('disabled',true);  
                }

                if(ns > 0){
                    $("#borrar-todo-salida").prop('disabled',false);
                    
                }
                else{
                    $("#borrar-todo-salida").prop('disabled',true);
                }
                if(ne > 0){
                    $("#borrar-todo-casos").prop('disabled',false);
                }
                else{
                    $("#borrar-todo-casos").prop('disabled',true);
                }

                tableCasos.draw();

                cargarSelectTestPublico(ns,parseInt(problema.testPublico));

                (problema.ext != "") ? $("#eliminar-codigo-solucion").prop("disabled",false) : $("#eliminar-codigo-solucion").prop("disabled",true);
                $(".cargarProblema").removeClass("active");
                $('.cargarProblema[idProblema='+idProblema+']').addClass("active");  
                
                $("#subir-casos-prueba-btn").prop('disabled',false);
                $('#archivo-envio-solucion').fileinput('unlock');
                $("#problema-eliminar").prop('disabled',false);
                $("#id-problema-editor").html("Problema #"+problema.idProblema);
                $("#id-problema-cargar").attr('idProblema',problema.idProblema);
                $("#problema-guardar").prop('disabled',true);
                banderaSinGuardar = false;
            }
        }
    });
}

function crearProblema(){
    let titulo = $("#problemaNombreCreacion").val();
    if(titulo != ""){
        var exp = new RegExp(/^[A-Za-z0-9À-ÿ\u00f1\u00d1\s]+$/g);
        if(exp.test(titulo)){
            if(($("#cargarProblemas button")).length) $("#cargarProblemas button:last").after($("<button type='button' class='btn btn-outline-dark text-truncate w-100 mb-2 cargandoProblema' title='Cargando problema...' problema='Creando problema     '><div class='spinner-border spinner-border-sm' role='status'></div></button>"));
            else $("#cargarProblemas").html("<button type='button' class='btn btn-outline-dark text-truncate w-100 mb-2 cargandoProblema' title='Cargando problema...' problema='Creando problema     '><div class='spinner-border spinner-border-sm' role='status'></div></button>");
            var datos = {
                idTorneo : idTorneo,
                titulo: titulo
            };
            $.ajax({
                url: "../PHP/crearProblema.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    myModalCrearProblema.hide();
                    let resp = JSON.parse(respuesta);
                    if(resp.error){
                        cartelNotificacion(resp.mensaje);
                        console.log(resp.descripcion);
                    }
                    else{
                        if(($("#problemaEditarEtiqueta option")).length) $("#problemaEditarEtiqueta option:last").after("<option value"+resp.letra+">"+resp.letra+"</option>");
                        else $("#problemaEditarEtiqueta").html("<option value"+resp.letra+">"+resp.letra+"</option>");
                        let nuevoProblema = $("#cargarProblemas .cargandoProblema");
                        nuevoProblema.removeClass("cargandoProblema");
                        nuevoProblema.addClass("cargarProblema");
                        nuevoProblema.attr("idProblema",resp.idProblema);
                        nuevoProblema.html(resp.letra);
                        nuevoProblema.attr("title",titulo);
                        nuevoProblema.attr("problema"," - "+titulo);
                        cartelNotificacion(resp.mensaje);
                        cargarProblema(resp.idProblema);
                    }
                }
            });
        }
        else{
            cartelInput("problemaNombreCreacion",false,"cartelErrorNombreProblema","Título no valido");
        }
    }
    else{
        cartelInput("problemaNombreCreacion",false,"cartelErrorNombreProblema","Completar el campo");
    }
}

$(document).on('click', '#problema-guardar', function(){
    let element = $(this)[0].parentElement;
    let idProblema = $(element).attr('idProblema');
    if(idProblema != "") guardarProblema(idProblema);
    else cartelNotificacion("Ningun problema seleccionado");
});

function verificacionDatosProblema(){
    let band = true;
    var exp = new RegExp(/^[A-Za-z0-9À-ÿ\u00f1\u00d1\s]+$/g);
    if(!exp.test($("#problemaEditarTitulo").val())){
        cartelInput("problemaEditarTitulo",false,"cartelProblemaEditorTitulo","Título no valido");
        band = false;
    }
    if(isNaN($("#problemaEditarLimite").val())){
        cartelInput("problemaEditarLimite",false,"cartelProblemaEditorLimite","Ingresar solo numeros");
        band = false;
    }
    return band;
}

function guardarProblema(idProblema){
    if(verificacionDatosProblema()){
        var datos = {
            idProblema : idProblema,
            idTorneo: idTorneo,
            titulo: $("#problemaEditarTitulo").val(),
            limite: $("#problemaEditarLimite").val(),
            letra: $("#problemaEditarEtiqueta").val(),
            descripcion: editorDescripcion.getData(),
            entrada: editorEntrada.getData(),
            salida: editorSalida.getData(),
            testPublico: ($("#select-test-publicos option").length) ? $("#select-test-publicos").val() : 0,
            metodo: "guardar"
        };
        $.ajax({
            url: "../PHP/editarProblema.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    console.log(resp.descripcion);
                }
                cartelNotificacion(resp.mensaje);
                let carga = `
                    <div class="cargando-problemas-columna my-1">
                        <strong class="text-cargando-problemas"></strong>
                        <div class="spinner-border" role="status" aria-hidden="true" title="Cargando problemas..."></div>
                    </div>
                `;
                $("#cargarProblemas").html(carga);
                cargarDatosProblemas();
            }
        });
    }
}

$(document).on('click', '#problema-eliminar', function(){
    let element = $(this)[0].parentElement;
    let idProblema = $(element).attr('idProblema');
    if(idProblema != ""){ 
        let contenido = `
            <div class="d-flex align-items-center justify-content-between">
                <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                <p class="mb-0"> ¿Estas seguro de querer eliminar el problema? </p>
            </div>
        `;
        let botones = `
            <div class="d-flex justify-content-between w-100">
                <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaEmergenteEliminar);">Cancelar</button>
                <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaEmergenteEliminar); eliminarProblema(${idProblema});">Si, eliminar</button>
            </div>
        `;
        ventanaEmergenteEliminar = Swal.fire({
            html: contenido,
            showConfirmButton: false,
            footer: botones
        });
    }
    else cartelNotificacion("Ningun problema seleccionado");
});

function eliminarProblema(idProblema){
    var datos = {
        idProblema: idProblema,
        metodo: "eliminar"
    }
    $.ajax({
        url: "../PHP/editarProblema.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                console.log(resp.descripcion);
            }
            cartelNotificacion(resp.mensaje);
            let carga = `
                <div class="cargando-problemas-columna my-1">
                    <strong class="text-cargando-problemas"></strong>
                    <div class="spinner-border" role="status" aria-hidden="true" title="Cargando problemas..."></div>
                </div>
            `;
            $("#cargarProblemas").html(carga);
            /*Eliminacion de datos*/
            $("#logo-lenguaje").prop('src',"../Imagenes/oval.png");
            $("#codigo-solucion-subido").html("Ningún codigo subido");
            $("#select-test-publicos").prop('disabled',true);
            $("#select-test-publicos").html('<option value="0">0</option>');
            $("#eliminar-codigo-solucion").prop("disabled",true);
            $("#id-problema-editor").html("Ningun problema seleccionado");
            $("#id-problema-cargar").attr("idProblema","");
            $("#problemaEditarTitulo").val("");
            $("#problemaEditarEtiqueta").val("");
            $("#problemaEditarLimite").val("");
            editorDescripcion.setData("");
            editorEntrada.setData("");
            editorSalida.setData("");
            tableCasos.clear().draw();
            cargarDatosProblemas();
        }
    });
}   

function modalPreguntaEliminarArchivo(){
    let contenido = `
        <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
            <p class="mb-0"> ¿Estas seguro de querer eliminar el archivo? </p>
        </div>
    `;
    let botones = `
        <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaEmergenteEliminarArchivo);">Cancelar</button>
            <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaEmergenteEliminarArchivo); eliminarArchivoSolucion(${$("#id-problema-cargar").attr("idProblema")});">Si, eliminar</button>
        </div>
    `;
    ventanaEmergenteEliminarArchivo = Swal.fire({
        html: contenido,
        showConfirmButton: false,
        footer: botones
    });
}

function modalBorrarCasosSalida(){
    let contenido = `
        <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
            <p class="mb-0"> ¿Estas seguro de querer eliminar todo los casos de salida? </p>
        </div>
    `;
    let botones = `
        <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaBorrarCasosSalida);">Cancelar</button>
            <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaBorrarCasosSalida); eliminarCasosSalida(${$("#id-problema-cargar").attr("idProblema")});">Si, eliminar</button>
        </div>
    `;
    ventanaBorrarCasosSalida = Swal.fire({
        html: contenido,
        showConfirmButton: false,
        footer: botones
    });
}

function modalBorrarCasosTodos(){
    let contenido = `
        <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
            <p class="mb-0"> ¿Estas seguro de querer eliminar todo los casos? </p>
        </div>
    `;
    let botones = `
        <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaBorrarCasosSalida);">Cancelar</button>
            <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaBorrarCasosSalida); eliminarCasosTodos(${$("#id-problema-cargar").attr("idProblema")});">Si, eliminar</button>
        </div>
    `;
    ventanaBorrarCasosTodos = Swal.fire({
        html: contenido,
        showConfirmButton: false,
        footer: botones
    });
}

function eliminarArchivoSolucion(idProblema){
    var datos = {
        idProblema : idProblema,
        metodo: "eliminar-archivo-solucion"
    };
    $.ajax({
        url: "../PHP/editarProblema.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(!resp.error){
                $("#logo-lenguaje").prop('src',"../Imagenes/oval.png");
                $("#codigo-solucion-subido").html("Ningún codigo subido");
                $("#eliminar-codigo-solucion").prop("disabled",true);
                $("#generar-test-salida").prop("disabled",true);
            }
        }
    });
}

function subirCasosEntrada(){
    var datos = new FormData();
    let n = $('#subir-casos-entrada')[0].files.length;
    for(let i = 0; i < n; i++){
        let nombre = 'test'+(i+1);
        datos.append(nombre, $('#subir-casos-entrada')[0].files[i]);
    }
    datos.append("idProblema",$("#id-problema-cargar").attr("idProblema"));
    datos.append("n",n);
    datos.append("metodo","subir");
    $.ajax({
        url: "../PHP/editarTest.php",
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
            }
            else{
                let j = tableCasos.rows().count();
                for(let i=0;i<n;i++){ 
                    let fila = tableCasos.row.add([j+i+1,'test'+(j+i+1),'','<button type="button" class="btn btn-secondary btn-sm mostrar-test-contenido" title="Ver caso de prueba"><i class="bi bi-eye"></i></button>','<button type="button" class="btn btn-secondary btn-sm eliminar-test" title="Eliminar" ><i class="bi bi-trash"></i></button>']).node();
                    $(fila).addClass("align-middle");
                    $(fila).attr("in",true);
                    $(fila).attr("out",false);
                    $(fila).attr("dato",j+i+1);
                }
                tableCasos.draw();
                myModalSubirCasos.hide();
                $("#borrar-todo-casos").prop('disabled',false);
                $('#subir-casos-entrada').fileinput('clear');
                $("#generar-test-salida").prop('disabled',false);
            }
        }
    });
}

function generarCasosSalida(){
    var datos = {
        idProblema: $("#id-problema-cargar").attr("idProblema"),
        metodo: "generar"
    }
    $("#generar-test-salida").html('<div class="spinner-border spinner-border-sm" role="status"></div>');
    $("#generar-test-salida").attr('titulo','Generando...  ');
    $.ajax({
        url: "../PHP/editarTest.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            console.log(resp);
            $("#generar-test-salida").html('<i class="bi bi-arrow-right-square"></i>');
            $("#generar-test-salida").attr('titulo','Generar salida ');
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                if(resp.modal){
                    let contenido = `
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-2"> No se pudo completar debido al siguiente error:</p>
                                <p class="mb-0"><span class="text-danger fw-bold">${resp.mensaje}</span>${(parseInt(resp.test) != 0) ? "  en el <span class='text-primary'>TEST:"+resp.test+"</span>" : ""}</p>
                            </div>
                        </div>
                    `;
                    let botones = `
                        <div class="d-flex justify-content-between w-100">
                            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaErrorGenerar);">Cancelar</button>
                            <button type="button" class="btn btn-primary px-4" onclick="Swal.close(ventanaErrorGenerar);">Ok</button>
                        </div>
                    `;
                    ventanaErrorGenerar = Swal.fire({
                        html: contenido,
                        showConfirmButton: false,
                        footer: botones
                    });
                }
                else{
                    $("#generar-test-salida").prop('disabled',true);
                    cartelNotificacion(resp.mensaje);  
                }
                let inicio = parseInt(resp.iniciar);
                let generados = parseInt(resp.generados);

                if(generados > 0) $("#borrar-todo-salida").prop('disabled',false);

                if(inicio != generados){
                    $("#select-test-publicos").prop('disabled',false);
                    if(($("#select-test-publicos option")).length){
                        for(let i=inicio+1;i<=generados;i++){
                            $("#select-test-publicos option:last").after("<option value"+i+">"+i+"</option>")
                        }
                    }
                    else{
                        let cargar = '';
                        for(let i=1;i<=generados;i++){
                            if(i == 1) cargar += "<option value"+i+" selected>"+i+"</option>";
                            else cargar += "<option value"+i+">"+i+"</option>";
                        }
                        $("#select-test-publicos").html(cargar);
                    }
                } 
                
                tableCasos.rows().every(function(rowIdx, tableLoop, rowLoop){
                    let fila = tableCasos.row(rowIdx);
                    let indice = fila.data()[0];
                    if(indice > inicio && indice <= generados){
                        tableCasos.cell(rowIdx,2).data("test"+indice);
                        $(fila.node()).attr('out',true);
                    }
                });
                
                tableCasos.draw();
            }
        }
    });
}

function eliminarCasosSalida(idProblema){
    var datos = {
        idProblema: idProblema,
        metodo: "borrar-salida"
    }
    $.ajax({
        url: "../PHP/editarTest.php",
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

                tableCasos.rows().every(function(rowIdx, tableLoop, rowLoop){
                    tableCasos.cell(rowIdx,2).data("");
                    let fila = tableCasos.row(rowIdx);
                    $(fila.node()).attr('out',false);
                });
                
                tableCasos.draw();
                $("#borrar-todo-salida").prop('disabled',true);
                $("#select-test-publicos").prop('disabled',true);
                $("#select-test-publicos").html('');
                $("#generar-test-salida").prop('disabled',false);
            }
        }
    });
}

function eliminarCasosTodos(idProblema){
    var datos = {
        idProblema: idProblema,
        metodo: "borrar-todo"
    }
    $.ajax({
        url: "../PHP/editarTest.php",
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
                tableCasos.clear().draw();
                $("#borrar-todo-salida").prop('disabled',true);
                $("#borrar-todo-casos").prop('disabled',true);
                $("#select-test-publicos").prop('disabled',true);
                $("#select-test-publicos").html('');
                $("#generar-test-salida").prop('disabled',true);
            }
        }
    });
}

function cargarSelectTestPublico(n,testPublico){
    let template = '';
    for(let i=1;i<=n;i++){
        if(i==testPublico) template += '<option value="'+(i)+'" selected>'+(i)+'</option>';
        else template += '<option value="'+(i)+'">'+(i)+'</option>';
    }
    if(n > 0) $("#select-test-publicos").prop('disabled',false);
    else $("#select-test-publicos").prop('disabled',true);
    $("#select-test-publicos").html(template);
}

$(document).on("click",".mostrar-test-contenido",function(){
    let element = $(this)[0].parentElement.parentElement;
    let dato = $(element).attr('dato');
    let entrada = ($(element).attr('in') == 'true') ? true : false;
    let salida = ($(element).attr('out') == 'true') ? true : false;

    if(entrada){
        $("#test-contenido-entrada").html('<div class="d-flex align-items-center"><strong>Cargando...</strong><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div></div>');
    }

    if(salida){
        $("#test-contenido-salida").html('<div class="d-flex align-items-center"><strong>Cargando...</strong><div class="spinner-border ms-auto" role="status" aria-hidden="true"></div></div>');
    }
    else{
        $("#test-contenido-salida").html('Caso no generado');
    }
    $("#ver-test-titulo").html('Test '+dato);
    myModalVerCasos.show();
    var datos = {
        test: $(element).attr('dato'),
        idProblema: $("#id-problema-cargar").attr('idProblema'),
        entrada: entrada,
        salida: salida,
        metodo: "mostrar"
    }
    $.ajax({
        url: "../PHP/editarTest.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalVerCasos.hide();
            }
            else{
                if(entrada){ 
                    $("#test-contenido-entrada").html(resp.contenidoEntrada);
                    $("#enlace-descargar-entrada").prop('href','../Datos/Problemas/'+$("#id-problema-cargar").attr('idProblema')+'/in/test'+$(element).attr('dato')+".in");
                    $("#enlace-descargar-entrada").prop('download','test'+$(element).attr('dato')+'.in')
                }
                if(salida) {
                    $("#test-contenido-salida").html(resp.contenidoSalida);
                    $("#enlace-descargar-salida").prop('href','../Datos/Problemas/'+$("#id-problema-cargar").attr('idProblema')+'/out/test'+$(element).attr('dato')+".out");
                    $("#enlace-descargar-salida").prop('download','test'+$(element).attr('dato')+'.out')
                }
            }
        }
    });
});

$(document).on('click','.eliminar-test',function(){
    let element = $(this)[0].parentElement.parentElement;
    let dato = $(element).attr('dato');
    let entrada = ($(element).attr('in') == 'true') ? true : false;
    let salida = ($(element).attr('out') == 'true') ? true : false;
    let contenido = `
        <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
            <p class="mb-0"> ¿Estas seguro de eliminar el Test ${dato}? </p>
        </div>
    `;
    let botones = `
        <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaBorrarCasosSalida);">Cancelar</button>
            <button type="button" class="btn btn-danger" onclick="Swal.close(ventanaBorrarCasosSalida); eliminarTest(${$("#id-problema-cargar").attr("idProblema")},${dato},${entrada},${salida});">Si, eliminar</button>
        </div>
    `;
    ventanaBorrarCasosTodos = Swal.fire({
        html: contenido,
        showConfirmButton: false,
        footer: botones
    });
});

function eliminarTest(idProblema,test,entrada,salida){
    var datos = {
        test: test,
        idProblema: idProblema,
        entrada: entrada,
        salida: salida,
        metodo: "eliminar-test"
    }
    console.log(datos);
    $.ajax({
        url: "../PHP/editarTest.php",
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
                if(salida){
                    let select = $("#select-test-publicos option:last").prop('selected');
                    $("#select-test-publicos option:last").remove();
                    if(($("#select-test-publicos option")).length == 0){
                        $("#select-test-publicos").prop('disabled',true);
                        $("#borrar-todo-salida").prop('disabled',true);
                    }
                    else{
                        if(select){
                            $("#select-test-publicos option:last").prop('selected',true);
                        }
                    }
                }
                let filaEliminar;
                tableCasos.rows().every(function(rowIdx, tableLoop, rowLoop){
                    let fila = tableCasos.row(rowIdx);
                    let indice = fila.data()[0];
                    if(indice == test) filaEliminar = fila;
                });
                filaEliminar.remove();

                tableCasos.rows().every(function(rowIdx, tableLoop, rowLoop){
                    let fila = tableCasos.row(rowIdx);
                    let indice = fila.data()[0];
                    if(indice > test){
                        tableCasos.cell(rowIdx,0).data(indice-1);
                        tableCasos.cell(rowIdx,1).data("test"+(indice-1));
                        if(tableCasos.cell(rowIdx,2).data() != "") tableCasos.cell(rowIdx,2).data("test"+(indice-1));
                        $(fila.node()).attr('dato',indice-1);
                    }
                });
                tableCasos.draw();
            }
        }
    });
}







