<?php
    include ('conexion.php');
    session_start();
    date_default_timezone_set('America/Argentina/Salta');
    $hoy = getdate();
    $fechaHoy = $hoy['year']."-".$hoy['mon']."-".$hoy['mday'];
    $horaHoy = $hoy['hours'].":".$hoy['minutes'].":".$hoy['seconds'];
    $ultimaConexion = $fechaHoy.' '.$horaHoy;
    $usuario = $_POST['usuario'];
    $pass = sha1($_POST['pass']);
    $sql = "SELECT * FROM BD.usuarios WHERE usuario = '$usuario' AND contra = '$pass';";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    if(mysqli_num_rows($resp)>0){
        while($row = mysqli_fetch_array($resp)) { 
            if(intval($row['nivel']) == 0){
                echo json_encode(array("error" => false, "estado" => true, "mensaje" => "Usuario Bloqueado"));
            }
            else{
                if($row['foto']=="not") $ruta = "../Imagenes/sinPerfil.png";
                else $ruta = "../Datos/Usuarios/".$row['usuario']."/Foto/".$row['foto'];
                $_SESSION['usuario'] = $row['usuario'];
                $_SESSION['activo'] = $row['activo'];
                $_SESSION['nivel'] = $row['nivel'];
                $_SESSION['bievenido'] = true;
                $_SESSION['activado'] = false;
                $_SESSION['rutaPerfil'] = $ruta;
                $sqlUpdate = "UPDATE BD.usuarios SET ultimaConexion = '$ultimaConexion' WHERE usuario = '$usuario';";
                $respUpdate = mysqli_query($conexion,$sqlUpdate);
                if($respUpdate) echo json_encode(array("error" => false, "estado" => true, "mensaje" => "Bievenido ".$row['usuario']));
                else echo json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion)));
            }
        }
    }
    else{
        echo json_encode(array("error" => false, "estado" => false));
    }
?>