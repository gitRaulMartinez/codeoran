<?php
    include ('tiempo.php');
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $idTorneo = $_POST['idTorneo'];
    $idProblema = $_POST['idProblema'];
    $estado = estadoTorneo($conexion,$idTorneo,$hoy);
    if(!$estado) die(json_encode(array("error" => false, "mostrar" => false)));
    if(isset($_SESSION['usuario'])) $usuario = $_SESSION['usuario'];
    else die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    if($idProblema == 'todos'){
        $sql = "SELECT * FROM BD.problemas WHERE torneo = $idTorneo ORDER BY letra;";
    }
    else{
        $sql = "SELECT * FROM BD.problemas WHERE idProblema = $idProblema;";
    }
    $resp = mysqli_query($conexion,$sql);
    if($resp){
        $json = array();
        while($row = mysqli_fetch_array($resp)) {
            $descripcionRuta = "../Datos/Problemas/".$row['idProblema']."/datos/descripcion.txt";
            $fpT = fopen($descripcionRuta,"r");
            $descripcion = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $descripcion .= $lineaT;
            }
            fclose($fpT);

            $descripcionRuta = "../Datos/Problemas/".$row['idProblema']."/datos/entrada.txt";
            $fpT = fopen($descripcionRuta,"r");
            $entrada = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $entrada.= $lineaT;
            }
            fclose($fpT);

            $descripcionRuta = "../Datos/Problemas/".$row['idProblema']."/datos/salida.txt";
            $fpT = fopen($descripcionRuta,"r");
            $salida = '';
            while(!feof($fpT)){
                $lineaT = fgets($fpT);
                $salida .= $lineaT;
            }
            fclose($fpT);

            $n = intval($row['testPublico']);
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
                "titulo" => $row["titulo"],
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
?>