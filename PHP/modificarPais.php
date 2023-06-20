<?php
    session_start();
    if(!isset($_SESSION['usuario'])){
        die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra ningun usuario logueado")));
    }
    else{
        include ('conexion.php');
        $pais = $_POST['pais'];
        $usuario = $_SESSION['usuario'];
        $sql = "UPDATE BD.usuarios SET pais=$pais WHERE usuario='$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if($resp){
            $sql = "SELECT nombre FROM BD.paises WHERE id = $pais;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
            while($row = mysqli_fetch_array($resp)) $nombre = utf8_encode($row['nombre']);
            echo json_encode(array("error" => false, "mensaje" => utf8_encode("Pais modificado"), "nombre" => $nombre));
        }
        else{
            die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        }

    }
?>