<?php
    include ('conexion.php');
    $usuario = $_POST['usuario'];
    $sql = "SELECT usuario FROM BD.usuarios WHERE usuario = '$usuario'";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) {
        die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    echo json_encode(array("error" => false, "numero" => intval(mysqli_num_rows($resp))));
?>