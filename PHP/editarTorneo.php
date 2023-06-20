<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));
    if($_POST['metodo'] == "actualizar"){
        $idTorneo = $_POST['idTorneo'];
        $nombre = $_POST['nombreTorneo'];
        $fecha = $_POST['fechaInicioTorneo'];
        $hora = $_POST['horaInicioTorneo'];
        $duracion = $_POST['duracionTorneo'];
        $penalizacion = $_POST['penalizacion'];
        $nivel = $_POST['nivel'];
        $sql = "UPDATE BD.torneos SET nombre = '$nombre', fechaInicio = '$fecha', horaInicio = '$hora', duracion = '$duracion', tiempoPenalizacion = $penalizacion, nivelTorneo = $nivel WHERE idTorneo = $idTorneo";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        else echo json_encode(array("error" => false, "mensaje" => "Datos modificados"));
    }
?>