<?php
    include('conexion.php');
    session_start();
    $nombreUsuario = $_SESSION['usuario'];
    if($_FILES["archivo"]["error"]>0 ){
        echo json_encode(array("error" => true, "mensaje" => "Fallo al cargar la imagen", "descripcion" => "Error en la cargar de imagen"));
    }
    else{
        $limitKB = 1000000;
        if($_FILES["archivo"]["size"]<=$limitKB){
            if($_FILES["archivo"]["type"]=="image/gif" || $_FILES["archivo"]["type"]=="image/png" || $_FILES["archivo"]["type"]=="image/jpeg"){
                $sql = "SELECT foto FROM BD.usuarios WHERE usuario='$nombreUsuario';";
                $resp = mysqli_query($conexion,$sql);
                if($resp){
                    $eliminar = true;
                    while($row = mysqli_fetch_array($resp)){
                        if($row['foto'] == 'not') $eliminar = false;
                        else $rutaEliminar = "../Datos/Usuarios/".$nombreUsuario."/Foto/".$row['foto'];
                    }
                    if($eliminar) if(file_exists($rutaEliminar)) exec("../Bash/borrarArchivo.sh ".$rutaEliminar);
                    $numeroRandom = strval(rand(1000,9999));
                    switch($_FILES["archivo"]["type"]){
                        case "image/gif":   $ruta = "../Datos/Usuarios/".$nombreUsuario."/Foto/perfil".$numeroRandom.".gif";
                                            $nombreArchivo = "perfil".$numeroRandom.".gif";
                                            break;
                        case "image/png":   $ruta = "../Datos/Usuarios/".$nombreUsuario."/Foto/perfil".$numeroRandom.".png";
                                            $nombreArchivo = "perfil".$numeroRandom.".png";
                                            break;
                        case "image/jpeg":  $ruta = "../Datos/Usuarios/".$nombreUsuario."/Foto/perfil".$numeroRandom.".jpg"; 
                                            $nombreArchivo = "perfil".$numeroRandom.".jpg";
                                            break; 
                    }
                    $resultado = move_uploaded_file($_FILES["archivo"]["tmp_name"],$ruta);
                    $sql = "UPDATE BD.usuarios SET foto='$nombreArchivo' WHERE usuario='$nombreUsuario';";
                    $resp = mysqli_query($conexion,$sql);
                    if($resultado && $resp){
                        $_SESSION['rutaPerfil'] = $ruta;
                        echo json_encode(array("error" => false,"mensaje" => "Imagen Modificada" , "ruta" => $ruta));
                    }
                    else{ 
                        echo json_encode(array("error" => true, "mensaje" => "Error de guardado", "descripcion" => "No se pudo guardar la imagen en el directorio donde corresponde"));
                    }
                }
                else{
                    echo json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion)));
                }
            }
            else{
                echo json_encode(array("error" => true, "mensaje" => "Tipo de archivo no permitido", "descripcion" => "El archivo recibido no pertenece al conjunto de imagenes que aceptamos"));
            }
        }
        else{
            json_encode(array("error" => true, "mensaje" => "Imagen muy pesada", "descripcion" => "El archivo recibido es muy pesado"));
        }
    }
?>