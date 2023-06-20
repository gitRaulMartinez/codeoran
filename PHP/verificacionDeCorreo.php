<?php
    include ('conexion.php');
    $correo = $_POST['correo'];
    $sql = "SELECT usuario FROM BD.usuarios WHERE correo = '$correo'";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) {
        die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    echo json_encode(array("error" => false, "numero" => intval(mysqli_num_rows($resp))));
?>