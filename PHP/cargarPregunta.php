<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])){ 
        $nivel = nivelUsuario($conexion,$_SESSION['usuario']);
        $usuario = $_SESSION['usuario'];
    }
    else die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    $idPregunta = $_POST['idPregunta'];
    $sql = "SELECT * FROM BD.preguntas WHERE idPregunta = $idPregunta;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($datos = mysqli_fetch_array($resp)){
        date_default_timezone_set('America/Argentina/Salta');
        $hoy = getdate();
        $fechaHoy = $hoy['year']."-".$hoy['mon']."-".$hoy['mday'];
        $horaHoy = $hoy['hours'].":".$hoy['minutes'].":".$hoy['seconds'];
        $tiempoHoy = strtotime($fechaHoy." ".$horaHoy);
        $tiempoPregunta = strtotime($datos['fecha']);
        if(($tiempoHoy - $tiempoPregunta)<=900 && $datos['usuario'] == $usuario){
            $banderaEditar = true;
        }
        else{
            $banderaEditar = false;
        }
        $sqlRespuesta = "SELECT * FROM BD.preguntas WHERE responde is not null AND responde = $idPregunta;";
        $respRespuesta = mysqli_query($conexion,$sqlRespuesta);
        if(!$respRespuesta) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        if(intval(mysqli_num_rows($respRespuesta))){
            while($datosRespuesta = mysqli_fetch_array($respRespuesta)){
                if($usuario == $datosRespuesta['usuario']) $banderaEditarRespuesta = true;
                else $banderaEditarRespuesta = false;
                $respuesta = array(
                    "idRespuesta" => $datosRespuesta['idPregunta'],
                    "usuario" => $datosRespuesta['usuario'],
                    "preguntaRespuesta" => $datosRespuesta['pregunta'],
                    "banderaEditarRespuesta" => $banderaEditarRespuesta
                );
            }
            $banderaResponder = true;
        }
        else{
            $banderaResponder = false;
            $respuesta = array();
        }
        $consulta = array(
            "idPregunta" => $datos['idPregunta'],
            "usuario" => $datos['usuario'],
            "pregunta" => $datos['pregunta'],
            "problema" => $datos['problema'],
            "banderaEditar" => $banderaEditar,
            "banderaResponder" => $banderaResponder,
            "datosRespuesta" => $respuesta,
            "nivel" => $nivel
        );
    }
    echo json_encode(array("error" => false, "pregunta" => $consulta));
?>