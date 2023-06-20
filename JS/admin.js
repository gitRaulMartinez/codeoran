var tableUsuarios;
var paisFiltroUsuario = "Todos";
var verificacionFiltroUsuario = "Ambas";
var nivelFiltroUsuario = "Todos";
var fechaMinimaCreacion,fechaMaximaCreacion;
var horaMinimaCreacion,horaMaximaCreacion;
var fechaMinimaUltimaConexion,fechaMaximaUltimaConexion;
var horaMinimaUltimaConexion,horaMaximaUltimaConexion;
var ventanaEliminarImagen;

$(document).ready(function(){
    verificacionAdministrador();
    if(document.getElementById("inicioSessionCaja")) cargarDatosSesion();
    if(document.getElementById("tablaUsuarios")) cargarUsuarios();
    if(document.getElementById("offCanvasFiltroUsuarios")) cargarOffCanvasFiltroUsuario();
    if(document.getElementById("modalVerFotoUsuario")) cargarModalVerFotoUsuario();
    if(document.getElementById("modalEditarUsuario")) cargarModalEditarUsuario();
});

function verificacionAdministrador(){
    $.ajax({
        url: "../PHP/verificacionAdmin.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                window.location = 'index.html';
            }
        }
    });
}

function cargarUsuarios(){
    tableUsuarios = $('#tablaUsuarios').DataTable({
        ajax: {
            url: '../PHP/cargarUsuarios.php',
            type: "POST",
            data: {metodo: "tabla"}
        }
        ,
        "columns": [
            { "data": "usuario" },
            { "data": "correo" },
            { "data": "nombre" },
            { "data": "activoUsuario"},
            { "data": "nivelUsuario" },
            { "data": "fechaC" },
            { "data": "horaC" },
            { "data": "ultimaFC" },
            { "data": "ultimaHC" },
            { "data": "imagen" },
            { "data": "editUsuario" }
        ]
        ,
        columnDefs: [
            { responsivePriority: 1, targets: [0,9,10] },
            { responsivePriority: 3, targets: [1,4] },
            { responsivePriority: 4, targets: [2,3]},
            { responsivePriority: 5, targets: [5,6,7,8]},
            {
                targets: [9,10],
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
                                            '<td>'+col.title+datoExtraFecha(i)+'</td> '+
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
        "dom": '<"filaDomDatatable"l<"filtrosUsuarios">>rtp'
    });
    $(".filtrosUsuarios").html('<button class="btn btn-primary px-4 my-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFiltroUsuario" aria-controls="offcanvasRight">Filtros</button>');
}

function datoExtraFecha(indiceTabla){
    switch(indiceTabla){
        case 5: return " de Creación:";
        case 6: return " de Creación:";
        case 7: return " Ultima conexión:";
        case 8: return " Ultima conexión:";
        default: return "Acciones:"; 
    }
}

function cargarOffCanvasFiltroUsuario(){
    document.getElementById("offCanvasFiltroUsuarios").outerHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasFiltroUsuario" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
            <h5 id="offcanvasRightLabel">Filtros</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="contenido-filtro-torneo">
                <div class="filtroTorneo">
                    <label for="usuarioFiltroBuscar" class="form-label">Usuario:</label>
                    <input type="text" id="usuarioFiltroBuscar" class="form-control w-100">
                </div>
                <div class="filtroTorneo">
                    <label for="correoFiltroBuscar" class="form-label">Correo:</label>
                    <input type="email" id="correoFiltroBuscar" class="form-control w-100">
                </div>
                <div class="filtroTorneo">
                    <label for="selectFiltroUsuarioPais" class="form-label">País:</label>
                    <select id="selectFiltroUsuarioPais" class="form-select w-100" aria-label="Default select example"></select>
                </div>
                <div class="filtroTorneo">
                    <label for="btn-ambas" class="form-label">Cuenta:</label>
                    <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" name="btnradio" id="btn-ambas" autocomplete="off" checked>
                        <label class="btn btn-outline-primary" for="btn-ambas">Ambas</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btn-verificada" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-verificada">Verificada</label>

                        <input type="radio" class="btn-check" name="btnradio" id="btn-no-verificada" autocomplete="off">
                        <label class="btn btn-outline-primary" for="btn-no-verificada">No verificada</label>
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="selectFiltroUsuarioNivel" class="form-label">Nivel usuario:</label>
                    <select id="selectFiltroUsuarioNivel" class="form-select w-100" aria-label="Default select example">
                        <option value="Todos">Todos</option>
                        <option value="Usuario Bloqueado">Usuario Bloqueado</option>
                        <option value="Usuario Normal">Usuario Normal</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Super Administrador">Super Administrador</option>
                    </select>
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicio" class="form-label">Fecha Creacion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioCreacion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFinCreacion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="tiempoInicio" class="form-label">Hora creacion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaInicioCreacion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaFinCreacion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="fechaInicio" class="form-label">Fecha Ultima Conexion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="date" class="form-control" placeholder="Fecha inicio" id="fechaInicioUltimaConexion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="date" class="form-control" placeholder="Fecha fin" id="fechaFinUltimaConexion">
                    </div>
                </div>
                <div class="filtroTorneo">
                    <label for="duracionInicio" class="form-label">Hora Ultima Conexion:</label>
                    <div class="input-group mb-2">
                        <span class="input-group-text">Inicio</span>
                        <input type="time" class="form-control" placeholder="Fecha inicio" id="horaInicioUltimaConexion">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Fin</span>
                        <input type="time" class="form-control" placeholder="Fecha fin" id="horaFinUltimaConexion">
                    </div>
                </div>
                <div class="filtroTorneo mx-auto">
                    <button type="button" class="btn btn-dark px-3" id="filtrarDatosUsuarios">Filtrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    fechaMinimaCreacion = "1990-01-01";
    fechaMaximaCreacion = "3000-01-01";
    horaMinimaCreacion = "00:00:00";
    horaMaximaCreacion = "23:59:59";

    fechaMinimaUltimaConexion = "1990-01-01";
    fechaMaximaUltimaConexion = "3000-01-01";
    horaMinimaUltimaConexion = "00:00:00";
    horaMaximaUltimaConexion = "23:59:59";

    $("#filtrarDatosUsuarios").on("click",function(){
        tableUsuarios.columns(0).search($("#usuarioFiltroBuscar").val());
        tableUsuarios.columns(1).search($("#correoFiltroBuscar").val());
        tableUsuarios.draw();
    });
    $("#selectFiltroUsuarioNivel").on("change",function(){
        nivelFiltroUsuario = $("#selectFiltroUsuarioNivel").val();
    });
    $("#selectFiltroUsuarioPais").on("change",function(){
        paisFiltroUsuario = $("#selectFiltroUsuarioPais").val();
    });
    $("#btn-ambas").on("click",function(){
        verificacionFiltroUsuario = "Ambas";
    });
    $("#btn-verificada").on("click",function(){
        verificacionFiltroUsuario = "verificada";
    });
    $("#btn-no-verificada").on("click",function(){
        verificacionFiltroUsuario = "no-verificada";
    });

    $("#fechaInicioCreacion").on("change",function(){
        if($("#fechaInicioCreacion").val() != "") fechaMinimaCreacion = $("#fechaInicioCreacion").val();
        else fechaMinimaCreacion = "1990-01-01";
    }); 
    $("#fechaFinCreacion").on("change",function(){
        if($("#fechaFinCreacion").val() != "") fechaMaximaCreacion = $("#fechaFinCreacion").val();
        else fechaMaximaCreacion = "3000-01-01";
    }); 
    $("#horaInicioCreacion").on("change",function(){
        if($("#horaInicioCreacion").val() != "") horaMinimaCreacion = $("#horaInicioCreacion").val();
        else horaMinimaCreacion = "00:00:00";
    }); 
    $("#horaFinCreacion").on("change",function(){
        if($("#horaFinCreacion").val() != "") horaMaximaCreacion = $("#horaFinCreacion").val();
        else horaMaximaCreacion = "23:59:59";
    }); 

    $("#fechaInicioUltimaConexion").on("change",function(){
        if($("#fechaInicioUltimaConexion").val() != "") fechaMinimaUltimaConexion = $("#fechaInicioUltimaConexion").val();
        else fechaMinimaUltimaConexion = "1990-01-01";
    }); 
    $("#fechaFinUltimaConexion").on("change",function(){
        if($("#fechaFinUltimaConexion").val() != "") fechaMaximaUltimaConexion = $("#fechaFinUltimaConexion").val();
        else fechaMaximaUltimaConexion = "3000-01-01";
    }); 
    $("#horaInicioUltimaConexion").on("change",function(){
        if($("#horaInicioUltimaConexion").val() != "") horaMinimaUltimaConexion = $("#horaInicioUltimaConexion").val();
        else horaMinimaUltimaConexion = "00:00:00";
    }); 
    $("#horaFinUltimaConexion").on("change",function(){
        if($("#horaFinUltimaConexion").val() != "") horaMaximaUltimaConexion = $("#horaFinUltimaConexion").val();
        else horaMaximaUltimaConexion = "23:59:59";
    }); 

    $.fn.dataTable.ext.search.push(busquedaFechaCreacionFiltroUsuario);
    $.fn.dataTable.ext.search.push(busquedaHoraCreacionFiltroUsuario);
    $.fn.dataTable.ext.search.push(busquedaFechaUltimaConexionFiltroUsuario);
    $.fn.dataTable.ext.search.push(busquedaHoraUltimaConexionFiltroUsuario);
    $.fn.dataTable.ext.search.push(busquedaPaisFiltro);
    $.fn.dataTable.ext.search.push(busquedaNivelUsuarioFiltro);
    $.fn.dataTable.ext.search.push(busquedaVerificadaFiltro);

    selectPaisFiltroUsuario();
}

function busquedaFechaCreacionFiltroUsuario(settings, data, dataIndex){
    var date = new Date(data[5]);
    var minimo = new Date(fechaMinimaCreacion);
    var maximo = new Date(fechaMaximaCreacion);
    if(( minimo <= date && date <= maximo )) return true;
    return false;
}

function busquedaHoraCreacionFiltroUsuario(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[6]);
    var minimo = new Date('2010/10/10 '+horaMinimaCreacion);
    var maximo = new Date('2010/10/10 '+horaMaximaCreacion);
    if(( minimo <= date  && date <= maximo )) return true;
    return false;
}

function busquedaFechaUltimaConexionFiltroUsuario(settings, data, dataIndex){
    var date = new Date(data[7]);
    var minimo = new Date(fechaMinimaUltimaConexion);
    var maximo = new Date(fechaMaximaUltimaConexion);
    if(( minimo <= date && date <= maximo )) return true;
    return false;
}

function busquedaHoraUltimaConexionFiltroUsuario(settings, data, dataIndex){
    var date = new Date('2010/10/10 '+data[8]);
    var minimo = new Date('2010/10/10 '+horaMinimaUltimaConexion);
    var maximo = new Date('2010/10/10 '+horaMaximaUltimaConexion);
    if(( minimo <= date  && date <= maximo )) return true;
    return false;
}

function busquedaPaisFiltro(settings, data, dataIndex){
    if(paisFiltroUsuario == 'Todos') return true;
    else{
        if(data[2] == paisFiltroUsuario) return true;
        else return false; 
    }
}

function busquedaVerificadaFiltro(settings, data, dataIndex){
    if(verificacionFiltroUsuario == 'Ambas') return true;
    else{
        if(verificacionFiltroUsuario == 'verificada'){
            if(data[3] == " Cuenta verificada "){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            if(verificacionFiltroUsuario == 'no-verificada'){
                if(data[3] == " Cuenta no verificada "){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    }
}

function busquedaNivelUsuarioFiltro(settings, data, dataIndex){
    if(nivelFiltroUsuario == 'Todos') return true;
    else{
        if(data[4] == nivelFiltroUsuario) return true;
        else return false; 
    }
}

function selectPaisFiltroUsuario(){
    $.ajax({
        url: "../PHP/cargarPaises.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion)
            }
            let template = "<option value='Todos' id='filtrarPais'>Todos</option>";
            resp.lista.forEach(pais => {
                template += `<option value="${pais.nombre}">${pais.nombre}</option>`;
            });
            document.getElementById("selectFiltroUsuarioPais").innerHTML = template;
        }
    });
}

function cargarModalVerFotoUsuario(){
    document.getElementById("modalVerFotoUsuario").outerHTML = `
    <div class="modal fade" id="modalModificarVerFoto" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Foto Perfil</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text">Usuario:</span>
                        <input type="text" class="form-control bg-white text-end" placeholder="Usuario" id="usuarioFotoPerfilEditar" readonly>
                    </div>
                    <label for="usuarioFotoPerfilAdmin" class="form-label">Imagen de perfil:</label>
                    <div class="d-flex justify-content-center m-2">
                        <div class="marcoEstilo border border-secondary border-3 rounded">
                            <img src="../Imagenes/sinPerfil.png" class="perfilUsuario" id="usuarioFotoPerfilAdmin">
                        </div>
                    </div>
                    
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-danger" onclick="modalEliminarFoto();" id="eliminarFotoPerfil">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalModificarFotoUsuario = new bootstrap.Modal(document.getElementById('modalModificarVerFoto'),{});

    $("#eliminarFotoPerfil").on("click",modalEliminarFoto);
}

$(document).on('click','.mostrar-imagen',function(){
    let elemento = $(this)[0].parentElement.parentElement;
    let usuario = $(elemento).attr('idUsuario');
    console.log(usuario);
    var datos = {
        usuario: usuario
    }
    $.ajax({
        url: "../PHP/cargarUsuario.php",
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
                $("#usuarioFotoPerfilEditar").val(usuario);
                if(resp.datoUsuario.fotoBandera) $("#eliminarFotoPerfil").prop("disabled",false);
                else $("#eliminarFotoPerfil").prop("disabled",true);
                $("#usuarioFotoPerfilAdmin").prop("src",resp.datoUsuario.foto);
                myModalModificarFotoUsuario.show();
            }
        }
    });
});

function modalEliminarFoto(){
    let contenido = `
        <div class="d-flex align-items-center justify-content-between">
            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
            <p class="mb-0"> ¿Estas seguro de querer eliminar la foto de perfil del usuario? </p>
        </div>
    `;
    let botones = `
        <div class="d-flex justify-content-between w-100">
            <button type="button" class="btn btn-secondary" onclick="Swal.close(ventanaEliminarImagen);">Cancelar</button>
            <button type="button" class="btn btn-danger me-1" onclick="Swal.close(ventanaEliminarImagen); eliminarFotoPerfilAdmin();">Eliminar</button>
        </div>
    `;
    ventanaEliminarImagen = Swal.fire({
        html: contenido,
        showConfirmButton: false,
        footer: botones
    });
}

function eliminarFotoPerfilAdmin(){
    var datos = {
        usuario: $("#usuarioFotoPerfilEditar").val(),
        metodo: "perfil"
    }
    $.ajax({
        url: "../PHP/editarUsuario.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalModificarFotoUsuario.hide();
            }
            else{
                let contenido = '';
                if(resp.editar){
                    contenido += `
                    <div class="d-flex align-items-center justify-content-between">
                        <i class="bi bi-check-circle m-2 text-success" style="font-size: 2rem;"></i>
                        <div>
                            <p class="mb-0">La foto de perfil a sido eliminada</p>
                        </div>
                    </div>
                    `;
                    $("#eliminarFotoPerfil").prop("disabled",true);
                    $("#usuarioFotoPerfilAdmin").prop("src",resp.rutaSinPerfil);
                }
                else{
                    contenido += `
                    <div class="d-flex align-items-center justify-content-between">
                        <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                        <p class="mb-0"> Solo puede modificar los datos de usuarios con un nivel más bajo al suyo </p>
                    </div>
                    `;
                }
                let botones = `
                    <div class="d-flex justify-content-between w-100">
                        <button type="button" class="btn btn-secondary ms-auto" onclick="Swal.close(ventanaEliminarImagen);">Cerrar</button>
                    </div>
                    `;
                    ventanaEliminarImagen = Swal.fire({
                    html: contenido,
                    showConfirmButton: false,
                    footer: botones
                });
            }
        }
    });
}


function cargarModalEditarUsuario(){
    document.getElementById("modalEditarUsuario").outerHTML = `
    <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <span class="input-group-text">Usuario:</span>
                        <input type="text" class="form-control bg-white text-end" placeholder="Usuario" id="usuarioEditarAdmin" readonly>
                    </div>
                    <label for="usuarioFotoPerfilAdmin" class="form-label">Editar correo:</label>
                    <div class="input-group has-validation mb-3">
                        <input type="email" class="form-control" placeholder="Correo" id="usuarioCorreoEditarAdmin">
                        <button class="btn btn-primary" id="btn-guardarCorreoEditarAdmin">Modificar</button>
                        <div class="invalid-feedback" id="cartelErrorEditarCorreoAdmin">Nande vayo</div>
                    </div>
                    <label for="usuarioPaisEditarAdmin" class="form-label">Editar Pais:</label>
                    <div class="input-group mb-3">
                        <select class="form-select" id="usuarioPaisEditarAdmin"></select>
                        <button class="btn btn-primary" id="btn-guardarPaisEditarAdmin">Modificar</button>
                    </div>
                    <!--
                    <label for="usuarioContraEditarAdmin" class="form-label">Editar contraseña:</label>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control" placeholder="Password" id="usuarioContraEditarAdmin">
                        <button class="btn btn-primary" id="btn-reiniciarContraEditarAdmin">Reiniciar Contraseña</button>
                    </div>
                    -->
                    <label for="usuarioNivelEditarAdmin" class="form-label">Editar Nivel Usuario:</label>
                    <div class="input-group mb-3">
                        <select class="form-select" id="usuarioNivelEditarAdmin">
                            <option value="0">Usuario Bloqueado</option>
                            <option value="1">Usuario Normal</option>
                            <option value="2">Administrador</option>
                            <option value="3">Super Administrador</option>
                        </select>
                        <button class="btn btn-primary" id="btn-guardarNivelEditarAdmin" disabled>Modificar</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    selectPaisEditarUsuario();
    myModalEditarUsuario = new bootstrap.Modal(document.getElementById('modalEditarUsuario'),{});

    $("#btn-guardarCorreoEditarAdmin").on("click",function(){
        let correo = $("#usuarioCorreoEditarAdmin").val();
        if(correo!=""){
            let regEmail = /^\w+(\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(!regEmail.test(correo)){
                cartelInput("usuarioCorreoEditarAdmin",false,"cartelErrorEditarCorreoAdmin","Correo no valido");
            }
            else{
                var datos = {
                    correo: correo
                }
                $.ajax({
                    url: "../PHP/verificacionDeCorreo.php",
                    type: "POST",
                    data: datos,
                    success: function(respuesta){
                        var resp = JSON.parse(respuesta);
                        if(resp.error){
                            myModalEditarUsuario.hide();
                            cartelNotificacion(resp.mensaje)
                            console.log(resp.descripcion);
                        }
                        else{
                            if(resp.numero){
                                cartelInput("usuarioCorreoEditarAdmin",false,"cartelErrorEditarCorreoAdmin","Correo ya existente");
                            }
                            else{
                                editarCorreo(correo);
                            }
                        }
                    }
                });
            }
        }
        else{
            cartelInput("usuarioCorreoEditarAdmin",false,"cartelErrorEditarCorreoAdmin","El campo esta vacio");
        }
    });
    $("#usuarioCorreoEditarAdmin").on("keyup",function(){
        limpiarInput('usuarioCorreoEditarAdmin');
        $("#btn-guardarCorreoEditarAdmin").prop('disabled',false);
    });
    $("#btn-guardarPaisEditarAdmin").on("click",function(){
        editarPais();
    });
    $("#usuarioPaisEditarAdmin").on("change",function(){
        $("#btn-guardarPaisEditarAdmin").prop('disabled',false);
    });
    /*
    $("#btn-reiniciarContraEditarAdmin").on("click",function(){
        reiniciarContra();
    });
    */
    $("#btn-guardarNivelEditarAdmin").on("click",function(){
        editarNivel();
    });
    $("#usuarioNivelEditarAdmin").on("change",function(){
        $("#btn-guardarNivelEditarAdmin").prop('disabled',false);
    });
}



$(document).on('click','.editar-usuario',function(){
    let elemento = $(this)[0].parentElement.parentElement;
    let usuario = $(elemento).attr('idUsuario');
    console.log(usuario);
    var datos = {
        usuario: usuario
    }
    $.ajax({
        url: "../PHP/cargarUsuario.php",
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
                $("#usuarioEditarAdmin").val(usuario);
                $("#usuarioCorreoEditarAdmin").val(resp.datoUsuario.correo);
                $("#usuarioPaisEditarAdmin").val(resp.datoUsuario.idPais);
                $("#usuarioNivelEditarAdmin").val(resp.datoUsuario.nivel);
                $("#usuarioContraEditarAdmin").val("contrasena");
                $("#btn-guardarNivelEditarAdmin").prop('disabled',true);
                $("#btn-guardarPaisEditarAdmin").prop('disabled',true);
                $("#btn-guardarCorreoEditarAdmin").prop('disabled',true);
                $("#btn-reiniciarContraEditarAdmin").prop('disabled',false);
                limpiarInput('usuarioCorreoEditarAdmin');
                myModalEditarUsuario.show();
            }
        }
    });
});

function selectPaisEditarUsuario(){
    $.ajax({
        url: "../PHP/cargarPaises.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion)
            }
            let template = "";
            resp.lista.forEach(pais => {
                template += `<option value="${pais.id}">${pais.nombre}</option>`;
            });
            $("#usuarioPaisEditarAdmin").html(template);
        }
    });
}

function editarCorreo(correo){
    var datos = {
        correo: correo,
        usuario: $("#usuarioEditarAdmin").val(),
        metodo: "correo"
    }
    $.ajax({
        url: "../PHP/editarUsuario.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalEditarUsuario.hide();
            }
            else{
                let contenido = '';
                if(resp.editar){
                    contenido += `
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="bi bi-check-circle m-2 text-success" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-0">Se ha modificado el correo con éxito</p>
                            </div>
                        </div>
                    `;
                    $("#usuarioCorreoEditarAdmin").val(correo);
                    $("#btn-guardarCorreoEditarAdmin").prop('disabled',true);
                    tableUsuarios.ajax.reload(null, false);
                }
                else{
                    contenido += `
                        <div class="d-flex align-items-center justify-content-between">
                        <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-0">Solo puede modificar los datos de usuarios con un nivel más bajo al suyo</p>
                            </div>
                        </div>
                    `;
                }
                let botones = `
                    <div class="d-flex w-100">
                        <button type="button" class="btn btn-secondary ms-auto" onclick="Swal.close(ventanaEliminarImagen);">Cerrar</button>
                    </div>
                    `;
                    ventanaEliminarImagen = Swal.fire({
                    html: contenido,
                    showConfirmButton: false,
                    footer: botones
                });
            }
        }
    });
}

function editarPais(){
    var datos = {
        pais: $("#usuarioPaisEditarAdmin").val(),
        usuario: $("#usuarioEditarAdmin").val(),
        metodo: "pais"
    }
    $.ajax({
        url: "../PHP/editarUsuario.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalEditarUsuario.hide();
            }
            else{
                let contenido = '';
                if(resp.editar){
                    contenido += `
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="bi bi-check-circle m-2 text-success" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-0">Se ha modificado el pais con éxito</p>
                            </div>
                        </div>
                    `;
                    $("#usuarioPaisEditarAdmin").val(datos.pais);
                    $("#btn-guardarPaisEditarAdmin").prop('disabled',true);
                    tableUsuarios.ajax.reload(null, false);
                }
                else{
                    contenido += `
                        <div class="d-flex align-items-center justify-content-between">
                        <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-0">Solo puede modificar los datos de usuarios con un nivel más bajo al suyo</p>
                            </div>
                        </div>
                    `;
                }
                let botones = `
                    <div class="d-flex w-100">
                        <button type="button" class="btn btn-secondary ms-auto" onclick="Swal.close(ventanaEliminarImagen);">Cerrar</button>
                    </div>
                    `;
                    ventanaEliminarImagen = Swal.fire({
                    html: contenido,
                    showConfirmButton: false,
                    footer: botones
                });
            }
        }
    });
}

function editarNivel(){
    var datos = {
        nivel: $("#usuarioNivelEditarAdmin").val(),
        usuario: $("#usuarioEditarAdmin").val(),
        metodo: "nivel"
    }
    $.ajax({
        url: "../PHP/editarUsuario.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalEditarUsuario.hide();
            }
            else{
                let contenido = '';
                if(resp.editar){
                    if(resp.mensaje){
                        contenido += `
                            <div class="d-flex align-items-center justify-content-between">
                                <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                                <div>
                                    <p class="mb-0">Solo el Super administrador puede modificar estos datos</p>
                                </div>
                            </div>
                        `;
                    }
                    else{
                        contenido += `
                            <div class="d-flex align-items-center justify-content-between">
                                <i class="bi bi-check-circle m-2 text-success" style="font-size: 2rem;"></i>
                                <div>
                                    <p class="mb-0">Se ha modificado el nivel con éxito</p>
                                </div>
                            </div>
                        `;
                        $("#usuarioNivelEditarAdmin").val(datos.nivel);
                        $("#btn-guardarNivelEditarAdmin").prop('disabled',true);
                        tableUsuarios.ajax.reload(null, false);
                    }
                    
                }
                else{
                    contenido += `
                        <div class="d-flex align-items-center justify-content-between">
                            <i class="bi bi-exclamation-circle m-2 text-danger" style="font-size: 2rem;"></i>
                            <div>
                                <p class="mb-0">Solo puede modificar los datos de usuarios con un nivel más bajo al suyo</p>
                            </div>
                        </div>
                    `;
                }
                let botones = `
                    <div class="d-flex w-100">
                        <button type="button" class="btn btn-secondary ms-auto" onclick="Swal.close(ventanaEliminarImagen);">Cerrar</button>
                    </div>
                    `;
                    ventanaEliminarImagen = Swal.fire({
                    html: contenido,
                    showConfirmButton: false,
                    footer: botones
                });
            }
        }
    });
}

function cargarSelectRegistroIndice(total){
    let maximo = parseFloat(total/filaCuentaCantidad);
    let seleccionar = parseInt(filaCuentaInicio/filaCuentaCantidad);
    let template = "";
    for(let i=0;i<maximo;i++){  
        if(seleccionar == i) template += "<option value = '"+parseInt(i)+"' selected>"+parseInt(i+1)+"</option>";
        else template += "<option value = '"+parseInt(i)+"'>"+parseInt(i+1)+"</option>";
    }
    document.getElementById("selectRegistroIndice").innerHTML = template;
}

