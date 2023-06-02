var myModalInicioSesion;
var myModalRegistro;
var myModalActivacion;
var myModalRecuperarClave;
var bandUsuario = false;
var bandPass = false;
var bandPass2 = false;
var bandEmail = false;
var bandPais = false;
var tiempoCorreoEnvio;
var pasosRecuperarClave = 0;

$(document).ready(function(){
    cargarDatosSesion();
    /*Cargar modales*/
    cargarModalSesion();
    cargarModalRegistro();
    cargarModalActivacion();
    cargarModalRecuperarClave();
    if(document.getElementById("pais")){
        desplegarPaises();
        document.getElementById("pais").addEventListener("change",function(){
            controlPais();
        }); 
    }
    if(document.getElementById("usuarioSesion") && document.getElementById("passSesion")){
        document.getElementById("usuarioSesion").addEventListener("keyup",function(){
            document.getElementById("usuarioSesion").classList.remove("is-invalid");
            document.getElementById("passSesion").classList.remove("is-invalid");
        });
        document.getElementById("passSesion").addEventListener("keyup",function(){
            document.getElementById("usuarioSesion").classList.remove("is-invalid");
            document.getElementById("passSesion").classList.remove("is-invalid");
        });
    }
    if(document.getElementById("usuario")){
        document.getElementById("usuario").addEventListener("keyup",function(){
            document.getElementById("usuario").classList.remove("is-invalid");
            document.getElementById("usuario").classList.remove("is-valid");
        });
    }
    if(document.getElementById("pass")){
        document.getElementById("pass").addEventListener("keyup",function(){
            document.getElementById("pass").classList.remove("is-invalid");
            document.getElementById("pass").classList.remove("is-valid");
        });
    }
    if(document.getElementById("pass2")){
        document.getElementById("pass2").addEventListener("keyup",function(){
            document.getElementById("pass2").classList.remove("is-invalid");
            document.getElementById("pass2").classList.remove("is-valid");
        });
    }
    if(document.getElementById("correo")){
        document.getElementById("correo").addEventListener("keyup",function(){
            document.getElementById("correo").classList.remove("is-invalid");
            document.getElementById("correo").classList.remove("is-valid");
        });
    }
    if(document.getElementById("enviarCorreoDeNuevo")){
        document.getElementById("enviarCorreoDeNuevo").addEventListener("click",function(){
            if(!document.getElementById("enviarCorreoDeNuevo").disabled){
                document.getElementById("enviarCorreoDeNuevo").disabled = true;
                enviarCorreoActivacion();
                document.getElementById("tiempoDePausa").innerHTML = "60";
                tiempoCorreoEnvio = setInterval(function(){
                    let seg = parseInt(document.getElementById("tiempoDePausa").innerHTML);
                    if(seg > 0){
                        seg--;
                        document.getElementById("tiempoDePausa").innerHTML = seg;
                    }
                    else{
                        document.getElementById("enviarCorreoDeNuevo").disabled = false;
                        document.getElementById("tiempoDePausa").innerHTML = "";
                        clearInterval(tiempoCorreoEnvio);
                    }
                },1000);
            }
        });
    }
    if(document.getElementById("confirmarActivacion")){
        document.getElementById("confirmarActivacion").addEventListener("click",function(){
            confirmarClaveActivacion();
        });
    }
    if(document.getElementById("claveActivacion")){
        document.getElementById("claveActivacion").addEventListener("keyup",function(){
            document.getElementById("claveActivacion").classList.remove("is-invalid");
        }); 
    }
    if(document.getElementById("recuperarContraModal")){
        document.getElementById("recuperarContraModal").addEventListener("click",function(){
            myModalInicioSesion.hide();
            myModalRecuperarClave.show();
            pasosRecuperarClave = 0;
            document.getElementById("siguientePasoRecuperarClave").innerHTML = `
            <div class="modal-body" id="siguientePasoRecuperarClave">
                <label for="usuario" class="form-label">Ingrese su usuario:</label>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Usuario" id="usuarioRecuperarClave" onkeyup="limpiarInput('usuarioRecuperarClave');">
                    <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/userNuevo2.png" width="20" height="20"></span>
                    <div class="invalid-feedback text-center" id="cartelErrorRecuperarContra"></div>
                </div>
            </div>
            `;
        });
    }
    if(document.getElementById("usuarioRecuperarClave")){
        document.getElementById("usuarioRecuperarClave").addEventListener("keyup",function(){
            document.getElementById("usuarioRecuperarClave").classList.remove("is-invalid");
        });
    }
});

function cargarModalSesion(){
    document.getElementById("modalSesion").outerHTML = `
        <div class="modal fade" id="modalIniciarSesion" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Iniciar Sesión</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="usuarioSesion" class="form-label">Usuario:</label>
                        <div class="input-group mb-3">
                            <input type="email" class="form-control" id="usuarioSesion" placeholder="Usuario">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-person-fill"></i></span>
                        </div>
                        <label for="passSesion" class="form-label">Contraseña:</label>
                        <div class="input-group has-validation mb-3">
                            <input type="password" class="form-control" id="passSesion" placeholder="Contraseña">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                            <div class="invalid-feedback text-center" id="cartelInicioSesion"></div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between" >
                        <a class="link-primary fw-bold text-decoration-none" style="cursor: pointer" id="recuperarContraModal">Olvide mi contraseña</a>
                        <button type="button" class="btn btn-primary px-3" onclick="iniciarSesion();">Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    myModalInicioSesion = new bootstrap.Modal(document.getElementById('modalIniciarSesion'),{});
}

function cargarModalRegistro(){
    document.getElementById("modalRegistro").outerHTML = `
    <div class="modal fade" id="modalRegistro" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Registrarse</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="registroDeUsuarios">
                        <label for="usuario" class="form-label">Usuario:</label>
                        <div class="input-group has-validation mb-3">
                            <input type="text" class="form-control" placeholder="Usuario" aria-label="Usuario" aria-describedby="basic-addon1" id="usuario" onblur="controlUsuario();">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-person-fill"></i></span>
                            <div class="invalid-feedback" id="errorMensajeUsuario"></div>
                        </div>
                        <label for="pass" class="form-label">Contraseña:</label>
                        <div class="input-group has-validation mb-3">
                            <input type="password" class="form-control" placeholder="Contraseña" aria-label="Usuario" aria-describedby="basic-addon1" id="pass" onblur="controlPass();">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                            <div class="invalid-feedback" id="errorMensajePass"></div>
                        </div>
                        <label for="pass2" class="form-label">Repetir contraseña:</label>
                        <div class="input-group has-validation mb-3">
                            <input type="password" class="form-control" placeholder="Repetir contraseña" aria-label="Usuario" aria-describedby="basic-addon1" id="pass2" onblur="controlPass2();">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-key-fill"></i></span>
                            <div class="invalid-feedback" id="errorMensajePass2"></div>
                        </div>
                        <label for="correo" class="form-label">Correo electrónico:</label>
                        <div class="input-group has-validation mb-3">
                            <input type="email" class="form-control" placeholder="correo@example.com" aria-label="Usuario" aria-describedby="basic-addon1" id="correo" onblur="controlEmail();">
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-envelope-fill"></i></span>
                            <div class="invalid-feedback" id="errorMensajeEmail"></div>
                        </div>
                        <label for="pais" class="form-label">País:</label>
                        <div class="input-group  has-validation mb-3">
                            <select class="form-select" aria-label="Default select example" id="pais"></select>
                            <span class="input-group-text" id="basic-addon1"><i class="bi bi-globe2"></i></span>
                            <div class="invalid-feedback" id="errorMensajePais"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" onclick="limpiarDatos();">Limpiar</button>
                    <button type="button" class="btn btn-primary" onclick="registrarDatos();" id="boton-registrarse">Registrarse</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'),{});
}

function cargarModalActivacion(){
    document.getElementById("modalActivacion").outerHTML = `
        <div class="modal fade" id="modalActivarCuenta" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Activar cuenta</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Copie y pegue el codigo que fue enviado a su correo</p>
                        <div class="input-group mb-3">
                            <span class="input-group-text">Codigo:</span>
                            <input type="text" class="form-control" placeholder="5fab757f97616c1fee3b6d0ee368b464de029230" id="claveActivacion">
                            <div class="invalid-feedback text-center" id="cartelErrorActivacion"></div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" id="enviarCorreoDeNuevo">Enviar de nuevo <span id="tiempoDePausa"></span></button>
                        <button type="button" class="btn btn-primary" id="confirmarActivacion">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    myModalActivacion = new bootstrap.Modal(document.getElementById('modalActivarCuenta'),{});
}

function cargarModalRecuperarClave(){
    document.getElementById("modalRecuperarContra").outerHTML = `
    <div class="modal fade" id="modalRecuperarClave" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Recuperar contraseña</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="siguientePasoRecuperarClave">
                    <label for="usuario" class="form-label">Ingrese su usuario:</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Usuario" id="usuarioRecuperarClave">
                        <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/userNuevo2.png" width="20" height="20"></span>
                        <div class="invalid-feedback text-center" id="cartelErrorRecuperarContra"></div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="verificarUsuarioExistente();">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    myModalRecuperarClave = new bootstrap.Modal(document.getElementById('modalRecuperarClave'),{});
}

function limpiarDatos(){
    document.getElementById("registroDeUsuarios").reset();
    document.getElementById("usuario").classList.remove("is-valid","is-invalid");
    document.getElementById("pass").classList.remove("is-valid","is-invalid");
    document.getElementById("pass2").classList.remove("is-valid","is-invalid");
    document.getElementById("correo").classList.remove("is-valid","is-invalid");
    document.getElementById("pais").classList.remove("is-valid","is-invalid");
}

function registrarDatos(){
    var datos = {
        usuario : document.getElementById("usuario").value,
        pass : document.getElementById("pass").value,
        correo: document.getElementById("correo").value,
        pais: document.getElementById("pais").value
    };
    if(correccionDatos()){
        let html = `
            <div class="d-flex align-items-center">
                <span class="me-1">Registrando... </span>
                <div class="spinner-border spinner-border-sm ml-auto" role="status" aria-hidden="true"></div>
            </div>
        `;
        $("#boton-registrarse").html(html);
        $("#boton-registrarse").prop('disabled',true);
        $.ajax({
            type:"POST",
            url:"../PHP/insertar.php",
            data: datos,
            success:function(respuesta){
                var resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                }
                else{
                    $("#boton-registrarse").prop('disabled',false);
                    $("#boton-registrarse").html("Registrarse");
                    envioCorreoRegistro();
                    location.reload();
                }
            }
        });
    }
}

function controlUsuario(){
    if(document.getElementById("usuario").value!=""){
        var validacionUsuario = document.getElementById("usuario").value;
        if(validacionUsuario.length<4 || validacionUsuario.length>20){
            cartelInput("usuario",false,"errorMensajeUsuario","Como minimo 4 caracteres y como maximo 20");
        }
        else{
            let regexUsuario = /^[a-z][a-z]+\d*$/i;
            if(!regexUsuario.test(validacionUsuario)){
                cartelInput("usuario",false,"errorMensajeUsuario","El usuario debe ser una combinacion de letras y numeros, los numeros solo pueden ir al final");
            }
            else{
                var datos = {
                    usuario: validacionUsuario
                }
                $.ajax({
                    url: "../PHP/verificacionDeUsuario.php",
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
                                cartelInput("usuario",false,"errorMensajeUsuario","Usuario ya existente");
                            }
                            else{
                                bandUsuario = true;
                                cartelInput("usuario",true,"errorMensajeUsuario","");
                            }
                        }
                    }
                });
            }
        }
    }
    else{
        cartelInput("usuario",false,"errorMensajeUsuario","El campo esta vacio");
    }
}

function controlPass(){
    if(document.getElementById("pass").value!=""){
        var validacionPass = document.getElementById("pass").value;
        if(validacionPass.length < 6 || validacionPass.length > 30){
            cartelInput("pass",false,"errorMensajePass","Debe tener como minimo 6 caracteres y como maximo 30");
        }
        else{
            bandPass = true;
            cartelInput("pass",true,"errorMensajePass","");
        }
    }
    else{
        cartelInput("pass",false,"errorMensajePass","El campo esta vacio");
    }
}


function controlPass2(){
    if(document.getElementById("pass2").value!=""){
        var validacionPass2 = document.getElementById("pass2").value;
        var validacionPass = document.getElementById("pass").value;
        if(validacionPass2 != validacionPass){
            cartelInput("pass2",false,"errorMensajePass2","Las contraseñas no coinciden");
        }
        else{
            bandPass2 = true;
            cartelInput("pass2",true,"errorMensajePass2","");
        }
    }
    else{
        cartelInput("pass2",false,"errorMensajePass2","El campo esta vacio");
    }
}



function controlEmail(){
    if(document.getElementById("correo").value!=""){
        let regEmail = /^\w+(\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var validacionCorreo = document.getElementById("correo").value;
        if(!regEmail.test(validacionCorreo)){
            cartelInput("correo",false,"errorMensajeEmail","El formato ingresado no es correcto");
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
                            cartelInput("correo",false,"errorMensajeEmail","Correo ya existente");
                        }
                        else{
                            bandEmail = true;
                            cartelInput("correo",true,"errorMensajeEmail","");
                        }
                    }
                }
            });
        }
    }
    else{
        cartelInput("correo",false,"errorMensajeEmail","No dejar el campo vacio");
    }
}

function controlPais(){
    document.getElementById("pais").classList.remove("is-valid");
    document.getElementById("pais").classList.remove("is-invalid");
    if(parseInt(document.getElementById("pais").value)){
        document.getElementById("pais").classList.add("is-valid");
        bandPais = true;
    }
    else{
        document.getElementById("pais").classList.add("is-invalid");
    }
}

function correccionDatos(){
    controlUsuario();
    controlPass();
    controlPass2();
    controlEmail();
    controlPais();
    return (bandUsuario && bandPass && bandEmail && bandPais);
}

function iniciarSesion(){
    if(document.getElementById("usuarioSesion").value == "" || document.getElementById("passSesion").value == ""){
        document.getElementById("cartelInicioSesion").innerHTML = "Debe completar los dos campos";
        document.getElementById("usuarioSesion").classList.add("is-invalid");
        document.getElementById("passSesion").classList.add("is-invalid");
    }
    else{
        var datos = {
            usuario : document.getElementById("usuarioSesion").value,
            pass : document.getElementById("passSesion").value
        };
        $.ajax({
            url: "../PHP/inicioDeSession.php",
            data: datos, 
            type: "POST",
            success: function(respuesta){
                var resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                    myModalInicioSesion.hide();
                }
                if(resp.estado){
                    myModalInicioSesion.hide();
                    location.reload();
                }
                else{
                    document.getElementById("cartelInicioSesion").innerHTML = "Usuario y/o contraseña incorrecta";
                    document.getElementById("usuarioSesion").classList.add("is-invalid");
                    document.getElementById("passSesion").classList.add("is-invalid");
                }
            }
        });
    }
}

function desplegarPaises(){
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
                let template = "<option value='0' selected>Seleccione nacionalidad</option>";
                resp.lista.forEach(pais => {
                    template += `<option value="${pais.id}">${pais.nombre}</option>`;
                });
                document.getElementById("pais").innerHTML = template;
            }
            
        }
    });
}

function enviarCorreoActivacion(){
    $.ajax({
        async: true,
        url: "../PHP/enviarCorreoActivacion.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                myModalActivacion.hide();
            }
        }
    });
}

function confirmarClaveActivacion(){
    var datos = {
        hash: document.getElementById("claveActivacion").value
    };
    if(datos.hash != ""){
        $.ajax({
            url: "../PHP/activarCuenta.php",
            type: "POST",
            data: datos,
            success: function(respuesta){
                console.log(respuesta);
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                    myModalActivacion.hide();
                }
                else{
                    if(resp.estado){
                        myModalActivacion.hide();
                        location.reload();
                    }
                    else{
                        document.getElementById("cartelErrorActivacion").innerHTML = "El codigo ingresado no es valido";
                        document.getElementById("claveActivacion").classList.add("is-invalid");
                    }
                }
            }
        });
    }
    else{
        document.getElementById("cartelErrorActivacion").innerHTML = "El campo esta vacio";
        document.getElementById("claveActivacion").classList.add("is-invalid");
    }
}

function envioCorreoRegistro(){
    $.ajax({
        async: true,
        url: "../PHP/enviarCorreoRegistro.php",
        type: "GET",
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
        }
    });
}

function verificarUsuarioExistente(){
    console.log(pasosRecuperarClave);
    switch(pasosRecuperarClave){
        case 0: /* PASO 1 */
                var datos = {
                    usuario : document.getElementById("usuarioRecuperarClave").value
                };
                if(datos.usuario != ""){
                    $.ajax({
                        url: "../PHP/verificacionDeUsuario.php",
                        type: "POST",
                        data: datos,
                        success: function(respuesta){
                            let resp = JSON.parse(respuesta);
                            if(resp.error){
                                cartelNotificacion(resp.mensaje);
                                console.log(resp.descripcion);
                                myModalRecuperarClave.hide();
                            }
                            else{
                                if(resp.numero){
                                    document.getElementById("siguientePasoRecuperarClave").innerHTML = `
                                        <label for="usuario" class="form-label">Ingrese el codigo que fue enviado a su correo:</label>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control" placeholder="Codigo" id="usuarioRecuperarClave" onkeyup="limpiarInput('usuarioRecuperarClave');">
                                            <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/letraynumero.png" width="20" height="20"></span>
                                            <div class="invalid-feedback text-center" id="cartelErrorRecuperarContra"></div>
                                        </div>
                                    `;
                                    pasosRecuperarClave++;
                                    enviarCorreoRecuperarClave(datos.usuario);
                                }
                                else{   
                                    document.getElementById("cartelErrorRecuperarContra").innerHTML = "El usuario ingresado no existe";
                                    document.getElementById("usuarioRecuperarClave").classList.add("is-invalid");
                                }
                            }
                        }
                    });
                }
                else{
                    document.getElementById("cartelErrorRecuperarContra").innerHTML = "El campo esta vacio";
                    document.getElementById("usuarioRecuperarClave").classList.add("is-invalid");
                }
                break;
        case 1: /* PASO 2 */
                var datos = {
                    clave : document.getElementById("usuarioRecuperarClave").value
                };
                if(datos.clave != ""){
                    $.ajax({
                        url: "../PHP/comprobacion.php",
                        type: "POST",
                        data: datos,
                        success: function(respuesta){
                            let resp = JSON.parse(respuesta);
                            if(resp.error){
                                cartelNotificacion(resp.mensaje);
                                console.log(resp.descripcion);
                                myModalRecuperarClave.hide();
                                pasosRecuperarClave = 0;
                            }
                            else{
                                if(resp.estado){
                                    document.getElementById("siguientePasoRecuperarClave").innerHTML = `
                                        <label for="usuario" class="form-label">Ingrese contraseña nueva:</label>
                                        <div class="input-group mb-3">
                                            <input type="password" class="form-control" placeholder="Contraseña" id="passNueva" onblur="controlPassNueva();" onkeyup="limpiarInput('passNueva');">
                                            <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/lock.png" width="20" height="20"></span>
                                            <div class="invalid-feedback text-center" id="cartelErrorPassNueva"></div>
                                        </div>
                                        <label for="usuario" class="form-label">Repita la contraseña nueva:</label>
                                        <div class="input-group mb-3">
                                            <input type="password" class="form-control" placeholder="Repetir contraseña" id="pass2Nueva" onblur="controlPass2Nueva();" onkeyup="limpiarInput('pass2Nueva');">
                                            <span class="input-group-text" id="basic-addon1"><img src="../Imagenes/lock.png" width="20" height="20"></span>
                                            <div class="invalid-feedback text-center" id="cartelErrorPassNueva2"></div>
                                        </div>
                                    `;
                                    pasosRecuperarClave++;
                                }
                                else{   
                                    document.getElementById("cartelErrorRecuperarContra").innerHTML = "El codigo ingresado no es correcto";
                                    document.getElementById("usuarioRecuperarClave").classList.add("is-invalid");
                                }
                            }
                        }
                    });
                }
                else{
                    document.getElementById("cartelErrorRecuperarContra").innerHTML = "El campo esta vacio";
                    document.getElementById("usuarioRecuperarClave").classList.add("is-invalid");
                }
                break;
        case 2: /* PASO 3 */
                if(controlPassNueva() && controlPass2Nueva()){
                    datos = {
                        contra: document.getElementById("passNueva").value
                    };
                    $.ajax({
                        url: "../PHP/modificarContra.php",
                        type: "POST",
                        data: datos,
                        success: function(respuesta){
                            console.log(respuesta);
                            let resp = JSON.parse(respuesta);
                            if(resp.error){
                                cartelNotificacion(resp.mensaje);
                                console.log(resp.descripcion);
                            }
                            else{
                                cartelNotificacion("Se modifico la contraseña");
                            }
                            myModalRecuperarClave.hide();
                            pasosRecuperarClave = 0;
                        }
                    });
                }
                break;
    }
    
}

function enviarCorreoRecuperarClave(usuario){
    var datos = {
        usuario: usuario
    };
    $.ajax({
        url: "../PHP/enviarCorreoRecuperarClave.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
                myModalRecuperarClave.hide();
                pasosRecuperarClave = 0;
            }
        }
    });
}

function controlPassNueva(){
    if(document.getElementById("passNueva").value!=""){
        var validacionPass = document.getElementById("passNueva").value;
        if(validacionPass.length < 6 || validacionPass.length > 30){
            cartelInput("passNueva",false,"cartelErrorPassNueva","Debe tener como minimo 6 caracteres y como maximo 30");
        }
        else{
            cartelInput("passNueva",true,"cartelErrorPassNueva","");
            return true;
        }
    }
    else{
        cartelInput("passNueva",false,"cartelErrorPassNueva","El campo esta vacio");
    }
    return false;
}


function controlPass2Nueva(){
    if(document.getElementById("pass2Nueva").value!=""){
        var validacionPass2 = document.getElementById("pass2Nueva").value;
        var validacionPass = document.getElementById("passNueva").value;
        if(validacionPass2 != validacionPass){
            cartelInput("pass2Nueva",false,"cartelErrorPassNueva2","Las contraseñas no coinciden");
        }
        else{
            cartelInput("pass2Nueva",true,"cartelErrorPassNueva2","");
            return true;
        }
    }
    else{
        cartelInput("pass2Nueva",false,"cartelErrorPassNueva2","El campo esta vacio");
    }
    return false;
}

