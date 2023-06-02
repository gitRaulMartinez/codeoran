<?php
    include ('conexion.php');
    session_start();
    date_default_timezone_set('America/Argentina/Salta');
    $idTorneo = $_POST['idTorneo'];
    $hoy = getdate();
    $fechaHoy = $hoy['year']."-".$hoy['mon']."-".$hoy['mday'];
    $horaHoy = $hoy['hours'].":".$hoy['minutes'].":".$hoy['seconds'];
    $sql = "SELECT idTorneo,nombre,fechaInicio,horaInicio,duracion,problemas,DATE_FORMAT(DATE_ADD(CONCAT(CONCAT(fechaInicio,' '),horaInicio),INTERVAL duracion HOUR_SECOND) , '%Y-%c-%d %H:%i:%S') as fechaFin FROM BD.torneos WHERE idTorneo = $idTorneo";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)){
        $fechaTorneo = $row['fechaInicio'];
        $horaTorneo = $row['horaInicio'];
        $fechaFin = $row['fechaFin'];
    }
    $tiempoHoy = strtotime($fechaHoy." ".$horaHoy);
    $tiempoTorneo = strtotime($fechaTorneo." ".$horaTorneo);
    $tiempoFin = strtotime($fechaFin);
    if($tiempoHoy >= $tiempoTorneo){
        $sql = "SELECT * FROM BD.problemas WHERE torneoAsociado = $idTorneo";
        $resp = mysqli_query($conexion,$sql);
        if($resp){
            while($row = mysqli_fetch_array($resp)) {
                $descripcionRuta = $row['descripcion'].'descripcion.txt';
                $fpT = fopen($descripcionRuta,"r");
                $descripcion = '';
                while(!feof($fpT)){
                    $lineaT = fgets($fpT);
                    $descripcion .= $lineaT;
                }
                fclose($fpT);

                $descripcionRuta = $row['descripcion'].'entrada.txt';
                $fpT = fopen($descripcionRuta,"r");
                $entrada = '';
                while(!feof($fpT)){
                    $lineaT = fgets($fpT);
                    $entrada.= $lineaT;
                }
                fclose($fpT);

                $descripcionRuta = $row['descripcion'].'salida.txt';
                $fpT = fopen($descripcionRuta,"r");
                $salida = '';
                while(!feof($fpT)){
                    $lineaT = fgets($fpT);
                    $salida .= $lineaT;
                }
                fclose($fpT);

                $n = intval($row['numeroTestPublicos']);
                $tests = array();
                for($i = 0 ; $i < $n ; $i++){
                    $rutaTestEntrada = "../Datos/Problemas/".$row['idProblema']."/in/test".strval($i+1).".in";
                    $fpT = fopen($rutaTestEntrada,"r");
                    $entradaTest = '';
                    while(!feof($fpT)){
                        $lineaT = fgets($fpT);
                        if($lineaT != ''){
                            $entradaTest .= $lineaT."<br>";
                        }
                    }
                    fclose($fpT);
                    $rutaTestSalida = "../Datos/Problemas/".$row['idProblema']."/out/test".strval($i+1).".out";
                    $fpT = fopen($rutaTestSalida,"r");
                    $salidaTest = '';
                    while(!feof($fpT)){
                        $lineaT = fgets($fpT);
                        if($lineaT != ''){
                            $salidaTest .= $lineaT."<br>";
                        }
                    }
                    fclose($fpT);

                    $tests []= array(
                        "testEntrada" => $entradaTest,
                        "testSalida" =>  $salidaTest
                    );
                }
                $json []= array(
                    "idProblemas" => $row["idProblema"],
                    "titulo" => utf8_encode($row["titulo"]),
                    "descripcion" => $descripcion,
                    "entrada" => $entrada,
                    "salida" => $salida,
                    "tests" => $tests,
                    "letra" => $row["letra"]
                );
            }
            echo json_encode(array("error" => false, "mostrar" => true, "lista" => $json));
        }
        else{
            die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        }
    }
    else{
        echo json_encode(array("error" => false, "mostrar" => false, "segundos" => $resto));
    }
?>