<?php
    include ('conexion.php');
    session_start();
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra logueado ningun usuario")));
    $usuario = $_SESSION['usuario'];
    $contra = sha1($_POST['contra']);
    $sql = "SELECT usuario,contra FROM BD.usuarios WHERE usuario = '$usuario'";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) {
        die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    while($row = mysqli_fetch_array($resp)) $contraActual = $row['contra'];
    if($contra == $contraActual){
        echo json_encode(array("error" => false, "estado" => true));
    }
    else{
        echo json_encode(array("error" => false, "estado" => false));
    }
    
?>