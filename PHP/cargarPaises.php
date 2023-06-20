<?php
    include ('conexion.php');
    $sql = "SELECT id,nombre FROM BD.paises;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) {
        die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    $json = array();
    while($row = mysqli_fetch_array($resp)) {
        $json[] = array(
          "nombre" => $row["nombre"],
          "id" => $row["id"]
        );
    }
    echo json_encode(array("error" => false, "lista" => $json));
?>