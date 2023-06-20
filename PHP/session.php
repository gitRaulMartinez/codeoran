<?php
    session_start();
    if(!isset($_SESSION['usuario'])){
        echo 'no'; //No ha iniciado sesion
    }
    else{
        $datos = array(
            'usuario' => $_SESSION['usuario'],
            'activo' => $_SESSION['activo'],
            'nivel' => $_SESSION['nivel'],
            'rutaPerfil' => $_SESSION['rutaPerfil'],
            'bievenido' => $_SESSION['bievenido'],
            'activado' => $_SESSION['activado']
        );
        if($_SESSION['bievenido']) $_SESSION['bievenido'] = false;
        if($_SESSION['activado']) $_SESSION['activado'] = false;
        $jsonstring = json_encode($datos);
        echo $jsonstring;
    }
?>