<?php
    include('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    $titulo = $_POST['nombreTorneo'];
    $fechaCreacion = devolverFecha($hoy);
    $horaCreacion = devolverHora($hoy);
    $sql = "INSERT INTO BD.torneos (nombre,fechaCreacion,horaCreacion,fechaInicio,horaInicio,duracion,nivelTorneo,tiempoPenalizacion) VALUE('$titulo','$fechaCreacion','$horaCreacion','$fechaCreacion','$horaCreacion','01:00:00',1,20);";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error '.mysqli_error($conexion))));
    echo json_encode(array("error" => false,"mensaje" => "Torneo Creado"));
?>