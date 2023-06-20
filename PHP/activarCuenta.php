<?php
    include ('conexion.php');
    session_start();
    if($_SESSION['usuario']) $usuario = $_SESSION['usuario'];
    else die(json_encode(array("error" => true, "mensaje" => "Error sesion", "descripcion" => "No se encuentra ningun usuario logueado")));
    $datoHash = $_POST['hash'];
    $sql = "SELECT * FROM BD.usuarios WHERE usuario = '$usuario';";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) {
        die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    while($row = mysqli_fetch_array($resp)) {
        $hashActivo = sha1($row['hashActivo']);
    }
    if($hashActivo == $datoHash){
        $sql = "UPDATE BD.usuarios SET activo = true WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) {
            die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
        $_SESSION['activo'] = 1;
        $_SESSION['activado'] = true;
        echo json_encode(array("error" => false, "estado" => true));
    }
    else{
        echo json_encode(array("error" => false, "estado" => false));
    }
?>