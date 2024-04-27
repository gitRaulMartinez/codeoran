<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $torneo = $_POST['torneo'];
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina"))); 
    $sql = "SELECT BD.usuarios.usuario, nombre, foto
            FROM BD.inscripcion
            INNER JOIN BD.usuarios ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.usuarios.nivel = 1
            INNER JOIN BD.paises ON BD.paises.id = BD.usuarios.pais
            WHERE torneo = $torneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    else{
        $result = [];
        while($row = mysqli_fetch_array($resp)){
            if($row['foto']=="not"){ 
                $ruta = "../Imagenes/sinPerfil.png";
                $banderaFoto = false;
            }
            else{ 
                $ruta = "../Datos/Usuarios/".$row['usuario']."/Foto/".$row['foto'];
                $banderaFoto = true;
            }
            $datoUsuario = array(
                'usuario' => $row['usuario'],
                'correo' => $row['correo'],
                'pais' =>$row['nombre'],
                'foto' => $ruta,
                'fotoBandera' => $banderaFoto
            );

            $result[]= $datoUsuario;
        }
        echo json_encode(array("error" => false, "respuesta" => $result));
    }
?>