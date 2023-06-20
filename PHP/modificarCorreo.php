<?php
    session_start();
    if(!isset($_SESSION['usuario'])){
        die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra ningun usuario logueado")));
    }
    else{
        include ('conexion.php');
        $correoNuevo = $_POST['correo'];
        $usuario = $_SESSION['usuario'];
        $sql = "UPDATE BD.usuarios SET correo='$correoNuevo' WHERE usuario='$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        $sqlActivo = "UPDATE BD.usuarios SET activo=0 WHERE usuario='$usuario';";
        $respActivo = mysqli_query($conexion,$sqlActivo);
        if(!$respActivo) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        $_SESSION['activo'] = 0;
        echo json_encode(array("error" => false, "mensaje" => "Correo modificado"));
    }
?>