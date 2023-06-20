<?php
    $veri = sha1($_POST['clave']);
    session_start();
    if($_SESSION['claveTemporal']){
        if($veri == $_SESSION['claveTemporal']){
            $_SESSION['banderaActiva'] = true;
            echo json_encode(array("error" => false, "estado" => true));
        }
        else{
            echo json_encode(array("error" => false, "estado" => false));
        }
    }
    else echo json_encode(array("error" => true, "mensaje" => "Error Sesion PHP", "descripcion" => "No se encuentra la clave temporal para la activacion"));
?>