
const letras = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const letrasMinusculas = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function cartelEstadoTorneo(estado){
    switch(estado){
        case 0: return "Inicia en";
        case 1: return "Termina en";
        case 2: return "Finalizado";
    }
}

$(document).ready(function(){
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    })
});

function tiempoRestanteTorneo(segundos){
    if(segundos > 0){
        if(segundos < 86400){  // Hora:Minutos:Segundos
            let seg = segundos % 60;
            let minutos = parseInt(segundos/60); minutos %= 60;
            let horas = parseInt(segundos/(60*60));
            return ((horas<10) ? '0'+horas : horas )+':'+ ((minutos<10) ? '0'+minutos : minutos) + ':' + ((seg<10) ? '0'+seg : seg);
        }
        else{
            if(segundos < 604800){ // Dias
                let dias = parseInt(segundos/(60*60*24));
                return (dias == 1) ? dias + ' Dia' : dias + ' Dias';
            }
            else{
                if(segundos < 2592000){ // Semana
                    let semana = parseInt(segundos/(60*60*24*7));
                    return (semana == 1) ? semana + ' Semana' : semana + ' Semanas';
                }
                else{
                    if(segundos < 31536000){ // Mes
                        let meses = parseInt(segundos/(60*60*24*30));
                        return (meses == 1) ? meses + ' Mes' : meses + ' Meses';
                    }
                    else{
                        let anios = parseInt(segundos/(60*60*24*365));
                        return (anios == 1) ? anios + ' Año' : anios + ' Años'; 
                    }
                }
            }
        }
    }
    return "";
}

function conversionSegundos(time){
    let data = time.split(":");
    return (parseInt(data[0])*60*60+parseInt(data[1])*60+parseInt(data[2]));
}

function cartelNotificacion(mensaje){
    let notificacion = `
        <div class="toast align-items-center text-white bg-dark role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    $("#notificaciones").append(notificacion);
    let toast = new bootstrap.Toast($("#notificaciones .toast:last")[0])
    toast.show();
}

function cartelInput(id,valido,idMensaje,mensaje){
    var elemento = document.getElementById(id);
    var elementoMensaje = document.getElementById(idMensaje);
    elemento.classList.remove("is-valid");
    elemento.classList.remove("is-invalid");
    elementoMensaje.innerHTML = mensaje;
    if(valido){
        elemento.classList.add("is-valid");
    }
    else{
        elemento.classList.add("is-invalid");
    }
}

function mostrarTiempoRestanteMasDetalle(segundos){
    let resultado = [];
    if(segundos >= 0){
        let aux = segundos;
        if(aux >= 31536000){
            let anios = parseInt(aux/(60*60*24*365));
            aux %= (60*60*24*365);
            resultado.push((anios == 1) ? anios + ' Año ' : anios + ' Años ');
        }
        if(aux >= 2592000){
            let meses = parseInt(aux/(60*60*24*30));
            aux %= (60*60*24*30);
            resultado.push()
            resultado.push((meses == 1) ? meses + ' Mes ' : meses + ' Meses ');
        }
        if(aux >= 604800){
            let semana = parseInt(aux/(60*60*24*7));
            aux %= (60*60*24*7);
            resultado.push((semana == 1) ? semana + ' Semana ' : semana + ' Semanas ');
        }
        if(aux >= 86400){
            let dias = parseInt(aux/(60*60*24));
            aux %= (60*60*24);
            resultado.push((dias == 1) ? dias + ' Dia ' : dias + ' Dias ');
        }
        let seg = segundos % 60;
        let minutos = parseInt(segundos/60); minutos %= 60;
        let horas = parseInt(segundos/(60*60)); horas %= 24;
        resultado.push(((horas<10) ? '0'+horas : horas )+':'+ ((minutos<10) ? '0'+minutos : minutos) + ':' + ((seg<10) ? '0'+seg : seg));
    }
    return resultado;
}

function limpiarInput(elementoID){
    $("#"+elementoID).removeClass("is-invalid");
    $("#"+elementoID).removeClass("is-valid");
}

function cargarDatosSesion(){
    $.ajax({
        url: "../PHP/session.php",
        type: "GET",
        success: function(respuesta){
            if(respuesta == "no"){
                if(document.getElementById("inicioSessionCaja")){
                    document.getElementById("inicioSessionCaja").innerHTML = `
                        <div class="text-end">
                            <button type="button" class="btn btn-outline-light me-2" id="session" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Iniciar Sesión</button>
                            <button type="button" class="btn btn-warning" id="registrar" data-bs-toggle="modal" data-bs-target="#modalRegistro">Registrarse</button> 
                        </div>
                    `;
                }
            }
            else{
                let resp = JSON.parse(respuesta);
                if(resp.error){
                    cartelNotificacion(resp.mensaje);
                    console.log(resp.descripcion);
                }
                else{
                    let linkAdmin = '';
                    let botonActivarCuenta = '';
                    if(parseInt(resp.nivel) > 1){
                        linkAdmin = '<li><a class="dropdown-item" href="administrador.html">Administración</a></li>';
                    }
                    if(!parseInt(resp.activo)){
                        botonActivarCuenta = '<div class="text-end"><button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Activar Cuenta</button></div>'
                    }
                    document.getElementById("inicioSessionCaja").innerHTML = `
                        <div class="dropdown me-2">
                            <a class="text-white text-decoration-none dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="${resp.rutaPerfil}" width="35" height="35" class="border-secondary rounded me-2" id="miniPerfilMenu">
                                <strong id="textoUsuario">${resp.usuario}</strong>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                <li><a class="dropdown-item" href="perfil.html?usuario=${resp.usuario}">Mi perfil</a></li>
                                ${linkAdmin}
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <a class="dropdown-item d-flex justify-content-between" href="#" onclick=cerrarSesion()>
                                        <span>Cerrar Sesión</span>
                                        <i class="bi bi-power text-end"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        ${botonActivarCuenta}
                    `;
                    if(resp.bievenido){
                        cartelNotificacion("Bievenido "+resp.usuario);
                    }
                    if(resp.activado){
                        cartelNotificacion("Su cuenta ha sido activada");
                    }
                }
                
            }
        }
    });
}

function controlFecha(fecha){
    let datos = fecha.split('-');
    if(datos.length != 3) return false;
    if(isNaN(datos[0]) || isNaN(datos[1] || isNaN(datos[2]))) return false;
    if(parseInt(datos[0])<=0 && parseInt(datos[0])>=32) return false;
    if(parseInt(datos[1])<=0 && parseInt(datos[1])>=13) return false;
    if(parseInt(datos[2])<=0) return false;
    return true;
}

function controlHora(hora){
    let datos = hora.split(':');
    if(datos.length != 3) return false;
    if(isNaN(datos[0]) || isNaN(datos[1] || isNaN(datos[2]))) return false;
    if(parseInt(datos[0])<0) return false;
    if(parseInt(datos[1])<0 && parseInt(datos[1])>60) return false;
    if(parseInt(datos[2])<0 && parseInt(datos[2])>60) return false;
    return true;
}

function cerrarSesion(){
    $.ajax({
        url: "../PHP/cerrarSession.php",
        type: "GET",
        success: function(){
            cargarDatosSesion();
            window.location = "index.html";
        }
    });
}
