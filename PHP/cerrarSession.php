<?php
    session_start();
    unset($_SESSION['usuario']);
    unset($_SESSION['activo']);
    unset($_SESSION['rutaPerfil']);
    unset($_SESSION['nivel']);
    if(isset($_SESSION['claveTemporal'])) unset($_SESSION['claveTemporal']);
    if(isset($_SESSION['banderaActiva'])) unset($_SESSION['banderaActiva']);
    if(isset($_SESSION['usuarioCambioClave'])) unset($_SESSION['usuarioCambioClave']);
?>
