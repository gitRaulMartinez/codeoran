<?php
    putenv("LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu");
    function compilar($nombre,$lenguaje,$directorio,$test){
        //Nombre del archivo
        //Lenguaje del codigo fuente 
        //Directorio en donde se encuentra el nombre del archivo
        if($lenguaje == 'C++'){
            $archivo = $directorio.$nombre;
            $ejecutable = $directorio."ejecutable";
            $error = $directorio."compilacion.txt";
            exec("../Bash/compilador.sh ".$ejecutable." ".$archivo." ".$error);
            $bandera = true;
            $fpT = fopen($error,"r");
            while(!feof($fpT) && $bandera){
                $lineaT = fgets($fpT);
                if($lineaT != '') $bandera = false; 
            }
            fclose($fpT);
            if($test) if(file_exists($error)) if(!unlink($error)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error al eliminar el archivo (Funcion juezLIB)")));
            if(!$bandera) if(file_exists($ejecutable)) if(!unlink($ejecutable)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el ejecutable","descripcion" => "Error de eliminacion de ejecutable (Funcion juezLIB)")));
            return $bandera;
        }

        if($lenguaje == 'C'){
            $archivo = $directorio.$nombre;
            $ejecutable = $directorio."ejecutable";
            $error = $directorio."compilacion.txt";
            exec("../Bash/compiladorC.sh ".$archivo." ".$ejecutable." ".$error);
            $bandera = true;
            $fpT = fopen($error,"r"); 
            while(!feof($fpT) && $bandera){
                $lineaT = fgets($fpT);
                if($lineaT != '') $bandera = false; 
            }
            fclose($fpT);
            if($test) if(!unlink($error)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error al eliminar el archivo:".$error)));
            if(!$bandera) if(file_exists($ejecutable)) if(!unlink($ejecutable)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el ejecutable","descripcion" => "Error de eliminacion de ejecutable (Funcion juezLIB)")));
            return $bandera;
        }

        if($lenguaje == 'Java'){
            $archivo = $directorio.$nombre;
            $error = $directorio."compilacion.txt";
            exec("../Bash/compiladorJava.sh ".$archivo." ".$error);
            $bandera = true;
            $fpT = fopen($error,"r");
            while(!feof($fpT) && $bandera){
                $lineaT = fgets($fpT);
                if($lineaT != '') $bandera = false; 
            }
            fclose($fpT);
            if($test) if(!unlink($error)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error al eliminar el archivo:".$error)));
            if(!$bandera){
                $nombre = obtenerArchivoClass(substr($directorio, 0, -1));
                if($nombre != "") if(file_exists($directorio.$nombre)) if(!unlink($directorio.$nombre)) die(json_encode(array("error"=>true,"mensaje"=>"No se pudo eliminar el archivo","descripcion" => "Error al eliminar el archivo:".$directorio.$nombre)));
            }
            return $bandera;
        }
        if($lenguaje == 'Python') return true;
        echo die(json_encode(array("error"=>true, "mensaje" => "Lenguaje no permitido", "descripcion" => "Archivo no permitido")));
    }

    function ejecutar($ejecutable,$lenguaje,$testIn,$testOut,$testTime,$class){
        if($lenguaje == 'C++' || $lenguaje == 'C'){
            $ejecucion = "../Bash/ejecutar.sh ".$ejecutable." ".$testIn." ".$testOut." ".$testTime;
            exec($ejecucion);
            exec("../Bash/depurarC.sh ".$ejecutable." ../Datos/Problemas/178/solucion/ldd.txt");
        }
        if($lenguaje == 'Java'){
            $ejecucion = "../Bash/ejecutarJava.sh ".$class." ".$ejecutable." ".$testIn." ".$testOut." ".$testTime;
            exec($ejecucion);
        }
        if($lenguaje == 'Python'){
            $ejecucion = "../Bash/ejecutarPython.sh ".$ejecutable." ".$testIn." ".$testOut." ".$testTime;
            exec($ejecucion);
        }
    }

    function errorTiempoEjecucion($testError){
        $error = file($testError);
        $cantidadLineas = 0;
        foreach($error as $lineas) $cantidadLineas++;
        if($cantidadLineas>4){
            return true;
        }
        else{
            return false;
        }
    }

    function limiteTiempoExcedido($testTime,$segundos){
        $f = fopen($testTime,"r");
        $time = [];
        while(!feof($f)){
            $time []= fgets($f);
        }
        fclose($f);

        $ms = 0;
        for($i=0;$i<strlen($time[2]);$i++){
            if($time[2][$i]=='m') $inicio = $i;
            if($time[2][$i]=='s') $final = $i;  
        }
        for($i = $inicio+1;$i < $final ;$i++){
            if(is_numeric($time[2][$i])){
                $ms = $time[2][$i] + $ms*10;
            }
        }
        if($ms > $segundos*1000){ // 1000 ms = 1s
            return true;
        }
        else{
            return false;
        }
    }

    function compararTests($test1,$test2){
        $fp1 = fopen($test1,"r");
        $fp2 = fopen($test2,"r");
        while(!feof($fp1) && !feof($fp2)){
            $linea1 = fgets($fp1);
            $linea2 = fgets($fp2);
            if(strcmp($linea1,$linea2)!=0){ 
                fclose($fp1);
                fclose($fp2);
                return false;
            }
        }
        if(!feof($fp1) || !feof($fp2)){ 
            fclose($fp1);
            fclose($fp2);
            return false;
        }
        fclose($fp1);
        fclose($fp2);
        return true;
    }

    function obtenerArchivoClass($directorio){
        $lista = scandir($directorio);
        foreach($lista as $archivo){
            if(obtenerExtension($archivo) == 'class'){
                return $archivo;
            }
        }
        return "";
    }

    function obtenerExtension($archivo){
        $array = explode('.',$archivo);
        return $array[count($array)-1];
    }

    function nombreLenguaje($ext){
        switch($ext){
            case 'c':   return "C";
            case 'cpp': return "C++";
            case 'java':return "Java";
            case 'py':  return "Python";
        }
    }

    function obtenerNombreArchivo($archivo){
        $array = explode('.',$archivo);
        return $array[0];
    }

    function obtenerCodigoSolucion($directorio){
        $lista = scandir($directorio);
        foreach($lista as $archivo){
            if($archivo != "." && $archivo!= ".."){
                switch(obtenerExtension($archivo)){
                    case "cpp": return $archivo;
                    case "c":   return $archivo;
                    case "java":return $archivo;
                    case "py":  return $archivo;
                }
            }
        }
        return false;
    }

    function respuestaJuez($conexion,$idEnvio,$respuesta,$bandera){
        $sql = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema INNER JOIN BD.torneos ON torneo = idTorneo WHERE idEnvio = $idEnvio;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            $idProblema = $dato['problema'];
            $penalizacion = intval($dato['tiempoPenalizacion'])*60; 
            $fechaTorneo = $dato['fechaInicio'];
            $horaTorneo = $dato['horaInicio'];
            $fechaEnvio = $dato['fechaEnvio'];
            $horaEnvio = $dato['horaEnvio'];
            $usuario = $dato['usuario'];
        }
        if($bandera){
            $tiempoTorneo = strtotime($fechaTorneo." ".$horaTorneo);
            $tiempoEnvio = strtotime($fechaEnvio." ".$horaEnvio); 
            $tiempoTotal = abs($tiempoEnvio - $tiempoTorneo)+$penalizacion*numeroDeRespuestasFallidas($conexion,$idProblema,$usuario);
            $sql = "UPDATE BD.envios SET tiempo = $tiempoTotal, respuesta = 'Aceptado' WHERE idEnvio = $idEnvio;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
        else{
            $sql = "UPDATE BD.envios SET respuesta = '$respuesta' WHERE idEnvio = $idEnvio;";
            $resp = mysqli_query($conexion,$sql);
            if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
    }

    function numeroDeRespuestasFallidas($conexion,$idProblema,$usuario){
        $sqlTotal = "SELECT * FROM BD.envios WHERE problema = $idProblema AND respuesta != 'Aceptado' AND respuesta != 'En espera' AND usuario = '$usuario';";
        $respTotal = mysqli_query($conexion,$sqlTotal);
        if(!$respTotal) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        return intval(mysqli_num_rows($respTotal));
    }
?>