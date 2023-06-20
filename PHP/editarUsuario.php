<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $usuario = $_POST['usuario'];
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));
    if(!verificacionModificarUsuario($conexion,$usuario,$usuarioAdmin)) die(json_encode(array("error" => false, "editar" => false)));
    if($_POST['metodo'] == 'perfil'){
        /*Aqui solo puede estar las eliminaciones*/
        $sql = "SELECT foto FROM BD.usuarios WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_array($resp)) $ruta = "../Datos/Usuarios/".$usuario."/Foto/".$dato['foto'];
        if(file_exists($ruta)) exec("../Bash/borrarArchivo.sh ".$ruta);
        $sql = "UPDATE BD.usuarios SET foto='not' WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "editar" => true, "rutaSinPerfil" => "../Imagenes/sinPerfil.png"));
    }
    if($_POST['metodo'] == 'correo'){
        $correo = $_POST['correo'];
        $sql = "UPDATE BD.usuarios SET correo = '$correo' WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "editar" => true));
    }
    if($_POST['metodo'] == 'pais'){
        $pais = $_POST['pais'];
        $sql = "UPDATE BD.usuarios SET pais = '$pais' WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "editar" => true));
    }
    if($_POST['metodo'] == 'nivel'){
        $nivelAdmin = nivelUsuario($conexion,$usuarioAdmin);
        $nivel = intval($_POST['nivel']);
        if($nivel >= 2){
            if($nivelAdmin > 2){
                $sql = "UPDATE BD.usuarios SET nivel = $nivel WHERE usuario = '$usuario';";
                $resp = mysqli_query($conexion,$sql);
                if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
                echo json_encode(array("error" => false, "editar" => true, "mensaje" => false));
            }
            else{
                die(json_encode(array("error" => false, "editar" => true, "mensaje" => true)));
            }
        }
        else{
            $sql = "UPDATE BD.usuarios SET nivel = $nivel WHERE usuario = '$usuario';";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            echo json_encode(array("error" => false, "editar" => true, "mensaje" => false));
        }
        
    }
?>