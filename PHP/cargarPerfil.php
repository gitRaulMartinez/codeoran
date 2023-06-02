<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $usuario = $_POST['idUsuario'];
    $banderaEdit = false;
    if(isset($_SESSION['usuario'])) if($usuario == $_SESSION['usuario']) $banderaEdit = true;
    $sql = "SELECT * FROM BD.usuarios,BD.paises WHERE id = pais AND usuario = '$usuario'; ";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp){
        die('Error');
    }
    else{
        while($row = mysqli_fetch_array($resp)){
            if($row['foto']=="not") $ruta = "../Imagenes/sinPerfil.png";
            else $ruta = "../Datos/Usuarios/".$row['usuario']."/Foto/".$row['foto'];
            $valores = array(
                'usuario' => $row['usuario'],
                'correo' => $row['correo'],
                'pais' =>$row['nombre'],
                'idPais' => $row['pais'],
                'foto' => $ruta,
                'fechaDeCreacion' => $row['fechaDeCreacion'],
                'ultimaConexion' => $row['ultimaConexion'],
                'banderaEdit' => $banderaEdit,
                'activo' => $row['activo'],
                'nivel' => $row['nivel'],
                'participaciones' => participaciones($conexion,$usuario),
                'problemasResueltos' => numeroDeProblemasResueltos($conexion,$usuario),
                'torneoGanados' => cantidadTorneoGanado($conexion,$usuario)
            );
        }
        echo json_encode($valores);
    }
?>