<?php
    include ('conexion.php');
    include ('juezLib.php');
    include ('funciones.php');
    include ('tiempo.php');
    $arrayLetrasNumeros = array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');

    $clave = $arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)].$arrayLetrasNumeros[rand(0,35)];


    $asunto = 'Modificar correo';
    $mensaje = "<div> Hola somos de CodeOran te hemos enviado esta clave para poder cambiar tu correo. Copia y pegala en la pagina web donde te indicamos. </div> <br> <section style='position: aboslute; width: 90%; background-color: #525a54; color: white; border-radius: 15px; margin-left: 5%; margin-right: 5%; margin-bottom: 3%; display: flex; flex-direction: column; align-items: center;'> <div style='font-size: 15px; text-align: center;'> Clave: </p> <div style='font-size: 40px; text-align: center;' id='clave'>{$clave}</p> </section> <hr> <div style='font-size: 15px;'>atte: Codeoran Web</div> <b> No responder este mensaje </b>";

    echo $mensaje."<br>";

    $rutaDescripcion = "../Datos/Problemas/datos/descripcion.txt";
    $rutaEntrada = "../Datos/Problemas/datos/entrada.txt";
    $rutaSalida = "../Datos/Problemas/datos/salida.txt";
    echo "<br>";
    echo chr(ord('A')+1).'<br>';

    foreach($arrayLetrasNumeros as $letra){
        echo $letra.' ';
        $contador[$letra] = 0;
    }
    echo "<br>";
    echo print_r($contador);

    echo sizeof($arrayLetrasNumeros).'<br>';

    echo "Prueba de objetos<br><br><br>";
    
    /*
    $sql = "SELECT * FROM BD.inscripcion;";
    $resp = mysqli_query($conexion,$sql);
    $arreglo["data"] = [];
    if(!$resp){
        die("Error");
    } 
    else{
        $nuevoData = [];
        while($data = mysqli_fetch_array($resp)) {
            $arrayDatosFila = [];
            $arrayDatosFila []= $data['idInscripcion'];
            $arrayDatosFila []= $data['usuario'];
            $arrayDatosFila []= $data['torneo'];
            $arrayDatosFila []= $data['fecha'];
            $arrayDatosFila []= $data['hora'];
            $arreglo["data"] []= $data;
            print_r($arrayDatosFila);
            echo "<br><br><br>";
        }
    }

    print_r($arreglo);
    */

    session_start();
    $idTorneo = 17;
    if(isset($_SESSION['usuario'])){
        $usuario = $_SESSION['usuario'];
        $nivel = nivelUsuario($conexion,$usuario);
    }
    else{
        die("Error Sesion");
    }
    /*
    $sql = "SELECT BD.usuarios.usuario as usuarioResultado,BD.paises.nombre as paisResultado FROM BD.usuarios INNER JOIN BD.paises ON id = pais INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo WHERE BD.usuarios.nivel = $nivel;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die("Error Consulta de datos: ".mysqli_error($conexion));
    $arreglo["data"] = [];
    while($dato = mysqli_fetch_array($resp)){
        $fila = [];
        $fila []= $dato['usuarioResultado'];
        $fila []= utf8_encode($dato['paisResultado']);
        $sqlProblemas = "SELECT idProblemas FROM BD.problemas WHERE torneoAsociado = $idTorneo;";
        $respProblemas = mysqli_query($conexion,$sqlProblemas);
        if(!$respProblemas) die("Error Consulta de datos: ".mysqli_error($conexion));
        $totalRespuestasCorrectas = 0;
        $tiempoDePenalizacion = 0;
        while($datoProblema = mysqli_fetch_array($respProblemas)){
            $numeroAceptados = numeroDeRespuestas($conexion,$datoProblema['idProblemas'],$dato['usuarioResultado'],'Aceptado');
            $numeroNoAceptados = numeroDeRespuestasNo($conexion,$datoProblema['idProblemas'],$dato['usuarioResultado'],'Aceptado');
            if($numeroAceptados){
                $fila []= 2;
                $totalRespuestasCorrectas++;
                $tiempoDePenalizacion += tiempoMinimoProblema($conexion,$datoProblema['idProblemas'],$dato['usuarioResultado']);
            }
            else{
                if($numeroNoAceptados){
                    $fila []= 1;
                }
                else{
                    $fila []= 0;
                }
            }
        }
        $fila []= $totalRespuestasCorrectas;
        $fila []= $tiempoDePenalizacion;
        echo print_r($fila);
        echo "<br><br>";
        $arreglo["data"] []= $fila;
    }

    uasort($arreglo["data"],'compareResultado');
    $datos["data"] = [];
    $pos = 1;
    $usuario = 'Azucar';
    foreach($arreglo["data"] as $valor){
        $resultado = [];
        if($usuario == $valor[0]){
            $resultado []= $pos;
            foreach($valor as $data){
                $resultado []= $data;
            }
        }
        else{
            $resultado []= $pos;
            foreach($valor as $data){
                $resultado []= $data;
            }
        }
        
        $datos["data"] []= $resultado;
        $pos++;
    }


    foreach($datos["data"] as $valor){
        print_r($valor);
        echo '<br>';
    }
    */
    /*
    $sql = "SELECT idPregunta,usuario,pregunta,problema,titulo,letra,fecha FROM BD.preguntas INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo WHERE responde IS null;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die("Error Consulta de datos: ".mysqli_error($conexion));
    $arreglo['data'] = [];
    while($data = mysqli_fetch_assoc($resp)){
        $data['acciones'] = "Hola crack aqui pongo botones";
        $arreglo['data'] []= $data;
        echo $data['fecha'];
        $datosFechas = explode(' ',$data['fecha']);
        print_r($datosFechas);
        echo '<br><br>';
    }
    echo "Termino aca ññ";
    */
    /*
    $directorio = "";
    $lista  = scandir($directorio);
    print_r($ficheros1);
    */

    /*
    $ruta = "../Datos/Problemas/120/in";
    $lista = scandir($ruta);
    print_r($lista);
    echo "<br>";
    foreach($lista as $archivo){
        if($archivo != "." && $archivo != ".."){
            echo obtenerNumeroTest($archivo)."<br>";
            echo $archivo."<br>";
        }
    }
    */
    /*
    $usuario = 'gokuLoco';
    $idEnvio = '252';

    $sql = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema INNER JOIN BD.torneos ON torneo = idTorneo WHERE idEnvio = $idEnvio;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($dato = mysqli_fetch_assoc($resp)){
            $idProblema = $dato['problema'];
            $penalizacion = intval($dato['tiempoPenalizacion'])*60; 
            $fechaTorneo = $dato['fechaInicio'];
            $horaTorneo = $dato['horaInicio'];
            $fechaEnvio = $dato['fechaEnvio'];
            $horaEnvio = $dato['horaEnvio'];
            $usuario = $dato['usuario'];
    }
    if(true){
        echo $idProblema."<br>";
        $tiempoTorneo = strtotime($fechaTorneo." ".$horaTorneo);
        $tiempoEnvio = strtotime($fechaEnvio." ".$horaEnvio); 
        $tiempoTotal = abs($tiempoEnvio - $tiempoTorneo)+$penalizacion*numeroDeRespuestasFallidas($conexion,$idProblema,$usuario);
        echo abs($tiempoEnvio - $tiempoTorneo)."<br>";
        echo $penalizacion*numeroDeRespuestasFallidas($conexion,$idProblema,$usuario)."<br>";
        echo $tiempoTotal;
    }
    */
    /*
    mail("rauldeoran17@gmail.com","asuntillo","Este es el cuerpo del mensaje") 
    */
    putenv("LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu");
    
    echo "Variables de entorno:\n";
    print_r($_ENV);

    echo "Usuario que ejecuta el script:\n";
    echo exec('whoami');
?>