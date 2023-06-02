<?php
    function estadoTorneo($conexion,$idTorneo,$hoy){
        $fechaHoy = devolverFecha($hoy);
        $horaHoy = devolverHora($hoy); 
        $sqlTorneo = "SELECT idTorneo,nombre,fechaInicio,horaInicio,duracion,DATE_FORMAT(DATE_ADD(CONCAT(CONCAT(fechaInicio,' '),horaInicio),INTERVAL duracion HOUR_SECOND) , '%Y-%c-%d %H:%i:%S') as fechaFin FROM BD.torneos WHERE idTorneo = $idTorneo";
        $respTorneo = mysqli_query($conexion,$sqlTorneo);
        if(!$respTorneo) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));;;;
        while($rowTorneo = mysqli_fetch_array($respTorneo)){
            $fechaTorneo = $rowTorneo['fechaInicio'];
            $horaTorneo = $rowTorneo['horaInicio'];
            $fechaFin = $rowTorneo['fechaFin'];
        }
        $tiempoHoy = strtotime($fechaHoy." ".$horaHoy);
        $tiempoTorneo = strtotime($fechaTorneo." ".$horaTorneo);
        $tiempoFinTorneo = strtotime($fechaFin);

        if($tiempoHoy < $tiempoTorneo){ 
            return 0;
        }
        else{
            if($tiempoHoy <= $tiempoFinTorneo){
                return 1;
            } 
            else{
                return 2;
            }
        }
    }

    function nivelUsuario($conexion,$usuario){
        $sqlNivel = "SELECT nivel FROM BD.usuarios WHERE usuario = '$usuario';";
        $respNivel = mysqli_query($conexion,$sqlNivel);
        if(!$respNivel) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($rowNivel = mysqli_fetch_array($respNivel)) $nivel = intval($rowNivel['nivel']);
        return $nivel;
    }

    function numeroDeRespuestasTotal($conexion,$idTorneo,$usuario,$respuesta){
        $sqlTotal = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON idProblema = problema AND torneo = $idTorneo WHERE usuario = '$usuario' AND respuesta = '$respuesta'";
        $respTotal = mysqli_query($conexion,$sqlTotal);
        if(!$respTotal) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        return intval(mysqli_num_rows($respTotal));
    }

    function numeroDeRespuestas($conexion,$idProblema,$usuario,$respuesta){
        $sqlTotal = "SELECT * FROM BD.envios WHERE problema = $idProblema AND respuesta = '$respuesta' AND usuario = '$usuario';";
        $respTotal = mysqli_query($conexion,$sqlTotal);
        if(!$respTotal) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        return intval(mysqli_num_rows($respTotal));
    }

    function numeroDeRespuestasNo($conexion,$idProblema,$usuario,$respuesta){
        $sqlTotal = "SELECT * FROM BD.envios WHERE problema = $idProblema AND respuesta != '$respuesta' AND usuario = '$usuario';";
        $respTotal = mysqli_query($conexion,$sqlTotal);
        if(!$respTotal) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        return intval(mysqli_num_rows($respTotal));
    }

    function tiempoMinimoProblema($conexion,$idProblema,$usuario){
        $sqlTotal = "SELECT MIN(tiempo) as tiempoMinimo FROM BD.envios WHERE problema = $idProblema AND respuesta = 'Aceptado' AND usuario = '$usuario';";
        $respTotal = mysqli_query($conexion,$sqlTotal);
        if(!$respTotal) return -1;
        if(mysqli_num_rows($respTotal)){
            while($dato = mysqli_fetch_array($respTotal)) return intval($dato['tiempoMinimo']);
        }
        else{
            return 0;
        }
    }

    function compareResultado($a,$b){
        if($a[sizeof($a)-2] == $b[sizeof($b)-2]){
            if($a[sizeof($a)-1] > $b[sizeof($b)-1]) return true;
            else return false;
        }
        else{
            if($a[sizeof($a)-2] < $b[sizeof($b)-2]) return true;
            else return false;
        }
    }

    function posicionTabla($conexion,$idTorneo,$usuario){
        $nivel = nivelUsuario($conexion,$usuario);
        $sqlRank = "SELECT BD.usuarios.usuario as usuarioResultado,BD.paises.nombre as paisResultado FROM BD.usuarios INNER JOIN BD.paises ON id = pais INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo WHERE BD.usuarios.nivel = $nivel;";
        $respRank = mysqli_query($conexion,$sqlRank);
        if(!$respRank) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $listaPosicion = [];
        while($dato = mysqli_fetch_array($respRank)){
            $fila = [];
            $fila []= $dato['usuarioResultado'];
            $sqlProblemas = "SELECT idProblema FROM BD.problemas WHERE torneo = $idTorneo;";
            $respProblemas = mysqli_query($conexion,$sqlProblemas);
            if(!$respProblemas) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            $totalRespuestasCorrectas = 0;
            $tiempoDePenalizacion = 0;
            while($datoProblema = mysqli_fetch_array($respProblemas)){
                $numeroAceptados = numeroDeRespuestas($conexion,$datoProblema['idProblema'],$dato['usuarioResultado'],'Aceptado');
                if($numeroAceptados){
                    $totalRespuestasCorrectas++;
                    $tiempoDePenalizacion += tiempoMinimoProblema($conexion,$datoProblema['idProblema'],$dato['usuarioResultado']);
                }
            }
            $fila []= $totalRespuestasCorrectas;
            $fila []= $tiempoDePenalizacion;
            $listaPosicion []= $fila;
        }
        uasort($listaPosicion,'compareResultado');
        $pos = 1;
        foreach($listaPosicion as $fila){
            if($fila[0] == $usuario) return $pos;
            $pos++;
        }
        return 0;
    }

    function ultimosEnvios($conexion,$idTorneo,$usuario){
        $sqlEnvio = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON idProblema = problema AND torneo = $idTorneo WHERE usuario = '$usuario' ORDER BY idEnvio DESC LIMIT 5";
        $respEnvio = mysqli_query($conexion,$sqlEnvio);
        if(!$respEnvio) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $lista = [];
        while($dato = mysqli_fetch_array($respEnvio)){
            $datoProblema['idEnvio'] = $dato['idEnvio'];
            $datoProblema['letra'] = $dato['letra'];
            $datoProblema['nombre'] = $dato['titulo'];
            if($dato['respuesta'] == 'Aceptado'){
                $datoProblema['resultado'] = '<i class="bi bi-check-lg text-success"></i>';
            }
            else{
                if($dato['respuesta'] == 'En espera') $datoProblema['resultado'] = '<i class="bi bi-question-circle"></i>';
                else $datoProblema['resultado'] = '<i class="bi bi-x-lg text-danger"></i>';
            }
            $datoProblema['respuesta'] = $dato['respuesta'];
            $lista []= $datoProblema;
        }
        return $lista;
    }

    function usuarioInscriptoTorneo($conexion,$usuario,$idTorneo){
        $sqlInscripto = "SELECT * FROM BD.inscripcion WHERE usuario = '$usuario' AND torneo = $idTorneo;";
        $respInscripto = mysqli_query($conexion,$sqlInscripto);
        if(!$respInscripto) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        return mysqli_num_rows($respInscripto);
    }

    function controlPaginaAdministrador($conexion,$usuario){
        $nivel = nivelUsuario($conexion,$usuario);
        if($nivel>1){
            return true;
        }
        else{
            return false;
        }
    }

    function verificacionModificarUsuario($conexion,$usuario,$usuarioAdmin){
        $nivel = nivelUsuario($conexion,$usuario);
        $nivelAdmin = nivelUsuario($conexion,$usuarioAdmin);
        if($nivelAdmin > $nivel){
            return true;
        }
        else{
            return false;
        }
    }

    function verificacionNombreTorneo($conexion,$titulo){
        $sql = "SELECT * FROM BD.torneos WHERE nombre = '$titulo'";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
        if(intval(mysqli_num_rows($resp)) > 0){
            return false;
        }
        else{
            return true;
        }
    }

    function eliminarContenidoCarpeta($dir){
        $lista = scandir($dir);
        foreach($lista as $archivo){
            if($archivo != "." && $archivo != ".."){
                if(file_exists($dir."/".$archivo)) if(!unlink($dir."/".$archivo)) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar el archivo ".$dir."/")));
            }
        }
        return true;
    }

    function obtenerNumeroTest($archivo){
        $i = 0;
        $acu = 0;
        while($archivo[$i] != '.'){
            if(is_numeric($archivo[$i])){
                $acu = $acu * 10 + intval($archivo[$i]);
            }
            $i++;
        }
        return $acu;
    }

    function inscripciones($conexion,$usuario){
        $sql = "SELECT torneo FROM BD.inscripcion WHERE usuario = '$usuario'";
        $resp = mysqli_query($conexion,$sql);
        $lista = array();
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            $lista.array_push($lista,$dato['torneo']);
        }
        return $lista;
    }

    function participaciones($conexion,$usuario){
        $sql = "SELECT COUNT(torneo) as cantidad FROM BD.inscripcion WHERE usuario='$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            return $dato['cantidad'];
        }
        return 0;
    }

    function numeroDeProblemasResueltos($conexion,$usuario){
        $sql = "SELECT COUNT(idEnvio) as cantidad FROM BD.envios WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            return $dato['cantidad'];
        }
        return 0;
    }

    function cantidadTorneoGanado($conexion,$usuario){
        $sql = "SELECT torneo FROM BD.inscripcion WHERE usuario = '$usuario';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $cantidad = 0;
        while($dato = mysqli_fetch_assoc($resp)){
            if(posicionTabla($conexion,$dato['torneo'],$usuario) == 1){
                $cantidad++;
            }
        }
        return $cantidad;
    }
?>