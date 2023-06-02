var idUsuario;
const mesesCompletos = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
var banderaVerificacionCorreoGlobal = false;
var myModalModificarContra;
var myModalModificarPais;
var myModalModificarCorreo;
var myModalModificarImagen;
var bandCorreoNuevoPerfil = false;

$(document).ready(function() {
    cargarModalModificarContra();
    cargarModalModificarPais();
    cargarModalModificarCorreo();
    cargarModalModificarImagen();
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    idUsuario = urlParams.get('usuario');
    cargarPerfil();
    $("#subirFotoPerfil").fileinput({
        uploadUrl: "../PHP/subirImagen.php", 
        uploadAsync: false,
        minFileCount: 1,
        maxFileCount: 1,
        showUpload: false, 
        showRemove: false,
        autoReplace: true,
        language: 'es',
        elErrorContainer: '#kartik-file-errors',
        image:200,
        allowedFileExtensions: ["jpg", "png", "gif"],
        fileActionSettings: {
            showUpload: false
        }
    });
});

function cargarModalModificarContra(){
    document.getElementById("modalModificarContra").outerHTML = `
    <div class="modal fade" id="modalModificarContra" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modificar contraseña</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="contraActualPerfil" class="form-label">Ingrese su contraseña actual:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="password" class="form-control" placeholder="Contraseña" id="contraActualPerfil" onkeyup="limpiarInput('contraActualPerfil');">
                        <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                        <div class="invalid-feedback" id="cartelErrorContraActual"></div>
                    </div>
                    <label for="passNuevaPerfil" class="form-label">Ingrese contraseña nueva:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="password" class="form-control" placeholder="Contraseña" id="passNuevaPerfil" onblur="controlPassNuevaPerfil();" onkeyup="limpiarInput('passNuevaPerfil');">
                        <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                        <div class="invalid-feedback" id="cartelErrorPassNuevaPerfil"></div>
                    </div>
                    <label for="pass2NuevaPerfil" class="form-label">Repita la contraseña nueva:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="password" class="form-control" placeholder="Repetir contraseña" id="pass2NuevaPerfil" onblur="controlPass2NuevaPerfil();" onkeyup="limpiarInput('pass2NuevaPerfil');">
                        <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                        <div class="invalid-feedback" id="cartelErrorPassNueva2Perfil"></div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="cambiarClave();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalModificarContra = new bootstrap.Modal(document.getElementById('modalModificarContra'),{});
    document.getElementById("modalModificarContra").addEventListener("hidden.bs.modal",function(){
        limpiarInput('contraActualPerfil');
        limpiarInput('passNuevaPerfil');
        limpiarInput('pass2NuevaPerfil');
    });
}

function cargarModalModificarPais(){   
    document.getElementById("modalModificarPais").outerHTML = `
    <div class="modal fade" id="modalModificarPais" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modificar país</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <label for="pais" class="form-label">País:</label>
                    <div class="input-group mb-3">
                        <select class="form-select" aria-label="Default select example" id="paisPerfil"></select>
                        <label class="input-group-text" for="paisPerfil"><i class="bi bi-globe"></i></label>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="modificarPais();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalModificarPais = new bootstrap.Modal(document.getElementById('modalModificarPais'),{});
}

function cargarModalModificarCorreo(){
    document.getElementById("modalModificarCorreo").outerHTML = `
    <div class="modal fade" id="modalModificarEmail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modificar Correo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="siguientePasoRecuperarClave">
                    <label for="contraActualPerfilPais" class="form-label">Ingrese su contraseña actual:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="password" class="form-control" placeholder="Contraseña" id="contraActualPerfilEmail" onkeyup="limpiarInput('contraActualPerfilEmail');">
                        <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/lock.png" width="20" height="20"></span>
                        <div class="invalid-feedback" id="cartelErrorContraActualEmail"></div>
                    </div>
                    <label for="passNuevaPerfil" class="form-label">Ingrese su nuevo correo electronico:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="email" class="form-control" placeholder="correo@example.com" id="correoNuevoPerfil" onblur="controlEmailPerfil();" onkeyup="limpiarInput('correoNuevoPerfil');">
                        <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/correo3.png" width="20" height="20"></span>
                        <div class="invalid-feedback" id="cartelErrorCorreoPerfil"></div>
                    </div>
                    <div class="d-flex justify-content-center align-content-center">
                        <img src="../Imagenes/signoExclamacion.png" height="30" width="30" class="my-auto m-2" style="opacity: 0.5;">
                        <span class="text-muted">Recuerde que al modificar el email deberá activar la cuenta nuevamente.</span>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="cambiarCorreo();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalModificarCorreo = new bootstrap.Modal(document.getElementById('modalModificarEmail'),{});
    document.getElementById("modalModificarEmail").addEventListener("hidden.bs.modal",function(){
        limpiarInput('contraActualPerfilEmail');
        limpiarInput('correoNuevoPerfil');
    });
}

function cargarModalModificarImagen(){
    document.getElementById("modalModificarFotoPerfil").outerHTML = `
    <div class="modal fade" id="modalModificarFoto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modificar foto de perfil</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="file" id="subirFotoPerfil" name="imagenPerfilUsuario" data-msg-placeholder="Seleccione una imagen" lang="es">
                    <div id="kartik-file-errors"></div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="subirImagen();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalModificarImagen = new bootstrap.Modal(document.getElementById('modalModificarFoto'),{});
    document.getElementById("modalModificarFoto").addEventListener("hidden.bs.modal",function(){
    });
}

function paisesPerfilSelect(paisUsuario){
    $.ajax({
        url: "../PHP/cargarPaises.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let template = "";
                resp.lista.forEach(pais => {
                    if(paisUsuario == pais.id) template += `<option value="${pais.id}" selected>${pais.nombre}</option>`;
                    else template += `<option value="${pais.id}">${pais.nombre}</option>`;
                    
                });
                document.getElementById("paisPerfil").innerHTML = template;
            }
        }
    });
}

function cargarPerfil(){
    var datos = {
        idUsuario: idUsuario
    }
    $.ajax({
        url: "../PHP/cargarPerfil.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            if(respuesta == 'Error'){
                cartelNotificacion(respuesta);
            }
            else{
                let dato = JSON.parse(respuesta);
                console.log(dato);
                if(dato.banderaEdit == true){
                    document.getElementById("datosModificarPais").innerHTML = "<img src='../Imagenes/edit5.png' class='imagenPerfilEdit' data-bs-toggle='modal' data-bs-target='#modalModificarPais'>";
                    //document.getElementById("datosModificarCorreo").innerHTML = "<img src='../Imagenes/edit5.png' class='imagenPerfilEdit' data-bs-toggle='modal' data-bs-target='#modalModificarEmail'>"; 
                    document.getElementById("datosModificarContra").innerHTML = "<img src='../Imagenes/edit5.png' class='imagenPerfilEdit' data-bs-toggle='modal' data-bs-target='#modalModificarContra'>";
                    document.getElementById("perfilPassword").innerHTML = 'Cambiar contraseña';
                    document.getElementById("perfilUsuarioImagen").outerHTML = '<img src="" class="perfilUsuario" id="perfilUsuarioImagen" data-bs-toggle="modal" data-bs-target="#modalModificarFoto" style="cursor: pointer;">';
                    paisesPerfilSelect(dato.idPais);
                }
                document.getElementById("perfilUsuario").innerHTML = dato.usuario;
                document.getElementById("perfilPais").innerHTML = dato.pais;
                document.getElementById("perfilCorreo").innerHTML = dato.correo;
                document.getElementById("perfilFechaCreacion").innerHTML = ((parseInt(dato.fechaDeCreacion[8]) != 0) ? dato.fechaDeCreacion[8] : ' ')+dato.fechaDeCreacion[9]+' de '+mesesCompletos[parseInt(dato.fechaDeCreacion[5]+dato.fechaDeCreacion[6])-1]+' del año '+dato.fechaDeCreacion[0]+dato.fechaDeCreacion[1]+dato.fechaDeCreacion[2]+dato.fechaDeCreacion[3]+' Hora '+dato.fechaDeCreacion[11]+dato.fechaDeCreacion[12]+dato.fechaDeCreacion[13]+dato.fechaDeCreacion[14]+dato.fechaDeCreacion[15];
                document.getElementById("perfilUltimaConexion").innerHTML = ((parseInt(dato.ultimaConexion[8]) != 0) ? dato.ultimaConexion[8] : ' ')+dato.ultimaConexion[9]+' de '+mesesCompletos[parseInt(dato.ultimaConexion[5]+dato.ultimaConexion[6])-1]+' del año '+dato.ultimaConexion[0]+dato.ultimaConexion[1]+dato.ultimaConexion[2]+dato.ultimaConexion[3]+' Hora '+dato.ultimaConexion[11]+dato.ultimaConexion[12]+dato.ultimaConexion[13]+dato.ultimaConexion[14]+dato.ultimaConexion[15];
                document.getElementById("perfilUsuarioImagen").src = dato.foto;
                document.getElementById("totalTorneoParticipados").innerHTML = dato.participaciones;
                document.getElementById("totalProblemasResuelto").innerHTML = dato.problemasResueltos;
                document.getElementById("torneoGanados").innerHTML = dato.torneoGanados;
                cargarEnviosPerfil();
            }
        }
    });
}

function modificarPais(){
    var datos = {
        pais : document.getElementById("paisPerfil").value
    };
    $.ajax({
        url: "../PHP/modificarPais.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            console.log(respuesta);
            if(resp.error){
                console.log(resp.descripcion);
            }
            else{
                document.getElementById("perfilPais").innerHTML = resp.nombre;
            }
            cartelNotificacion(resp.mensaje);
            myModalModificarPais.hide();
        }
    });
}

function cambiarCorreo(){
    let contraActual = document.getElementById("contraActualPerfilEmail").value;
    controlEmailPerfil();
    if(bandCorreoNuevoPerfil){
        var datos = {
            contra: contraActual
        };
        $.ajax({
            url: "../PHP/verificacionDeContra.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                    myModalModificarCorreo.hide();
                }
                else{
                    if(resp.estado){
                        datosNuevo = {
                            usuario: idUsuario,
                            correo: document.getElementById("correoNuevoPerfil").value
                        };
                        $.ajax({
                            url: "../PHP/modificarCorreo.php",
                            type: "POST",
                            data: datosNuevo,
                            success: function(respuesta){
                                let resp = JSON.parse(respuesta);
                                if(resp.error){
                                    console.log(resp.descripcion);
                                }
                                else{
                                    document.getElementById("perfilCorreo").innerHTML = datosNuevo.correo;
                                    cargarDatosSesion();
                                }
                                cartelNotificacion(resp.mensaje);
                                myModalModificarCorreo.hide();
                            }
                        });
                    }
                    else{
                        document.getElementById("contraActualPerfilEmail").classList.add("is-invalid");
                        document.getElementById("cartelErrorContraActualEmail").innerHTML = "Contraseña no valida";
                    }
                }
            }
        });
    }
}

function controlEmailPerfil(){
    if(document.getElementById("correoNuevoPerfil").value!=""){
        let regEmail = /^\w+(\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var validacionCorreo = document.getElementById("correoNuevoPerfil").value;
        if(!regEmail.test(validacionCorreo)){
            cartelInput("correoNuevoPerfil",false,"cartelErrorCorreoPerfil","El formato ingresado no es correcto");
            bandCorreoNuevoPerfil = false;
        }
        else{
            var datos = {
                correo: validacionCorreo
            }
            $.ajax({
                url: "../PHP/verificacionDeCorreo.php",
                type: "POST",
                data: datos,
                success: function(respuesta){
                    var resp = JSON.parse(respuesta);
                    if(resp.error){
                        myModalRegistro.hide();
                        cartelNotificacion(resp.mensaje)
                        console.log(resp.descripcion);
                        limpiarDatos();
                    }
                    else{
                        if(resp.numero){
                            cartelInput("correoNuevoPerfil",false,"cartelErrorCorreoPerfil","Correo ya existente");
                            bandCorreoNuevoPerfil = false;
                        }
                        else{
                            bandCorreoNuevoPerfil = true;
                            cartelInput("correoNuevoPerfil",true,"cartelErrorCorreoPerfil","");
                        }
                    }
                }
            });
        }
    }
    else{
        cartelInput("correoNuevoPerfil",false,"cartelErrorCorreoPerfil","No dejar el campo vacio");
        bandCorreoNuevoPerfil = false;
    }
}

function subirImagen(){
    var datos = new FormData();
    datos.append('archivo', $('#subirFotoPerfil')[0].files[0]);
    $.ajax({
        url: "../PHP/subirImagen.php",
        type: "POST",
        data: datos,
        processData: false,
        contentType: false,
        cache: false,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                console.log(resp.descripcion);
            }
            else{
                $("#perfilUsuarioImagen").prop("src",resp.ruta);
                $("#miniPerfilMenu").prop("src",resp.ruta);
            }
            cartelNotificacion(resp.mensaje);
            myModalModificarImagen.hide();
        }
    });
}

function cambiarClave(){
    if(controlPassNuevaPerfil() && controlPass2NuevaPerfil()){
        var contra1 = document.getElementById("contraActualPerfil").value;
        datos = {
            contra: contra1
        };
        $.ajax({
            url: "../PHP/verificacionDeContra.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                }
                else{
                    if(resp.estado){
                        datosNuevo = {
                            usuario: idUsuario,
                            contra: document.getElementById("passNuevaPerfil").value
                        };
                        $.ajax({
                            url: "../PHP/modificarContra.php",
                            type: "POST",
                            data: datosNuevo,
                            success: function(respuesta){
                                let resp = JSON.parse(respuesta);
                                if(resp.error){
                                    console.log(resp.descripcion);
                                }
                                cartelNotificacion(resp.mensaje);
                                myModalModificarContra.hide();
                            }
                        });
                    }
                    else{
                        document.getElementById("contraActualPerfil").classList.add("is-invalid");
                        document.getElementById("cartelErrorContraActual").innerHTML = "Contraseña no valida";
                    }
                }
            }
        });
    }
}

function controlPassNuevaPerfil(){
    if(document.getElementById("passNuevaPerfil").value!=""){
        var validacionPass = document.getElementById("passNuevaPerfil").value;
        if(validacionPass.length < 6 || validacionPass.length > 30){
            cartelInput("passNuevaPerfil",false,"cartelErrorPassNuevaPerfil","Debe tener como minimo 6 caracteres y como maximo 30");
        }
        else{
            cartelInput("passNuevaPerfil",true,"cartelErrorPassNuevaPerfil","");
            return true;
        }
    }
    else{
        cartelInput("passNuevaPerfil",false,"cartelErrorPassNuevaPerfil","El campo esta vacio");
    }
    return false;
}


function controlPass2NuevaPerfil(){
    if(document.getElementById("pass2NuevaPerfil").value!=""){
        var validacionPass2 = document.getElementById("pass2NuevaPerfil").value;
        var validacionPass = document.getElementById("passNuevaPerfil").value;
        if(validacionPass2 != validacionPass){
            cartelInput("pass2NuevaPerfil",false,"cartelErrorPassNueva2Perfil","Las contraseñas no coinciden");
        }
        else{
            cartelInput("pass2NuevaPerfil",true,"cartelErrorPassNueva2Perfil","");
            return true;
        }
    }
    else{
        cartelInput("pass2NuevaPerfil",false,"cartelErrorPassNueva2Perfil","El campo esta vacio");
    }
    return false;
}

function cargarEnviosPerfil(){
    tableEnvio = $('#envioTabla').DataTable({
        ajax: {
            url: '../PHP/cargarEnvios.php',
            type: "POST",
            data: {usuario:idUsuario}
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
        "dom": '<"top-datatable-custom"lf>rtp'
    });
}
