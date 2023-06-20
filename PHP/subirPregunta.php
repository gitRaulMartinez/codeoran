<?php
    include ('tiempo.php');
    $fechaHoy = devolverFecha($hoy);
    $horaHoy = devolverHora($hoy);
    session_start();
    include ('conexion.php');
    include ('funciones.php');
    if(isset($_SESSION['usuario'])){ 
        $nivel = nivelUsuario($conexion,$_SESSION['usuario']);
        $usuario = $_SESSION['usuario'];
    }
    else die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra logueado")));
    $idTorneo = $_POST['idTorneo'];
    if($nivel < 2){
        $inscripto = usuarioInscriptoTorneo($conexion,$usuario,$idTorneo);
        if($inscripto == 0) die(json_encode(array("error" => true,"mensaje" => "Usuario no registrado","descripcion" => "Usuario no se ha registrado en el torneo")));
    }
    if($_POST['metodo'] == 'Subir'){
        $fecha = $fechaHoy.' '.$horaHoy;
        $idProblema = $_POST['problema']; 
        $pregunta = $_POST['pregunta'];
        $sql = "INSERT INTO BD.preguntas (usuario,pregunta,problema,fecha,responde) VALUE('$usuario','$pregunta',$idProblema,'$fecha',null);";
        $resp = mysqli_query($conexion,$sql);
        if($resp) echo json_encode(array("error"=> false, "mensaje" => "Pregunta subida"));
        else die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
    
    if($_POST['metodo'] == 'Editar'){
        if($nivel == 1){
            /*Verificacion de tiempo*/
            $idPregunta = $_POST['id'];
            $sql = "SELECT * FROM BD.preguntas WHERE idPregunta = $idPregunta;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            while($datos = mysqli_fetch_array($resp)){
                $tiempoHoy = strtotime($fechaHoy." ".$horaHoy);
                $tiempoPregunta = strtotime($datos['fecha']);
                if(($tiempoHoy - $tiempoPregunta)<=900 && $datos['usuario'] == $usuario){
                    $editar = true;
                }
                else{
                    $editar = false;
                }
            }
            if(!$editar) die(json_encode(array("error" => true, "mensaje" => "Tiempo de editar no valido", "descripcion" => "El tiempo para editar ha sido superado o el usuario no coincide con el de la pregunta")));
            /*Fin de verificacion de tiempo*/
            $idProblema = $_POST['problema'];
            $pregunta = $_POST['pregunta'];
            $sql = "UPDATE BD.preguntas SET problema = $idProblema , pregunta = '$pregunta' WHERE idPregunta = $idPregunta;";
            $resp = mysqli_query($conexion,$sql);
            if($resp) echo json_encode(array("error"=> false, "mensaje" => "Pregunta modificada con exito"));
            else die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
        else{
            $respuesta = $_POST['respuesta'];
            $idRespuesta = $_POST['idRespuesta'];
            $sql = "UPDATE BD.preguntas SET pregunta = '$respuesta' WHERE idPregunta = $idRespuesta;";
            $resp = mysqli_query($conexion,$sql);
            if($resp) echo json_encode(array("error"=> false, "mensaje" => "Respuesta modificada con exito"));
            else die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
    }
    
    if($_POST['metodo'] == 'Responder'){ 
        if($nivel < 2) die(json_encode(array("error" => true, "mensaje" => "Error nivel", "descripcion" => "El nivel actual del usuario no es valido")));
        $fecha = $fechaHoy.' '.$horaHoy;
        $idProblema = $_POST['problema']; 
        $respuesta = $_POST['respuesta'];
        $idPregunta = $_POST['idPregunta'];
        $sql = "INSERT INTO BD.preguntas (usuario,pregunta,problema,fecha,responde) VALUE('$usuario','$respuesta',$idProblema,'$fecha',$idPregunta);";
        $resp = mysqli_query($conexion,$sql);
        if($resp) echo json_encode(array("error"=> false, "mensaje" => "Respuesta subida"));
        else die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
?>