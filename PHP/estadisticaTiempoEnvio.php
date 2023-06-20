<?php
    include ('conexion.php');
    date_default_timezone_set('America/Argentina/Salta');
    $idTorneo = $_POST['idTorneo'];
    $sql = "SELECT fechaInicio,horaInicio,duracion,DATE_FORMAT(DATE_ADD(CONCAT(CONCAT(fechaInicio,' '),horaInicio),INTERVAL duracion HOUR_SECOND) , '%Y-%c-%d %H:%i:%S') as fechaFin FROM BD.torneos WHERE idTorneo = $idTorneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)){
        $fechaTorneo = $row['fechaInicio'];
        $horaTorneo = $row['horaInicio'];
        $fechaFin = $row['fechaFin']; 
    }
    $tiempoInicio = strtotime($fechaTorneo." ".$horaTorneo);
    $tiempoFin = strtotime($fechaFin) - $tiempoInicio;


    $sql = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 ORDER BY fechaEnvio,horaEnvio";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $tiempos = array();
    while($row = mysqli_fetch_array($resp)){
        $tiempoEnvio = (strtotime($row['fechaEnvio'].' '.$row['horaEnvio'])-$tiempoInicio);
        if($tiempoEnvio <= $tiempoFin) $tiempos []= $tiempoEnvio;
    }
    $respuesta = array(
        'tiempoFin' => $tiempoFin,
        'tiempos' => $tiempos
    );
    echo json_encode(array('error' => false, "respuesta" => $respuesta));
?>