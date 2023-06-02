<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $idTorneo = $_POST['idTorneo'];
    $estado = estadoTorneo($conexion,$idTorneo,$hoy);
    if($estado == 0) die(json_encode(array("error" => false, "mostrar" => false)));
    if(isset($_SESSION['usuario'])) $usuario = $_SESSION['usuario'];
    else die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    $sql = "SELECT * FROM BD.problemas WHERE torneo = $idTorneo ORDER BY letra";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    if($_POST['tabla'] == 'SI'){
        $arreglo['data'] = [];
        while($data = mysqli_fetch_assoc($resp)){
            $idProblema = $data['idProblema'];
            $sqlAceptado = "SELECT * FROM BD.envios WHERE problema = $idProblema AND usuario = '$usuario';";
            $respAceptado = mysqli_query($conexion,$sqlAceptado);
            if(!$respAceptado) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            $banderaAceptado = false; $banderaError = false;
            while($datoAceptado = mysqli_fetch_assoc($respAceptado)){
                if($datoAceptado['respuesta']=='Aceptado'){
                    $banderaAceptado = true;
                }
                else{
                    $banderaError = true;
                }
            }
            if($banderaAceptado){
                $data['DT_RowClass'] = 'colorAceptado';
            }
            else{
                if($banderaError){
                    $data['DT_RowClass'] = 'colorError';
                }
            }
            $data['DT_RowClass'] .= ' align-middle';
            $data['DT_RowAttr'] = (object) array("idProblema" => $idProblema);
            $data['envio'] = '<button type="button" class="btn btn-primary btn-sm accionEnvio">Enviar <i class="bi bi-file-earmark-arrow-up"></i></button>';
            $data['verproblema'] = '<a href="problema.html?idTorneo='.$idTorneo.'&idProblema='.$idProblema.'" target="_blank" type="button" class="btn btn-secondary btn-sm">Ver Problema</button>';
            $arreglo['data'] []= $data;
        }
        echo json_encode($arreglo);
    }
    else{
        $json = array();
        while($row = mysqli_fetch_array($resp)) {
            $json []= array(
                "idProblema" => $row["idProblema"],
                "titulo" => $row["titulo"],
                "letra" => $row["letra"]
            );
        }
        echo json_encode(array("error" => false, "mostrar" => true, "lista" => $json));
    }
    
?>