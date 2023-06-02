<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])){
        $nivel = nivelUsuario($conexion,$_SESSION['usuario']);
        if($nivel < 2){
            die(json_encode(array("error" => true, "mensaje" => "nivel de usuario no valido", "descripcion" => "no posee el nivel adecuado para administrar la pagina")));
        }
        else{
            die(json_encode(array("error" => false)));
        }
    }
    else die(json_encode(array("error" => true, "mensaje" => "Error sesion", "descripcion" => "no se encontro ningun usuario logeado")));
?>