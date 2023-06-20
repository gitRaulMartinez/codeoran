<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    include ('juezLib.php');
    session_start();
    $usuario = $_SESSION['usuario'];
    $idEnvio = $_POST['idEnvio'];
    /*Buscar los numeros de Test, IDProblema y nombreDelArchivo*/
    $sql = "SELECT * FROM BD.problemas,BD.envios WHERE idProblema = problema AND idEnvio = $idEnvio;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)) {
        $test = intval($row['test']);
        $nombre = $row['archivo'];
        $idProblema = $row['problema'];
        $fecha = $row['fechaEnvio'];
        $hora = $row['horaEnvio']; 
        $idTorneo = $row['torneo'];
        $lenguaje = $row['lenguaje'];
        $limite = intval($row['limite']);
    }

    $ruta = "../Datos/Envios/".$idEnvio;
    if(compilar($nombre,$lenguaje,$ruta."/",false)){
        if($lenguaje == 'C' || $lenguaje == 'C++') $ejecutable = $ruta."/ejecutable";
        if($lenguaje == 'Java'){
            $class = "/opt/lampp/htdocs/CodeOran/Datos/Envios/".$idEnvio;
            $ejecutable = obtenerNombreArchivo(obtenerArchivoClass($ruta));
        }
        else $class = "";
        if($lenguaje == 'Python'){
            $ejecutable = $ruta."/".$nombre;
        }

        $bandera = true;
        $i = 0;
        for($i=0;$i<$test && $bandera;$i++){
            $testIn = "../Datos/Problemas/".$idProblema."/in/test".($i+1).".in";
            $testOut = $ruta."/test".($i+1).".out";
            $testTime = $ruta."/error".($i+1).".txt";
            ejecutar($ejecutable,$lenguaje,$testIn,$testOut,$testTime,$class);

            if(errorTiempoEjecucion($testTime)){
                $bandera = false; 
                $mensaje = "Error en Tiempo de Ejecucion";
                continue; 
            }

            if(limiteTiempoExcedido($testTime,$limite)) {
                $bandera = false; 
                $mensaje = "Tiempo Limite Excedido";
                continue;
            }

            $testEsperado = "../Datos/Problemas/".$idProblema."/out/test".($i+1).".out";   
            if(!compararTests($testOut,$testEsperado)){
                $bandera = false; 
                $mensaje = "Respuesta Incorrecta";
                continue;
            }
        }
        if($bandera) $mensaje = "Aceptado";
    }
    else{
        $bandera = false;
        $mensaje = "Compilacion Fallida";
    }
    respuestaJuez($conexion,$idEnvio,$mensaje,$bandera);

    echo json_encode(array("error" => false, "mensaje" => $mensaje));
?>