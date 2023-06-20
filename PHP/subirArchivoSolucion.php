<?php
    include ('conexion.php');
    include ('funciones.php');
    include ('juezLib.php');
    $idProblema = $_POST['idProblema'];
    if($_FILES["archivo"]["error"] > 0) die(json_encode(array("error" => "Error al subir el archivo", "mensaje" => "Error al subir el archivo", "descripcion" => "No se pudo subir el archivo")));
    if($_FILES["archivo"]["size"] > 10000) die(json_encode(array("error" => "Tamaño del archivo excedido", "mensaje" => "Tamaño del archivo excedido", "descripcion" => "El archivo subido es muy pesado, super el limite permitido")));
    if($_FILES["archivo"]["type"] == "text/x-csrc" || $_FILES["archivo"]["type"] == "text/x-c++src" || $_FILES["archivo"]["type"] == "text/x-java" || $_FILES["archivo"]["type"] == "text/x-python"){
        $ruta = '../Datos/Problemas/'.$idProblema.'/solucion';
        eliminarContenidoCarpeta($ruta);
        $ext = obtenerExtension($_FILES["archivo"]["name"]);
        $archivo = $ruta.'/'.$_FILES["archivo"]["name"];
        $mover = move_uploaded_file($_FILES['archivo']["tmp_name"],$archivo);
        if(!$mover) die(json_encode(array("error" => "No se pudo mover el archivo", "mensaje" => "No se pudo mover el archivo", "descripcion" => "Error al intentar mover el archivo al servidor")));
        
        echo json_encode(array("uploaded" => true, "mensaje" => "Codigo subido correctamente", "ext" => $ext, "nombre" => $_FILES["archivo"]["name"]));
    }
    else die(json_encode(array("error" => "Tipo de archivo no permitido", "mensaje" => "Tipo de archivo no permitido", "descripcion" => "EL archivo subido no posee una extension valida")));
?>