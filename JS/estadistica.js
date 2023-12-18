var idTorneo = 0;
var arrayRespuestaEnvioTotal = {A: 0,CP: 0,EE: 0,EETE: 0,RI: 0,TLE: 0};
var arrayLenguajeEnvioTotal = {C: 0,CPLUS:0, PYTHON:0, JAVA: 0}
var arrayBarrasTiempos = [];
var arrayBarrasTiemposMaximo = 10;
var arrayLetrasProblemas = [];
var arrayProblemas = [];
var arrayBarrasPaises = [];
var tiempoFin;
var envios = [];
var problemas = [];
var participantes = [];
var torneo;
$(document).ready(function(){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    idTorneo = urlParams.get('idTorneo');
    obtenerTorneo();
});

function obtenerTorneo(){
    var datos = {
        idTorneo : idTorneo,
        metodo: "admin"
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
                torneo = resp.respuesta;
                obtenerEnvios();
            }
        }
    });
}

function obtenerEnvios(){
    var datos = {
        idTorneo : idTorneo,
        metodo: "admin"
    };
    $.ajax({
        url: "../PHP/cargarEnvios.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                envios = resp.data;
                obtenerProblemas();
            }
        }
    });
}

function obtenerProblemas(){
    var datos = {
        idTorneo : idTorneo,
        metodo: "lista"
    };
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
                problemas = resp.lista;
                obtenerInscriptos();
            }
        }
    });
}

function obtenerInscriptos(){
    var datos = {
        torneo: idTorneo
    }
    $.ajax({
        url: "../PHP/cargarInscripcionesTorneo.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                participantes = resp.respuesta;
                procesamientoDeDatosRespuesta("all");
                cargarBotonesProblemas();

                generarBarrasParaTiempo();
                generarProblemasParaTiempo();
                procesamientoDeDatosTiempoGeneral();
                procesamientoDeDatosTiempo("all");

                procesamientoDeDatosLenguaje("all");

                generarBarrasParaPaises();
                procesamientoDeDatosPaises('all');

                cargarDatosGenerales();
            }
        }
    });
}

function procesamientoDeDatosRespuesta(problema){
    resetearContadores();
    let contador = 0;
    let listaParticipantes = [];
    let contadorPorUsuario = {};
    participantes.forEach(usuario => { contadorPorUsuario[usuario.usuario] = 0 })

    envios.forEach(envio => {
        if (problema == "all" || problema == envio.problema) {
            switch (envio.respuesta) {
                case 'Aceptado':
                    arrayRespuestaEnvioTotal['A']++;
                    break;
                case 'Compilacion Fallida':
                    arrayRespuestaEnvioTotal['CP']++;
                    break;
                case 'Error en Tiempo de Ejecucion':
                    arrayRespuestaEnvioTotal['EETE']++;
                    break;
                case 'Respuesta Incorrecta':
                    arrayRespuestaEnvioTotal['RI']++;
                    break;
                case 'Tiempo Limite Excedido':
                    arrayRespuestaEnvioTotal['TLE']++;
                    break;
            }
            contador++;

            if (!listaParticipantes.includes(envio.usuario)) {
                listaParticipantes.push(envio.usuario);
            }

            contadorPorUsuario[envio.usuario]++;
        }
    });
    
    let maximo = 10
    for(const key in arrayRespuestaEnvioTotal){
        maximo = Math.max(maximo,arrayRespuestaEnvioTotal[key])
    }
    const barras = document.querySelectorAll('.respuestas .contenedor-barra');
    
    barras.forEach(barra => {
        const key = barra.dataset.respuesta;
        const porcentaje = (arrayRespuestaEnvioTotal[key] / maximo) * 100;
        const height = (porcentaje / 100) * 400;
        const contenido = barra.querySelector('.contenido-barra');
        contenido.style.height = height + 'px';
        const cantidad = barra.querySelector('.cantidad-contenedor');
        cantidad.style.bottom = (height + 5) + 'px';
        cantidad.innerHTML = arrayRespuestaEnvioTotal[key]
    })

    const total = document.querySelector(".total-respuesta");
    total.innerHTML = contador;

    const participacion = document.querySelector(".participacion-respuesta");
    participacion.innerHTML = Math.round((listaParticipantes.length/participantes.length) * 100) + ' %';

    const promedio = document.querySelector(".promedio-respuesta");
    promedio.innerHTML = contador / listaParticipantes.length;

    const respuestaA = document.querySelector(".respuesta-a");
    respuestaA.innerHTML = Math.round((arrayRespuestaEnvioTotal['A'] / contador) * 100)+" %";
    const respuestaI = document.querySelector(".respuesta-i");
    respuestaI.innerHTML = Math.round((arrayRespuestaEnvioTotal['RI'] / contador) * 100)+" %"
    const respuestaC = document.querySelector(".respuesta-c");
    respuestaC.innerHTML = Math.round((arrayRespuestaEnvioTotal['CP'] / contador) * 100)+" %"
    const respuestaE = document.querySelector(".respuesta-e");
    respuestaE.innerHTML = Math.round((arrayRespuestaEnvioTotal['EETE'] / contador) * 100)+" %"
    const respuestaT = document.querySelector(".respuesta-t");
    respuestaT.innerHTML = Math.round((arrayRespuestaEnvioTotal['TLE'] / contador) * 100)+" %"
}

function cargarBotonesProblemas(){
    const contenedorBotones = document.getElementById("cargar-botones-problemas");

    let template = `<button type="button" class="btn btn-primary me-2 mb-2 botones-respuestas" data-boton-respuesta="all">Todos</button>`;
    problemas.forEach(problema => {
        template += `<button type="button" class="btn btn-outline-primary me-2 mb-2 botones-respuestas" data-boton-respuesta="${problema.idProblema}">${problema.letra} - ${problema.titulo}</button>`
    })

    contenedorBotones.innerHTML = template;

    agregarFuncionesBotones();
}

function agregarFuncionesBotones(){
    const botones = document.querySelectorAll(".botones-respuestas");

    botones.forEach(e => {
        e.addEventListener("click",(e) => filtroBotonesRespuesta(e))
    })
}

function filtroBotonesRespuesta(event){
    const botones = document.querySelectorAll(".botones-respuestas");
    botones.forEach(element => {
        if(element.classList.contains("btn-primary")){
            element.classList.remove("btn-primary");
            element.classList.add("btn-outline-primary");
        }
    })

    event.target.classList.remove("btn-outline-primary");
    event.target.classList.add("btn-primary");

    procesamientoDeDatosRespuesta(event.target.getAttribute("data-boton-respuesta"));
}

function resetearContadores(){
    arrayRespuestaEnvioTotal = {A: 0,CP: 0,EE: 0,EETE: 0,RI: 0,TLE: 0};
}

function generarBarrasParaTiempo(){
    const [horas,minutos,segundos] = torneo.duracion.split(":").map(val => parseInt(val));
    let numeroDeBarras = horas * 6;
    numeroDeBarras += (minutos > 0) ? (minutos/10) + 1 : 0;
    const horasBarras = 6;

    const [horasInicio,minutosInicio,segundosInicio] = torneo.horaInicio.split(":");
    const [anioInicio,mesInicio,diaInicio] = torneo.fechaInicio.split("-");
    const fechaInicio = new Date(anioInicio, mesInicio - 1, diaInicio, horasInicio, minutosInicio, segundosInicio);
    let template = `
        <div class="contenedor-barra-punto ms-3">
            <span class="contenido-etiqueta">
                <i class="bi bi-flag"></i>
                Inicio
            </span>
            <span class="contenido-etiqueta-low">
                <i class="bi bi-clock"></i>
                00:00
            </span>
            <div class="contenido-barra"></div>
        </div>
    `;
    const contenedor = document.querySelector(".contenedor-barra-tiempo");
    for(let i=0;i<numeroDeBarras;i++){
        if(i != 0 && i % horasBarras == 0){
            template += `
                <div class="contenedor-barra-punto">
                    <span class="contenido-etiqueta-low">
                        <i class="bi bi-clock"></i>
                        ${Math.floor(i/6).toString().padStart(2, '0')}:00
                    </span>
                    <div class="contenido-barra"></div>
                </div>
            `
        }
        template += `
            <div class="contenedor-barra-t">
                <div class="contenido-barra color-envio-principal" data-bs-toggle="tooltip" data-bs-placement="top" title="0 Envios" data-bs-html="true"></div>
                <div class="contenido-barra-general color-envio-general"></div>
            </div>
        `;

        const fechaMin = new Date(fechaInicio);
        fechaMin.setMinutes(fechaMin.getMinutes() + i * 10);
        const fechaMax = new Date(fechaInicio);
        fechaMax.setMinutes(fechaMax.getMinutes() + (i+1)*10);
        arrayBarrasTiempos.push({contador:0,fechaMin,fechaMax});
    }
    template += `
        <div class="contenedor-barra-punto">
            <span class="contenido-etiqueta">
                <i class="bi bi-flag"></i>
                Fin
            </span>
            <span class="contenido-etiqueta-low">
                <i class="bi bi-clock"></i>
                ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}
            </span>
            <div class="contenido-barra"></div>
        </div>
    `;
    contenedor.innerHTML = template;

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    console.log(envios);
    let minimoFecha = new Date("10/10/2030");
    let minimoEnvio = null;
    let maximoFecha = new Date("10/10/2010");
    let maximoEnvio = null;

    envios.forEach(envio => {
        const [dia, mes, año] = envio.fechaEnvio.split("-");
        const [horas, minutos, segundos] = envio.horaEnvio.split(":");

        const fechaEnvio = new Date(año, mes - 1, dia, horas, minutos, segundos);

        if(fechaEnvio < minimoFecha){
            minimoFecha = fechaEnvio;
            minimoEnvio = envio;
        }

        if(fechaEnvio > maximoFecha){
            maximoFecha = fechaEnvio;
            maximoEnvio = envio;
        }
    });

    const fechaInitTorneo = new Date(torneo.fechaInicio+' '+torneo.horaInicio);

    const primerEnvioMinuto = document.querySelector(".minuto-primer-envio");
    primerEnvioMinuto.innerHTML = Math.floor(Math.abs(fechaInitTorneo - minimoFecha) / 60000);

    const primerEnvioProblema = document.querySelector(".problema-primer-envio");
    primerEnvioProblema.innerHTML = minimoEnvio.titulo;

    const primerEnvioUsuario = document.querySelector(".usuario-primer-envio");
    primerEnvioUsuario.innerHTML = minimoEnvio.usuario;

    const ultimoEnvioMinuto = document.querySelector(".minuto-ultimo-envio");
    ultimoEnvioMinuto.innerHTML = Math.floor(Math.abs(fechaInitTorneo - maximoFecha) / 60000);

    const ultimoEnvioProblema = document.querySelector(".problema-ultimo-envio");
    ultimoEnvioProblema.innerHTML = maximoEnvio.titulo;

    const ultimoEnvioUsuario = document.querySelector(".usuario-ultimo-envio");
    ultimoEnvioUsuario.innerHTML = maximoEnvio.usuario;
}

function procesamientoDeDatosTiempo(problema){
    arrayBarrasTiempos.forEach(barra => { barra.contador = 0})
    envios.forEach(envio => {
        if (problema == "all" || problema == envio.problema) {
            const [dia, mes, año] = envio.fechaEnvio.split("-");
            const [horas, minutos, segundos] = envio.horaEnvio.split(":");

            const fechaEnvio = new Date(año, mes - 1, dia, horas, minutos, segundos);

            for(let i=0;i<arrayBarrasTiempos.length;i++){
                if(fechaEnvio >= arrayBarrasTiempos[i].fechaMin && fechaEnvio < arrayBarrasTiempos[i].fechaMax){
                    arrayBarrasTiempos[i].contador++;
                    break;
                }
            }
        }
    });
    const barras = document.querySelectorAll(".contenedor-barra-tiempo .contenedor-barra-t .contenido-barra");
    barras.forEach((barra,i) => {
        const porcentaje = (arrayBarrasTiempos[i].contador / arrayBarrasTiemposMaximo) * 100;
        barra.style.height = (porcentaje / 100) * 380 + 'px';

        const hMin = arrayBarrasTiempos[i].fechaMin.getHours().toString().padStart(2, '0');
        const mMin = arrayBarrasTiempos[i].fechaMin.getMinutes().toString().padStart(2, '0');
        const hMax = arrayBarrasTiempos[i].fechaMax.getHours().toString().padStart(2, '0');
        const mMax = arrayBarrasTiempos[i].fechaMax.getMinutes().toString().padStart(2, '0');
        const title = `
            <p class="mb-0">Entre las ${hMin}:${mMin} y ${hMax}:${mMax}</p>
            <p class="mb-0">Se realizaron ${arrayBarrasTiempos[i].contador} envios</p>
        `;
        barra.setAttribute("data-bs-original-title",title)
    })
    let promedio = 0;
    arrayBarrasTiempos.forEach(v => { promedio += v.contador });

    const promedioElemento1 = document.querySelector(".promedio-transcurso-torneo-1")
    promedioElemento1.innerHTML = (promedio/arrayBarrasTiempos.length).toFixed(2)
    const promedioElemento2 = document.querySelector(".promedio-transcurso-torneo-2")
    promedioElemento2.innerHTML = (promedio/arrayBarrasTiempos.length).toFixed(2)
}

function procesamientoDeDatosTiempoGeneral(){
    arrayBarrasTiempos.forEach(barra => { barra.contador = 0})
    envios.forEach(envio => {
        const [dia, mes, año] = envio.fechaEnvio.split("-");
        const [horas, minutos, segundos] = envio.horaEnvio.split(":");

        const fechaEnvio = new Date(año, mes - 1, dia, horas, minutos, segundos);

        for(let i=0;i<arrayBarrasTiempos.length;i++){
            if(fechaEnvio >= arrayBarrasTiempos[i].fechaMin && fechaEnvio < arrayBarrasTiempos[i].fechaMax){
                arrayBarrasTiempos[i].contador++;
                break;
            }
        }
    });
    for(let i=0;i<arrayBarrasTiempos.length;i++){
        arrayBarrasTiemposMaximo = Math.max(arrayBarrasTiemposMaximo,arrayBarrasTiempos[i].contador)
    }
    const barras = document.querySelectorAll(".contenedor-barra-tiempo .contenedor-barra-t .contenido-barra-general");
    barras.forEach((barra,i) => {
        const porcentaje = (arrayBarrasTiempos[i].contador / arrayBarrasTiemposMaximo) * 100;
        barra.style.height = (porcentaje) ? ((porcentaje / 100) * 380 + 'px') : '3px';
    })
}

function generarProblemasParaTiempo(){
    let template = `<button type="button" class="btn btn-primary me-2 mb-2 botones-problemas-tiempo" data-boton-respuesta="all">Todos</button>`;
    problemas.forEach(problema => {
        template += `<button type="button" class="btn btn-outline-primary me-2 mb-2 botones-problemas-tiempo text-truncate" data-boton-respuesta="${problema.idProblema}">${problema.letra} - ${problema.titulo}</button>`
    })
    let contenedor = document.querySelector(".problemas-barras-tiempo");

    contenedor.innerHTML = template;

    const botones = document.querySelectorAll(".botones-problemas-tiempo");

    botones.forEach(e => {
        e.addEventListener("click",(e) => filtroBotonesRespuestaTiempo(e))
    })
}

function filtroBotonesRespuestaTiempo(event){
    const botones = document.querySelectorAll(".botones-problemas-tiempo");
    botones.forEach(element => {
        if(element.classList.contains("btn-primary")){
            element.classList.remove("btn-primary");
            element.classList.add("btn-outline-primary");
        }
    })

    event.target.classList.remove("btn-outline-primary");
    event.target.classList.add("btn-primary");

    procesamientoDeDatosTiempo(event.target.getAttribute("data-boton-respuesta"));
}

function procesamientoDeDatosLenguaje(problema){
    resetearContadoresLenguaje();
    let contador = 0;
    envios.forEach(envio => {
        if (problema == "all" || problema == envio.problema) {
            switch (envio.lenguaje) {
                case 'C':
                    arrayLenguajeEnvioTotal['C']++;
                    break;
                case 'C++':
                    arrayLenguajeEnvioTotal['CPLUS']++;
                    break;
                case 'Python':
                    arrayLenguajeEnvioTotal['PYTHON']++;
                    break;
                case 'Java':
                    arrayLenguajeEnvioTotal['JAVA']++;
                    break;
            }
            contador++;
        }
    });
    
    let maximo = 10
    for(const key in arrayLenguajeEnvioTotal){
        maximo = Math.max(maximo,arrayLenguajeEnvioTotal[key])
    }
    const barras = document.querySelectorAll('.contenedor-barra-lenguaje .contenedor-barra-l');
    barras.forEach(barra => {
        const key = barra.dataset.respuesta;
        const porcentaje = (arrayLenguajeEnvioTotal[key] / maximo) * 100;
        const contenido = barra.querySelector('.contenido-barra');
        contenido.style.width = porcentaje + '%';
        const cantidad = barra.querySelector('.cantidad');
        cantidad.style.left = porcentaje + '%';
        cantidad.innerHTML = arrayLenguajeEnvioTotal[key];
    })

    const c = document.querySelector(".c-l");
    c.innerHTML = Math.round((arrayLenguajeEnvioTotal['C'] / contador) * 100)+" %";
    const cplus = document.querySelector(".cplus-l");
    cplus.innerHTML = Math.round((arrayLenguajeEnvioTotal['CPLUS'] / contador) * 100)+" %"
    const python = document.querySelector(".python-l");
    python.innerHTML = Math.round((arrayLenguajeEnvioTotal['PYTHON'] / contador) * 100)+" %"
    const java = document.querySelector(".java-l");
    java.innerHTML = Math.round((arrayLenguajeEnvioTotal['JAVA'] / contador) * 100)+" %"
}

function resetearContadoresLenguaje(){
    arrayLenguajeEnvioTotal = {C: 0,CPLUS:0, PYTHON:0, JAVA: 0}
}

function generarBarrasParaPaises(){
    arrayBarrasPaises = [];
    envios.forEach(envio => {
        const exist = arrayBarrasPaises.some(e => e.id == envio.pais);
        if(!exist) arrayBarrasPaises.push({id: envio.pais, nombre: envio.nombre, cantidad: 0})
    });
} 

function agregarBarrasPaises(){
    arrayBarrasPaises.sort((a, b) => {
        if (a.cantidad === b.cantidad) {
          return a.nombre.localeCompare(b.nombre);
        } else {
          return b.cantidad - a.cantidad;
        }
    });

    let template = ``;
    arrayBarrasPaises.forEach(pais => {
        template += `
            <div class="contenedor-barra-p" data-respuesta="${pais.id}">
                <span class="label-data-pais">${pais.nombre}</span>
                <div class="contenido-barra"></div>
                <span class="cantidad"></span>
            </div>
        `;
    })

    template += `<span class="label-x-paises">Cantidad de envios</span>`;
    const contenedor = document.querySelector(".contenedor-barra-paises");
    contenedor.innerHTML = template;
}

function procesamientoDeDatosPaises(problema){
    arrayBarrasTiempos.forEach(barra => { barra.contador = 0});
    let maximo = 10;

    envios.forEach(envio => {
        if (problema == "all" || problema == envio.problema) {
            const indice = arrayBarrasPaises.findIndex(e => e.id == envio.pais);
            arrayBarrasPaises[indice].cantidad++;
            maximo = Math.max(maximo,arrayBarrasPaises[indice].cantidad);
        }
    });
    agregarBarrasPaises();
    const barras = document.querySelectorAll(".contenedor-barra-paises .contenedor-barra-p");
    barras.forEach((barra,i) => {
        const porcentaje = (arrayBarrasPaises[i].cantidad / maximo) * 100;

        const bar = barra.querySelector(".contenido-barra");
        bar.style.width = porcentaje + '%';

        const cantidad = barra.querySelector(".cantidad");
        cantidad.style.left = porcentaje + '%';

        cantidad.innerHTML = arrayBarrasPaises[i].cantidad;
    });
}

function cargarDatosGenerales(){
    const totalEnvios = document.querySelector(".total-envios-estadistica");
    totalEnvios.innerHTML = envios.length;

    const totalUsuarios = document.querySelector(".total-usuarios-estadistica");
    totalUsuarios.innerHTML = participantes.length;

    let totalAceptados = 0;
    envios.forEach(e => {if(e.respuesta == 'Aceptado') totalAceptados++})

    const totalProblemasResuelto = document.querySelector(".total-problemas-resuelto-estadistica");
    totalProblemasResuelto.innerHTML = totalAceptados;

    const totalPaises = document.querySelector(".total-paises-estadistica");
    totalPaises.innerHTML = arrayBarrasPaises.length;
}