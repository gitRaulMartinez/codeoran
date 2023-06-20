<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if($_POST['metodo']=='admin'){
        if(isset($_SESSION['usuario'])){
            $usuario = $_SESSION['usuario'];
        }
        else die("Error Sesion"); 
        if(!controlPaginaAdministrador($conexion,$usuario)) die("Error admin"); 
        $sql = "SELECT * FROM BD.torneos;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $arreglo['data'] = [];
        while($dato = mysqli_fetch_assoc($resp)){
            switch(intval($dato['nivelTorneo'])){
                case 0: $nivelTorneo = "Bloqueado";
                        break;
                case 1: $nivelTorneo = "Pausado";
                        break;
                case 2: $nivelTorneo = "Publico";
                        break;
            }
            $dato['nivelTorneoCartel'] = $nivelTorneo;
            $dato['DT_RowClass'] = 'align-middle';
            $dato['DT_RowAttr'] = (object) array("idTorneo" => $dato['idTorneo']);
            $dato['configurar'] = '<a href="editorTorneo.html?idTorneo='.$dato['idTorneo'].'" target="_blank" type="button" class="btn btn-outline-dark btn-sm configurar-torneo" title="Editar torneo"><i class="bi bi-gear"></i></a>';
            $dato['estadistica'] = '<a href="estadistica.html?idTorneo='.$dato['idTorneo'].'" target="_blank" type="button" class="btn btn-outline-dark btn-sm estadistica-torneo" title="Estadistica del torneo"><i class="bi bi-graph-up"></i></a>';
            $arreglo['data'] []= $dato;
        }
        echo json_encode($arreglo);
    }
    if($_POST["metodo"]=="tabla"){
        if(isset($_SESSION['usuario'])){
            $sesion = true;
            if($_SESSION['activo']) $activo = true;
            else $activo = false;
            $lista = inscripciones($conexion,$_SESSION['usuario']);
        }
        else $sesion = false;
        $sql = "SELECT idTorneo,nombre,fechaInicio,horaInicio,duracion,DATE_FORMAT(DATE_ADD(CONCAT(CONCAT(fechaInicio,' '),horaInicio),INTERVAL duracion HOUR_SECOND) , '%Y-%c-%d %H:%i:%S') as fechaFin,COUNT(idProblema) as numeroProblema FROM BD.torneos LEFT JOIN BD.problemas ON torneo = idTorneo WHERE nivelTorneo = 2 GROUP BY idTorneo;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $arreglo['data'] = [];
        while($dato = mysqli_fetch_assoc($resp)){
            $dato['estado'] = estadoTorneo($conexion,$dato['idTorneo'],$hoy);
            $dato['DT_RowClass'] = 'align-middle';
            $dato['DT_RowAttr'] = (object) array("idTorneo" => $dato['idTorneo']);
            if($sesion){ 
                if($activo){
                    switch($dato['estado']){
                        case 0: if(in_array($dato['idTorneo'],$lista)){
                                    $dato['enlace'] = '<a href="torneo.html?idTorneo='.$dato['idTorneo'].'" class="btn btn-primary" target="_blank">Ingresar</a>';
                                }
                                else{
                                    $dato['enlace'] = '<a href="#RegistroTorneo" class="btn btn-success accionNombreTorneo" data-bs-toggle="modal" data-bs-target="#modalRegistrarseTorneo">Registrarse</a>';
                                }
                                break;
                        case 1: $dato['enlace'] = '<a href="torneo.html?idTorneo='.$dato['idTorneo'].'" class="btn btn-primary" target="_blank">Ingresar</a>'; break;
                        case 2: $dato['enlace'] = '<a href="torneo.html?idTorneo='.$dato['idTorneo'].'" class="btn btn-primary" target="_blank">Ingresar</a>'; break;
                    }
                }
                else{
                    switch($dato['estado']){
                        case 0: $dato['enlace'] = '<a href="#Session" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Registrarse</a>'; break;
                        case 1: $dato['enlace'] = '<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Ingresar</a>'; break;
                        case 2: $dato['enlace'] = '<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalActivarCuenta">Ingresar</a>'; break;
                    }
                }
                
            }
            else{
                switch($dato['estado']){
                    case 0: $dato['enlace'] = '<a href="#Session" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Registrarse</a>'; break;
                    case 1: $dato['enlace'] = '<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Ingresar</a>'; break;
                    case 2: $dato['enlace'] = '<a href="#Session" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalIniciarSesion">Ingresar</a>'; break;
                }
            }
            switch($dato['estado']){
                case 0: $dato['cartelEstado'] = "Inicia en"; break;
                case 1: $dato['cartelEstado'] = "Finaliza en"; break;
                case 2: $dato['cartelEstado'] = "Finalizado"; break;
            }
            $arreglo['data'] []= $dato;
        }
        echo json_encode($arreglo);
    } 
?>