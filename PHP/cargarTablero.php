<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])){
        $usuario = $_SESSION['usuario'];
        $nivel = nivelUsuario($conexion,$usuario);
    }
    else die("Error Sesion");
    $idTorneo = $_POST['idTorneo'];
    $sql = "SELECT BD.usuarios.usuario as usuarioResultado,BD.paises.nombre as paisResultado FROM BD.usuarios INNER JOIN BD.paises ON id = pais INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo WHERE BD.usuarios.nivel = 1;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die("Error Consulta de datos: ".mysqli_error($conexion));
    $arreglo["data"] = [];
    while($dato = mysqli_fetch_array($resp)){
        $fila = [];
        if($dato['usuarioResultado'] == $usuario){
            $fila []= $dato['usuarioResultado']." (Yo)";
        }
        else{
            $fila []= $dato['usuarioResultado'];
        }
        
        $fila []= $dato['paisResultado'];
        $sqlProblemas = "SELECT idProblema FROM BD.problemas WHERE torneo = $idTorneo;";
        $respProblemas = mysqli_query($conexion,$sqlProblemas);
        if(!$respProblemas) die("Error Consulta de datos: ".mysqli_error($conexion));
        $totalRespuestasCorrectas = 0;
        $tiempoDePenalizacion = 0;
        while($datoProblema = mysqli_fetch_array($respProblemas)){
            $numeroAceptados = numeroDeRespuestas($conexion,$datoProblema['idProblema'],$dato['usuarioResultado'],'Aceptado');
            $numeroNoAceptados = numeroDeRespuestasNo($conexion,$datoProblema['idProblema'],$dato['usuarioResultado'],'Aceptado');
            if($numeroAceptados){
                $fila []= '<i class="bi bi-check-lg text-success"></i>';
                $totalRespuestasCorrectas++;
                $tiempoDePenalizacion += tiempoMinimoProblema($conexion,$datoProblema['idProblema'],$dato['usuarioResultado']);
            }
            else{
                if($numeroNoAceptados){
                    $fila []= '<i class="bi bi-x-lg text-danger"></i>';
                }
                else{
                    $fila []= ' ';
                }
            }
        }
        $fila []= $totalRespuestasCorrectas;
        $fila []= $tiempoDePenalizacion;
        $arreglo["data"] []= $fila;
    }
    uasort($arreglo["data"],'compareResultado');
    $datos["data"] = [];
    $pos = 1;
    foreach($arreglo["data"] as $valor){
        $resultado = [];
        $resultado []= $pos;
        foreach($valor as $data){
            $resultado []= $data;
        }
        $resultado[sizeof($resultado)-1] = intval($resultado[sizeof($resultado)-1]/60);
        $datos["data"] []= $resultado;
        $pos++;
    }
    echo json_encode($datos);
?>