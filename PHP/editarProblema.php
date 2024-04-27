<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));
    if($_POST['metodo']=='guardar'){
        $titulo = $_POST['titulo'];
        $idTorneo = $_POST['idTorneo'];
        $letra = $_POST['letra'];
        $limite = $_POST['limite'];
        $idProblema = $_POST['idProblema'];
        $descripcion = $_POST['descripcion'];
        $entrada = $_POST['entrada'];
        $salida = $_POST['salida'];
        $testPublico = $_POST['testPublico'];

        /* Obtener letra del problema */
        $sql = "SELECT letra FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)) $ultimaLetra = $dato['letra'];

        /* Operacion de re-acomodacion de letras */
        if(ord($letra) != ord($ultimaLetra)){
            if(ord($letra)<ord($ultimaLetra)){
                /* Menor */
                $sql = "UPDATE BD.problemas SET letra = CHAR(ASCII(letra)+1) WHERE torneo = $idTorneo AND letra >= '$letra' AND letra < '$ultimaLetra' ORDER BY letra;";
                $resp = mysqli_query($conexion,$sql);
                if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            }
            else{
                /* Mayor */
                $sql = "UPDATE BD.problemas SET letra = CHAR(ASCII(letra)-1) WHERE torneo = $idTorneo AND letra <= '$letra' AND letra > '$ultimaLetra' ORDER BY letra;";
                $resp = mysqli_query($conexion,$sql);
                if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
            }
        }
        /* Actualizar Datos */
        $sql = "UPDATE BD.problemas SET titulo = '$titulo', limite = $limite, letra = '$letra', testPublico = $testPublico WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));

        $ruta = "../Datos/Problemas/".$idProblema."/datos/descripcion.txt";
        $file = fopen($ruta, "w");
        if(!$file) die(json_encode(array("error" => true,"mensaje" => "Error de archivos","descripcion" => "No se pude acceder al archivo: ".$ruta)));
        else fwrite($file, $descripcion . PHP_EOL);
        fclose($file);

        $ruta = "../Datos/Problemas/".$idProblema."/datos/entrada.txt";
        $file = fopen($ruta, "w");
        if(!$file) die(json_encode(array("error" => true,"mensaje" => "Error de archivos","descripcion" => "No se pude acceder al archivo: ".$ruta)));
        else fwrite($file, $entrada . PHP_EOL);
        fclose($file);

        $ruta = "../Datos/Problemas/".$idProblema."/datos/salida.txt";
        $file = fopen($ruta, "w");
        if(!$file) die(json_encode(array("error" => true,"mensaje" => "Error de archivos","descripcion" => "No se pude acceder al archivo: ".$ruta)));
        else fwrite($file, $salida . PHP_EOL);
        fclose($file);
        echo json_encode(array("error" => false, "mensaje" => "Problema modificado"));
    }
    if($_POST['metodo'] == "eliminar"){
        $idProblema = $_POST['idProblema'];
        $idTorneo = $_POST['idTorneo'];
        /* Obtener letra del problema */
        $sql = "SELECT letra FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)) $letraEliminada = $dato['letra'];

        $sql = "DELETE FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));

        $sql = "UPDATE BD.problemas SET letra = CHAR(ASCII(letra)-1) WHERE torneo = $idTorneo AND letra > '$letraEliminada';";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        
        $ruta = "../Datos/Problemas/".$idProblema;

        eliminarContenidoCarpeta($ruta."/datos");
        eliminarContenidoCarpeta($ruta."/in");
        eliminarContenidoCarpeta($ruta."/out");
        eliminarContenidoCarpeta($ruta."/solucion");
        eliminarContenidoCarpeta($ruta."/time");

        if(!rmdir($ruta."/datos")) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta."/datos")));
        if(!rmdir($ruta."/in")) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta."/in")));
        if(!rmdir($ruta."/out")) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta."/out")));
        if(!rmdir($ruta."/solucion")) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta."/solucion")));
        if(!rmdir($ruta."/time")) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta."/time")));

        if(!rmdir($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error en eliminacion de directorios", "descripcion" => "No se pudo eliminar la carpeta ".$ruta)));
        echo json_encode(array("error" => false, "mensaje" => "Problema eliminado"));
    }
    if($_POST['metodo'] == "eliminar-archivo-solucion"){
        $idProblema = $_POST['idProblema'];
        eliminarContenidoCarpeta("../Datos/Problemas/".$idProblema."/solucion");
        echo json_encode(array("error" => false));
    }
?>