<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])) $usuario = $_SESSION['usuario'];
    else die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    $idTorneo = $_POST['idTorneo'];
    $sql = "SELECT idPregunta,usuario,pregunta,titulo,letra,responde,DATE_FORMAT(fecha, '%d-%m-%Y %H:%i:%s') AS fecha FROM BD.preguntas INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo WHERE responde is null AND usuario = '$usuario' ORDER BY idPregunta DESC;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die("Error Consulta de datos: ".mysqli_error($conexion));
    $arreglo["data"] = [];
    $valor = 0;
    while($data = mysqli_fetch_assoc($resp)){
        $data['indice'] = $valor; $valor+=1;
        $data['acciones'] = "<button type='button' class='btn btn-primary btn-sm mx-1 verProblema' data-bs-toggle='modal' data-bs-target='#modalVerPregunta'>Ver pregunta</button>";
        $data['problemaTitulo'] = $data['letra'].' - '.$data['titulo'];
        $datosFechas = explode(' ',$data['fecha']);
        $data['fechaPregunta'] = $datosFechas[0];
        $data['horaPregunta'] = $datosFechas[1];
        $data['DT_RowClass'] = 'align-middle colorRowPregunta';
        $data['DT_RowAttr'] = (object) array("idPregunta" => $data['idPregunta']);
        $data['pregunta'] = "<span class = 'contenidoPregunta align-middle'>".$data['pregunta']."</span>";
        
        $idPregunta = $data['idPregunta'];
        $sqlRespuesta = "SELECT * FROM BD.preguntas WHERE responde = $idPregunta;";
        $respRespuesta = mysqli_query($conexion,$sqlRespuesta);
        if(!$respRespuesta) die("Error Consulta de datos: ".mysqli_error($conexion));
        if(mysqli_num_rows($respRespuesta)>0){
            while($datoR = mysqli_fetch_assoc($respRespuesta)){
                $data['respuesta'] = "<span class = 'contenidoPregunta align-middle'>".$datoR['pregunta']."</span>";
            }
        }
        else{
            $data['respuesta'] = "<span class = 'contenidoPregunta align-middle'>No respondido aún</span>";
        }

        $arreglo["data"] []= $data;
    }
    $sql = "SELECT idPregunta,usuario,pregunta,titulo,letra,responde,DATE_FORMAT(fecha, '%d-%m-%Y %H:%i:%s') AS fecha FROM BD.preguntas INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo WHERE responde is null AND usuario != '$usuario' ORDER BY idPregunta DESC;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die("Error Consulta de datos: ".mysqli_error($conexion));
    while($data = mysqli_fetch_assoc($resp)){
        $data['indice'] = $valor; $valor+=1;
        $data['acciones'] = "<button type='button' class='btn btn-primary btn-sm mx-1 verProblema' data-bs-toggle='modal' data-bs-target='#modalVerPregunta'>Ver pregunta</button>";
        $data['problemaTitulo'] = $data['letra'].' - '.$data['titulo'];
        $datosFechas = explode(' ',$data['fecha']);
        $data['fechaPregunta'] = $datosFechas[0];
        $data['horaPregunta'] = $datosFechas[1];
        $data['pregunta'] = "<span class = 'contenidoPregunta align-middle'>".$data['pregunta']."</span>";
        $data['DT_RowClass'] = 'align-middle';
        $data['DT_RowAttr'] = (object) array("idPregunta" => $data['idPregunta']);

        $idPregunta = $data['idPregunta'];
        $sqlRespuesta = "SELECT * FROM BD.preguntas WHERE responde = $idPregunta;";
        $respRespuesta = mysqli_query($conexion,$sqlRespuesta);
        if(!$respRespuesta) die("Error Consulta de datos: ".mysqli_error($conexion));
        if(mysqli_num_rows($respRespuesta)>0){
            while($datoR = mysqli_fetch_assoc($respRespuesta)){
                $data['respuesta'] = "<span class = 'contenidoPregunta align-middle'>".$datoR['pregunta']."</span>";
            }
        }
        else{
            $data['respuesta'] = "<span class = 'contenidoPregunta align-middle'>No respondido aún</span>";
        }

        $arreglo["data"] []= $data;
    }
    echo json_encode($arreglo);
?>