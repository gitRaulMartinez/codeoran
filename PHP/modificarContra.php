<?php
    session_start();
    include ('conexion.php'); 
    if(isset($_SESSION['banderaActiva'])){
        if(!$_SESSION['banderaActiva']){
            echo json_encode(array("error" => true, "mensaje" => "Error variables sesion", "descripcion" => "No esta activada la bandera para el cambio de contraseña"));
        }
        else{
            $usuario = $_SESSION['usuarioCambioClave'];
        }
        if(isset($_SESSION['claveTemporal'])) unset($_SESSION['claveTemporal']);
        if(isset($_SESSION['banderaActiva'])) unset($_SESSION['banderaActiva']);
        if(isset($_SESSION['usuarioCambioClave'])) unset($_SESSION['usuarioCambioClave']);
    }
    else{
        $usuario = $_POST['usuario'];
    }
    $contraNueva = sha1($_POST['contra']);
    $sql = "UPDATE BD.usuarios SET contra='$contraNueva' WHERE usuario='$usuario';";
    $resp = mysqli_query($conexion,$sql);
    if($resp){
        echo json_encode(array("error" => false, "mensaje" => "Contraseña modificada"));
    }
    else{
        echo (json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
?>