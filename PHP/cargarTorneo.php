<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])){
        $usuario = $_SESSION['usuario'];
        $nivel = nivelUsuario($conexion,$usuario);
    }
    else{
        die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    }
    $idTorneo = $_POST['idTorneo']; 
    $estado = estadoTorneo($conexion,$idTorneo,$hoy);
    $sql = "SELECT idTorneo,nombre,fechaInicio,fechaCreacion,horaInicio,duracion,DATE_FORMAT(DATE_ADD(CONCAT(CONCAT(fechaInicio,' '),horaInicio),INTERVAL duracion HOUR_SECOND) , '%Y-%c-%d %H:%i:%S') as fechaFin,tiempoPenalizacion,nivelTorneo FROM BD.torneos WHERE idTorneo = $idTorneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    if($_POST['metodo'] == 'torneo'){
        $respuestas = [];
        while($row = mysqli_fetch_array($resp)){
            $respuestas['idTorneo'] = $row['idTorneo'];
            $respuestas['nombre'] = $row['nombre'];
            $respuestas['duracion'] = $row['duracion'];
            $respuestas['fechaInicio'] = $row['fechaInicio']." ".$row['horaInicio'];
            $respuestas['fechaFin'] = $row['fechaFin'];
        }
        $respuestas['estado'] = $estado;
        $respuestas['posicion'] = posicionTabla($conexion,$idTorneo,$usuario);
        $respuestas['totalAceptado'] = numeroDeRespuestasTotal($conexion,$idTorneo,$usuario,'Aceptado');
        $respuestas['ultimosEnvios'] = ultimosEnvios($conexion,$idTorneo,$usuario);
        echo json_encode(array("error" => false, "respuesta" => $respuestas));
    } 

    if($_POST['metodo'] == 'admin'){
        $respuesta;
        while($row = mysqli_fetch_assoc($resp)){
            $respuesta = $row;
        }
        echo json_encode(array("error" => false,"respuesta" => $respuesta));
    }
?>