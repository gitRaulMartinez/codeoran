<?php
    include ('tiempo.php');
    include ('conexion.php');
    session_start();
    $idTorneo = $_POST['idTorneo'];
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true, "mensaje" => "Error", "descripcion" => "El usuario no se encuentra logueado")));
    $fechaHoy = devolverFecha($hoy);
    $horaHoy = devolverHora($hoy);
    $sql = "SELECT fechaInicio,horaInicio FROM BD.torneos WHERE idTorneo = $idTorneo";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)){
        $fechaTorneo = $row['fechaInicio'];
        $horaTorneo = $row['horaInicio'];
    }
    $tiempoHoy = strtotime($fechaHoy." ".$horaHoy);
    $tiempoTorneo = strtotime($fechaTorneo." ".$horaTorneo);
    if($tiempoHoy < $tiempoTorneo){
        $usuario = $_SESSION['usuario'];
        if(!intval($_SESSION['activo'])) die(json_encode(array("error" => false, "mensaje" => "Debe activar la cuenta")));
        $sql = "SELECT usuario,torneo FROM BD.inscripcion WHERE usuario = '$usuario' AND torneo = $idTorneo;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        if(mysqli_num_rows($resp) > 0) die(json_encode(array("error" => false, "mensaje" => "Ya se encuentra registrado")));
        $sql = "INSERT INTO BD.inscripcion (usuario,torneo,fecha,hora) VALUE('$usuario',$idTorneo,'$fechaHoy','$horaHoy');";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "mensaje" => "Torneo Registrado"));
    }
    else{
        echo json_encode(array("error" => false, "mensaje" => "Se cerraron las inscripciones"));
    }
?>