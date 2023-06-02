<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $idTorneo = $_POST['idTorneo'];


    if(isset($_SESSION['usuario'])){ 
        $nivel = nivelUsuario($conexion,$_SESSION['usuario']);
    }
    else die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra logueado")));

    if($nivel == 0) die(json_encode(array("error" => true, "mensaje" => "Error Nivel", "descripcion" => "El usuario se encuentra bloqueado")));
    $estado = estadoTorneo($conexion,$idTorneo,$hoy);
    if($estado == 0) die(json_encode(array("error" => false, "envio" => false, "mensaje" => "Torneo sin iniciar")));
    if($estado == 2) die(json_encode(array("error" => false, "envio" => false, "mensaje" => "Torneo finalizado")));
    
    if(!isset($_FILES['archivo'])) die(json_encode(array("error" => false,"envio" => false, "mensaje" => "Ningun archivo subido")));
    
    $nombreArchivo = $_FILES['archivo']['name'];
    $usuario = $_SESSION['usuario'];
    $idProblema = $_POST['idProblema'];
    if($_FILES["archivo"]["error"]>0){
        die(json_encode(array("error" => false,"envio" => false, "mensaje" => "Falla en el archivo")));
    }
    else{
        $limitKB = 10000;
        if($_FILES["archivo"]["size"]<=$limitKB){
            if($_FILES["archivo"]["type"] == "text/x-csrc" || $_FILES["archivo"]["type"] == "text/x-c++src" || $_FILES["archivo"]["type"] == "text/x-java" || $_FILES["archivo"]["type"] == "text/x-python"){
                if($_FILES["archivo"]["type"] == "text/x-csrc") $lenguaje = 'C';
                if($_FILES["archivo"]["type"] == "text/x-c++src") $lenguaje = 'C++';
                if($_FILES["archivo"]["type"] == "text/x-java") $lenguaje = 'Java';
                if($_FILES["archivo"]["type"] == "text/x-python") $lenguaje = 'Python';
                /*Cargar el envio en la Base de Datos*/
                $cantidad = numeroDeRespuestas($conexion,$idProblema,$usuario,'Aceptado');
                if($cantidad == 0){
                    $fechaEnvio = devolverFecha($hoy);
                    $horaEnvio = devolverHora($hoy);
                    $sql = "INSERT INTO BD.envios (problema,usuario,fechaEnvio,horaEnvio,respuesta,tiempo,archivo,lenguaje) VALUE($idProblema,'$usuario','$fechaEnvio','$horaEnvio','En espera',0,'$nombreArchivo','$lenguaje');";
                    $resp = mysqli_query($conexion,$sql);
                    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
                    $sql = "SELECT MAX(idEnvio) as idMax FROM BD.envios WHERE usuario = '$usuario' AND problema = $idProblema;";
                    $resp = mysqli_query($conexion,$sql);
                    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
                    while($row = mysqli_fetch_array($resp)) $idEnv = $row['idMax'];
                    /*Crear carpeta y guardar el archivo*/
                    $archivo = "../Datos/Envios/".$idEnv;
                    if(!mkdir($archivo)) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$archivo))); 
                    $archivo .= "/".$nombreArchivo;
                    $mover = move_uploaded_file($_FILES["archivo"]["tmp_name"],$archivo); 
                    if(!$mover) die(json_encode(array("error" => false,"envio" => false, "mensaje" => "No se pudo enviar el archivo")));
                    else echo json_encode(array("error" => false,"envio" => true, "mensaje" => "Archivo subido", "idEnvio" => $idEnv));
                }
                else{
                    die(json_encode(array("error" => false,"envio" => false, "mensaje" => "Problema ya resuelto")));
                }
            }
            else{
                die(json_encode(array("error" => false,"envio" => false, "mensaje" => "Extension del archivo no valida")));
            }
        }
        else{
            die(json_encode(array("error" => false,"envio" => false, "mensaje" => "Archivo subido muy pesado")));
        }
    }
?>