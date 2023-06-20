<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $usuario = $_POST['usuario'];
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina"))); 
    $sql = "SELECT * FROM BD.usuarios,BD.paises WHERE id = pais AND usuario = '$usuario'; ";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    else{
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
                'idPais' => $row['pais'],
                'foto' => $ruta,
                'fotoBandera' => $banderaFoto,
                'fechaDeCreacion' => $row['fechaDeCreacion'],
                'ultimaConexion' => $row['ultimaConexion'],
                'activo' => $row['activo'],
                'nivel' => $row['nivel']
            );
        }
        echo json_encode(array("error" => false, "datoUsuario" => $datoUsuario));
    }
?>