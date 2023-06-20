var idTorneo = 0;
var arrayRespuestaEnvioTotal = {A: 0,CP: 0,EE: 0,EETE: 0,RI: 0,TLE: 0};
var arrayLetrasProblemas = [];
var arrayProblemas = [];
var tiempoFin;
$(document).ready(function(){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    idTorneo = urlParams.get('idTorneo');
    cargarDatosTorneo();
});

function cargarDatosTorneo(){
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
                let torneo = resp.respuesta;
                //document.getElementById("torneoTitulo").innerHTML = torneo.nombre;
                switch(torneo.estado){
                    case 0: document.getElementById("torneoEstado").innerHTML = "Estado: Sin iniciar"; break;
                    case 1: document.getElementById("torneoEstado").innerHTML = "Estado: En transcurso"; break;
                    case 2: document.getElementById("torneoEstado").innerHTML = "Estado: Finalizado"; break;
                }
                cargarDatosEstadisticosEnvios();
            }
        }
    });
}

function cargarDatosEstadisticosEnvios(){
    var datos = {
        idTorneo : idTorneo
    };
    $.ajax({
        url: "../PHP/estadistica.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta);
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let envios = resp.datos;
                $("#totalEnvioTorneo").html(envios.totalEnvio);
                arrayProblemas = envios.problemas;
                document.getElementById("numeroDeProblemas").innerHTML = envios.problemas.length;
                envios.json.forEach(envio => {
                    switch(envio.respuesta){
                        case 'Aceptado': arrayRespuestaEnvioTotal['A'] += parseInt(envio.cantidad); break;
                        case 'Compilacion Fallida': arrayRespuestaEnvioTotal['CP'] += parseInt(envio.cantidad); break;
                        case 'En espera': arrayRespuestaEnvioTotal['EE'] += parseInt(envio.cantidad); break;
                        case 'Error en Tiempo de Ejecucion': arrayRespuestaEnvioTotal['EETE'] += parseInt(envio.cantidad); break;
                        case 'Respuesta Incorrecta': arrayRespuestaEnvioTotal['RI'] += parseInt(envio.cantidad); break;
                        case 'Tiempo Limite Excedido': arrayRespuestaEnvioTotal['TLE'] += parseInt(envio.cantidad); break;
                    }
                });
                generarCirculoDeDatosEnvios();
                generarTiempoEnvios();
                generarTablaEnvios(parseFloat(envios.totalEnvio));
                generarDiagramaDeBarras(envios.setRespuesta,parseInt(envios.totalProblemas),envios.problemas);
                generarBarraLenguajes(envios.lenguajes);
                generarBarraPreguntas(envios.preguntas,envios.problemas);
                generarBarraPaises(envios.datoPais);
            }
        }
    });
}

function generarCirculoDeDatosEnvios(){
    const circuloDeDatos = document.getElementById("torneoCirculoEstadisticoEnvios");
    const myCirculoDeDatos = new Chart(circuloDeDatos,{
        type: 'pie',
        data: {
            labels: ['En espera','Aceptado','Respuesta Incorrecta','Compilacion Fallida','Error en tiempo de Ejecucion','Tiempo Limite Excedido'],
            datasets: [{
                label: ['En espera','Aceptado','Respuesta Incorrecta','Compilacion Fallida','Error en tiempo de Ejecucion','Tiempo Limite Excedido'],
                data: [arrayRespuestaEnvioTotal['EE'],arrayRespuestaEnvioTotal['A'],arrayRespuestaEnvioTotal['RI'],arrayRespuestaEnvioTotal['CP'],arrayRespuestaEnvioTotal['EETE'],arrayRespuestaEnvioTotal['TLE']],
                backgroundColor: [
                    '#bababa',
                    '#30d500',
                    '#f50b0b',
                    '#1d7aea',
                    '#fa27f3',
                    '#ffbd26'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: false,
                text: 'Envios'
              }
            }
        }
    });
}

function generarTablaEnvios(total){
    document.getElementById("respuestaA#").innerHTML = arrayRespuestaEnvioTotal['A'];
    document.getElementById("respuestaA%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['A'])/total)*100).toFixed(2) : 0;
    document.getElementById("respuestaCP#").innerHTML = arrayRespuestaEnvioTotal['CP'];
    document.getElementById("respuestaCP%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['CP'])/total)*100).toFixed(2): 0;
    document.getElementById("respuestaEE#").innerHTML = arrayRespuestaEnvioTotal['EE'];
    document.getElementById("respuestaEE%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['EE'])/total)*100).toFixed(2): 0;
    document.getElementById("respuestaRI#").innerHTML = arrayRespuestaEnvioTotal['RI'];
    document.getElementById("respuestaRI%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['RI'])/total)*100).toFixed(2): 0;
    document.getElementById("respuestaEETE#").innerHTML = arrayRespuestaEnvioTotal['EETE'];
    document.getElementById("respuestaEETE%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['EETE'])/total)*100).toFixed(2): 0;
    document.getElementById("respuestaTLE#").innerHTML = arrayRespuestaEnvioTotal['TLE'];
    document.getElementById("respuestaTLE%").innerHTML = (total != 0) ? parseFloat((parseFloat(arrayRespuestaEnvioTotal['TLE'])/total)*100).toFixed(2): 0;
    document.getElementById("respuestaT#").innerHTML = total;
    document.getElementById("respuestaT%").innerHTML = (total != 0) ? 100 : 0;
}

function generarDiagramaDeBarras(setRespuesta,totalProblemas,problemas){
    let data = [];
    let colores = ['#ffbd26','#fa27f3','#1d7aea','#f50b0b','#30d500','#bababa'];
    let c = 0;
    setRespuesta.forEach(resp => {
        let lista = [];
        for(let i=0;i<totalProblemas;i++) lista.push(0);
        resp.cantidadRespuesta.forEach(valor => {
            lista[valor.letra.charCodeAt(0)-65] = parseInt(valor.cantidad);
        });    
        data.push({label: resp.respuesta, data: lista, backgroundColor: colores[c]});
        c++;
    });
    const diagramBarra = document.getElementById('diagramaBarrasRespuesta');
    const myDiagramaBarrra = new Chart(diagramBarra, {
        type: 'bar',
        data: {
            labels: problemas.map((obj) => obj.letra),
            datasets: data,
        },
        options: {
            indexAxis: 'x',
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'Envios por problema'
                },
                tooltip: {
                    callbacks: {
                        title: tooltipProblema
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function generarBarraLenguajes(listaDatos){
    const barraLenguaje = document.getElementById('barraLenguaje');
    const myDiagramaBarrra = new Chart(barraLenguaje, {
        type: 'bar',
        data: {
            labels: ['C','C++','Java','Python'],
            datasets: [{
                label: 'C',
                data: [listaDatos[0],0,0,0],
                backgroundColor: '#95a1f9'
            },
            {
                label: 'C++',
                data: [0,listaDatos[1],0,0],
                backgroundColor: '#00129a'
            },
            {
                label: 'Java',
                data: [0,0,listaDatos[2],0],
                backgroundColor: '#8e0000'
            },
            {
                label: 'Python',
                data: [,0,0,listaDatos[3]],
                backgroundColor: '#fffc27'
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Lenguajes utilizados'
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function generarBarraPreguntas(listaContador,problemas){
    let listaCantidad = [];
    for(let i=0;i<problemas.length;i++) listaCantidad.push(parseInt(listaContador[problemas[i].letra]));
    const barraPreguntas = document.getElementById('barraPreguntas');
    const myDiagramaBarrra = new Chart(barraPreguntas, {
        type: 'bar',
        data: {
            labels: problemas.map((obj) => obj.letra),
            datasets: [{
                label: 'Preguntas',
                data: listaCantidad,
                backgroundColor: '#00062e'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false,
                    text: 'Preguntas'
                },
                tooltip: {
                    callbacks: {
                        title: tooltipProblema
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function generarTiempoEnvios(){
    var datos = {
        idTorneo : idTorneo
    };
    $.ajax({
        url: "../PHP/estadisticaTiempoEnvio.php",
        type: "POST",
        data: datos,
        success: function(respuesta){
            let resp = JSON.parse(respuesta)
            if(resp.error){
                cartelNotificacion(resp.mensaje);
                console.log(resp.descripcion);
            }
            else{
                let envios = resp.respuesta;
                tiempoFin = parseInt(envios.tiempoFin/60);
                tiempoEnvios(10,envios.tiempos);
            }
        }
    });
}

function tiempoEnvios(intervalo,listaEnvio){
    let labels = [0];
    let cantidades = [0];
    let acu =  intervalo;
    let cant = 0;
    let i = 0;
    while(acu < tiempoFin){
        labels.push('['+(acu-intervalo)+','+acu+')');
        while(i < listaEnvio.length && parseInt(listaEnvio[i]/60) < acu){
            cant++;
            i++;
        }
        cantidades.push(cant);
        acu += intervalo;
        cant = 0;
    }
    labels.push('['+(acu-intervalo)+','+tiempoFin+']');
    while(i < listaEnvio.length && parseInt(listaEnvio[i]/60) <= tiempoFin){
        cant++;
        i++;
    }
    cantidades.push(cant);
    labels.push(tiempoFin);
    cantidades.push(0);
    const lineaEnvios = document.getElementById('lineaEnvios');
    const lineaEnviosTiempo = new Chart(lineaEnvios, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Envios',
                data: cantidades,
                backgroundColor: 'rgba(8, 0, 79, 0.62)',
                fill: true,
                pointStyle: 'circle',
                pointRadius: 7,
                pointHoverRadius: 15
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Tiempo - Envio'
                },
                tooltip: {
                    callbacks: {
                        title: tooltipEnvios
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function generarBarraPaises(datoPais){
    const barraPaises = document.getElementById('barraPaises');
    const myDiagramaPais = new Chart(barraPaises, {
        type: 'bar',
        data: {
            labels: datoPais.paises,
            datasets: [{
                label: 'Paises',
                data: datoPais.numero,
                backgroundColor: '#696969',
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Paises'
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

function tooltipProblema(context){
    for(let i=0;i<arrayProblemas.length;i++){
        if(arrayProblemas[i].letra == context[0].label){ 
            return arrayProblemas[i].letra + ' : ' + arrayProblemas[i].titulo;
        }
    }
    return 'Problema no definido';
}

function tooltipEnvios(context){
    const [minutoInicio,minutoFinal] = context[0].label.split(',');
    const mi = minutoInicio.replace("[","");
    const mf = minutoFinal.replace(")","");
    return 'Durante el minuto '+mi+' y el minuto '+mf+' se realizaron';
}