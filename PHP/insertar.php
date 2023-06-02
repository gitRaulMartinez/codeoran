<?php
    include ('tiempo.php');
    include ('conexion.php');
    include('enviarCorreo.php');
    $fechaHoy = devolverFecha($hoy);
    $horaHoy = devolverHora($hoy);
    $ultimaConexion = $fechaHoy.' '.$horaHoy;
    $fechaDeCreacion = $fechaHoy.' '.$horaHoy;
    $usuario = $_POST['usuario'];
    $pass = sha1($_POST['pass']);
    $correo = $_POST['correo'];
    $pais = $_POST['pais'];
    $hashActivo = sha1($pass.$horaHoy); 
    if($pais == "0") $pais = "null";
    $sql = "INSERT INTO BD.usuarios(usuario, contra, correo, pais, foto, nivel, activo, hashActivo, fechaDeCreacion, ultimaConexion) VALUES('$usuario','$pass','$correo',$pais,'not',1,false,'$hashActivo','$fechaDeCreacion','$ultimaConexion');";
    $resp = mysqli_query($conexion,$sql);
    if($resp){
        $ruta = "../Datos/Usuarios/".$usuario;
        if(!mkdir($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta)));
        $ruta .= "/Foto";
        if(!mkdir($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta)));
        session_start();
        $_SESSION['usuario'] = $usuario;
        $_SESSION['activo'] = 0;
        $_SESSION['nivel'] = 1;
        $_SESSION['rutaPerfil'] = "../Imagenes/sinPerfil.png";
        $_SESSION['bievenido'] = true;
        $_SESSION['activado'] = false;
        echo json_encode(array("error" => false));
    } 
    else echo json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion)));
?>