<?php
    include ('conexion.php');
    include ('funciones.php');
    include ('juezLib.php');
    session_start();
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));

    if($_POST['metodo'] == "subir"){
        $idProblema = $_POST['idProblema'];
        $n = intval($_POST['n']);
        $sql = "SELECT test,testPublico,testSalida FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($row = mysqli_fetch_array($resp)){
            $test = intval($row['test']);
            $testPublico = intval($row['testPublico']);
            $testSalida = intval($row['testSalida']);
        }
        for($i = 0; $i < $n; $i++){
            $nombre = 'test'.($test+1+$i).'.in';
            $indice = 'test'.($i+1);
            $archivo = '../Datos/Problemas/'.$idProblema.'/in/'.$nombre;
            $mover = move_uploaded_file($_FILES[$indice]["tmp_name"],$archivo);
            if(!$mover) die(json_encode(array("error" => true, "mensaje" => "No se pudo guardar el archivo", "descripcion" => "El archivo no se pudo guardar correctamente")));
        }
        $total = $test + $n;
        $sql = "UPDATE BD.problemas SET test = $total WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "mensaje" => "Tests subidos"));
    }

    if($_POST['metodo'] == "generar"){
        $idProblema = $_POST['idProblema'];
        $sql = "SELECT test,testPublico,testSalida,limite FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            $testEntrada = intval($dato['test']);
            $testSalida = intval($dato['testSalida']);
            $limite = intval($dato['limite']);
        }
        $ruta = "../Datos/Problemas/".$idProblema; 
        $nombre = obtenerCodigoSolucion($ruta."/solucion");
        if($nombre == false) die(json_encode(array("error" => true, "mensaje" => "Codigo solucion no encontrado", "descripcion" => "El codigo solucion no se encuentra en la carpeta solucion")));
        $lenguaje = nombreLenguaje(obtenerExtension($nombre));
        if(compilar($nombre,$lenguaje,$ruta."/solucion/",true)){
            if($lenguaje == 'C' || $lenguaje == 'C++') $ejecutable = $ruta."/solucion/ejecutable";
            if($lenguaje == 'Java'){
                $class = "/opt/lampp/htdocs/CodeOran/Datos/Problemas/".$idProblema."/solucion";
                $ejecutable = obtenerNombreArchivo(obtenerArchivoClass($ruta."/solucion"));
            }
            else $class = "";
            if($lenguaje == 'Python'){
                $ejecutable = $ruta."/solucion/".$nombre;
            }
            $bandera = true;
            $i = 0;
            for($i=$testSalida;$i<$testEntrada && $bandera;$i++){
                $testIn = $ruta."/in/test".($i+1).".in";
                $testOut = $ruta."/out/test".($i+1).".out";
                $testTime = $ruta."/time/test".($i+1).".txt";
                ejecutar($ejecutable,$lenguaje,$testIn,$testOut,$testTime,$class);

                if(errorTiempoEjecucion($testTime)){
                    if(!unlink($testOut)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$testOut)));
                    //if(!unlink($testTime)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$testTime)));
                    $bandera = false; 
                    $mensaje = "Error en Tiempo de Ejecucion";
                    continue;
                }

                if(limiteTiempoExcedido($testTime,$limite)) {
                    if(!unlink($testOut)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$testOut)));
                    if(!unlink($testTime)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$testTime)));
                    $bandera = false; 
                    $mensaje = "Tiempo Limite Excedido";
                    continue;
                }
            }
            if(($i-1) > 0 && $testSalida == 0) actualizarTestPublico($conexion,$idProblema);
            if($bandera){
                actualizarTestSalida($conexion,$idProblema,$i);
                echo json_encode(array("error" => false, "modal" => false, "mensaje" => "Completado", "generados" => $testEntrada, "iniciar" => $testSalida));
            }
            else{
                actualizarTestSalida($conexion,$idProblema,$i-1);
                echo json_encode(array("error" => false, "modal" => true, "mensaje" => $mensaje, "test" => $i, "generados" => $i-1, "iniciar" => $testSalida)); 
            }
        }
        else{
            echo json_encode(array("error" => false,"modal" => true, "mensaje" => "Error de Compilacion", "test" => 0));
        }
    }
    if($_POST["metodo"] == "borrar-salida"){
        $idProblema = $_POST['idProblema'];
        $ruta = "../Datos/Problemas/".$idProblema."/out";
        $listaOut = scandir($ruta);
        foreach($listaOut as $archivo){
            if(obtenerExtension($archivo) == 'out'){
                if(file_exists($ruta."/".$archivo)){
                    if(!unlink($ruta."/".$archivo)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$ruta."/".$archivo)));
                } 
            }
        }
        $ruta = "../Datos/Problemas/".$idProblema."/time";
        $listaTime = scandir($ruta);
        foreach($listaTime as $archivo){
            if(obtenerExtension($archivo) == 'txt'){
                if(file_exists($ruta."/".$archivo)){ 
                    if(!unlink($ruta."/".$archivo)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$ruta."/".$archivo)));
                }
            }
        }
        $sql = "UPDATE BD.problemas SET testSalida = 0, testPublico = 0 WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "mensaje" => "Casos borrados"));
    }
    if($_POST["metodo"] == "borrar-todo"){
        $idProblema = $_POST['idProblema'];
        $ruta = "../Datos/Problemas/".$idProblema."/in";
        $listaIn = scandir($ruta);
        foreach($listaIn as $archivo){
            if(obtenerExtension($archivo) == 'in'){
                if(file_exists($ruta."/".$archivo)){ 
                    if(!unlink($ruta."/".$archivo)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$ruta."/".$archivo)));
                }
            }
        }
        $ruta = "../Datos/Problemas/".$idProblema."/out";
        $listaOut = scandir($ruta);
        foreach($listaOut as $archivo){
            if(obtenerExtension($archivo) == 'out'){
                if(file_exists($ruta."/".$archivo)){
                    if(!unlink($ruta."/".$archivo)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$ruta."/".$archivo)));
                } 
            }
        }
        $ruta = "../Datos/Problemas/".$idProblema."/time";
        $listaTime = scandir($ruta);
        foreach($listaTime as $archivo){
            if(obtenerExtension($archivo) == 'txt'){
                if(file_exists($ruta."/".$archivo)){ 
                    if(!unlink($ruta."/".$archivo)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error de eliminacion del archivo:".$ruta."/".$archivo)));
                }
            }
        }
        $sql = "UPDATE BD.problemas SET testSalida = 0, testPublico = 0, test = 0 WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        echo json_encode(array("error" => false, "mensaje" => "Casos borrados"));
    }
    if($_POST['metodo'] == 'mostrar'){
        $idProblema = $_POST['idProblema'];
        $test = $_POST['test'];
        $entrada = $_POST['entrada'];
        $salida = $_POST['salida'];
        if($entrada == "true"){
            $ruta = "../Datos/Problemas/".$idProblema."/in/test".$test.".in";
            $fpT = fopen($ruta,"r");
            $contenido = '';
            while(!feof($fpT)){
                $contenido .= fgets($fpT)."<br>";
            }
            fclose($fpT);
            $contenidoEntrada = $contenido;
        }
        if($salida == "true"){
            $ruta = "../Datos/Problemas/".$idProblema."/out/test".$test.".out";
            $fpT = fopen($ruta,"r");
            $contenido = '';
            while(!feof($fpT)){
                $contenido .= fgets($fpT)."<br>";
            }
            fclose($fpT);
            $contenidoSalida = $contenido;
        }
        echo json_encode(array("error" => false, "contenidoEntrada" => $contenidoEntrada, "contenidoSalida" => $contenidoSalida));
    }
    if($_POST['metodo']=="eliminar-test"){
        $idProblema = $_POST['idProblema'];
        $test = intval($_POST['test']);
        $entrada = $_POST['entrada'];
        $salida = $_POST['salida'];
        $lista = [];
        $sql = "SELECT test,testPublico,testSalida FROM BD.problemas WHERE idProblema = $idProblema";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){ 
            $testActual = intval($dato['test']);
            $testPublico = intval($dato['testPublico']);
            $testSalida = intval($dato['testSalida']);
        }
        if($testActual == 0) die(json_encode(array("error" => true, "mensaje" => "Error, no existe ningun test", "descripcion" => "Se han eliminado todo los tests")));
        if($entrada == "true"){
            $ruta = "../Datos/Problemas/".$idProblema."/in/test".$test.".in";
            if(file_exists($ruta)) if(!unlink($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error Eliminar archivo", "descripcion" => "No se pudo eliminar archivo: ".$ruta)));
            $in = scandir("../Datos/Problemas/".$idProblema."/in");
            foreach($in as $archivo){
                if($archivo != "." && $archivo != ".."){
                    $acu = obtenerNumeroTest($archivo);
                    if($acu > $test){
                        if(!rename("../Datos/Problemas/".$idProblema."/in/test".$acu.".in","../Datos/Problemas/".$idProblema."/in/test".($acu-1).".in")) die(json_encode(array("error" => true, "mensaje" => "Error Renombrar archivo", "descripcion" => "No se pudo renombrar al archivo: "."../Datos/Problemas/".$idProblema."/in/test".$acu.".in")));
                    }
                }
            }
            $sql = "UPDATE BD.problemas SET test = test - 1 WHERE idProblema = $idProblema AND test > 0;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
        if($salida == "true"){
            $ruta = "../Datos/Problemas/".$idProblema."/out/test".$test.".out";
            $rutaTime = "../Datos/Problemas/".$idProblema."/time/test".$test.".txt";
            if(file_exists($ruta)) if(!unlink($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error Eliminar archivo", "descripcion" => "No se pudo eliminar archivo: ".$ruta)));
            if(file_exists($rutaTime)) if(!unlink($rutaTime)) die(json_encode(array("error" => true, "mensaje" => "Error Eliminar archivo", "descripcion" => "No se pudo eliminar archivo: ".$rutaTime)));
            $out = scandir("../Datos/Problemas/".$idProblema."/out");
            foreach($out as $archivo){
                if($archivo != "." && $archivo != ".."){
                    $acu = obtenerNumeroTest($archivo);
                    if($acu > $test){
                        if(!rename("../Datos/Problemas/".$idProblema."/out/test".$acu.".out","../Datos/Problemas/".$idProblema."/out/test".($acu-1).".out")) die(json_encode(array("error" => true, "mensaje" => "Error Renombrar archivo", "descripcion" => "No se pudo renombrar al archivo: "."../Datos/Problemas/".$idProblema."/out/test".$acu.".out")));
                        if(!rename("../Datos/Problemas/".$idProblema."/time/test".$acu.".txt","../Datos/Problemas/".$idProblema."/time/test".($acu-1).".txt")) die(json_encode(array("error" => true, "mensaje" => "Error Renombrar archivo", "descripcion" => "No se pudo renombrar al archivo: "."../Datos/Problemas/".$idProblema."/time/test".$acu.".txt")));
                    }
                }
            }
            $sql = "UPDATE BD.problemas SET testSalida = testSalida - 1 WHERE idProblema = $idProblema AND testSalida > 0;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
            
        $sql = "UPDATE BD.problemas SET testPublico = testSalida WHERE idProblema = $idProblema AND testSalida < testPublico;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));

        echo json_encode(array("error" => false, "mensaje" => "Test Eliminado"));   
    }

    function actualizarTestSalida($conexion,$idProblema,$numero){
        $sql = "UPDATE BD.problemas SET testSalida = $numero WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    }

    function actualizarTestPublico($conexion,$idProblema){
        $sql = "UPDATE BD.problemas SET testPublico = 1 WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    }
?>