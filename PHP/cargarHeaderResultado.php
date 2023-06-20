<?php
    include ('conexion.php');
    session_start();
    $idTorneo = $_POST['idTorneo'];
    $sql = "SELECT idProblema,letra,titulo FROM BD.problemas WHERE torneo = $idTorneo ORDER BY letra ASC";
    $problemas = mysqli_query($conexion,$sql);
    if(!$problemas) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $lista = [];
    while($row = mysqli_fetch_array($problemas)){
        $lista []= array("letra" => $row['letra'], "titulo" => $row['titulo'],"idProblema" => $row['idProblema']);
    }
    echo json_encode(array("error" => false, "lista" => $lista));
?>