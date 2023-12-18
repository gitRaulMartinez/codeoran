<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    include ('juezLib.php');
    session_start();
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));
    if($_POST['metodo'] == 'lista'){
        $idTorneo = $_POST['idTorneo'];
        $sql = "SELECT * FROM BD.problemas WHERE torneo = $idTorneo ORDER BY letra;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $lista = [];
        while($dato = mysqli_fetch_assoc($resp)){
            $lista []= $dato;
        }
        echo json_encode(array("error" => false, "lista" => $lista));
    }
    if($_POST['metodo'] == "cargar"){
        $idTorneo = $_POST['idTorneo'];
        $idProblema = $_POST['idProblema'];
        $sql = "SELECT * FROM BD.problemas WHERE idProblema = $idProblema;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos ","descripcion" => 'Query Error'.mysqli_error($conexion))));
        while($dato = mysqli_fetch_assoc($resp)){
            $descripcionRuta = "../Datos/Problemas/".$dato['idProblema']."/datos/descripcion.txt";
            $fpT = fopen($descripcionRuta,"r");
            $descripcion = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $descripcion .= $lineaT;
            }
            fclose($fpT);

            $descripcionRuta = "../Datos/Problemas/".$dato['idProblema']."/datos/entrada.txt";
            $fpT = fopen($descripcionRuta,"r");
            $entrada = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $entrada.= $lineaT;
            }
            fclose($fpT);

            $descripcionRuta = "../Datos/Problemas/".$dato['idProblema']."/datos/salida.txt";
            $fpT = fopen($descripcionRuta,"r");
            $salida = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $salida .= $lineaT;
            }
            fclose($fpT);
            $dato['descripcion'] = $descripcion;
            $dato['entrada'] = $entrada;
            $dato['salida'] = $salida;

            $descripcionRuta = "../Datos/Problemas/".$dato['idProblema']."/solucion";
            $lista = scandir($descripcionRuta);
            $dato['ext'] = "";
            foreach($lista as $archivo){
                switch(obtenerExtension($archivo)){
                    case "cpp" : $dato['ext'] = "cpp"; $dato['archivo'] = $archivo; break;
                    case "c"   : $dato['ext'] = "c"; $dato['archivo'] = $archivo; break;
                    case "java": $dato['ext'] = "java"; $dato['archivo'] = $archivo; break;
                    case "py"  : $dato['ext'] = "py"; $dato['archivo'] = $archivo; break;
                }
            }
            $retornar = $dato;
        }
        echo json_encode(array("error" => false, "datos" => $retornar));
    }
?>