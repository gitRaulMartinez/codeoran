<?php
    include ('conexion.php');
    session_start();
    if(isset($_POST['idTorneo']) && isset($_POST['metodo']) && $_POST['metodo'] == "admin"){
        $idTorneo = $_POST['idTorneo'];
        $sql = "SELECT idEnvio,letra,titulo,fechaEnvio,horaEnvio,respuesta,lenguaje,BD.usuarios.usuario,BD.paises.nombre,problema,BD.usuarios.pais
        FROM BD.envios 
        INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo 
        INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND BD.usuarios.nivel <= 1
        INNER JOIN BD.paises ON BD.usuarios.pais = BD.paises.id";
    }
    else if(isset($_POST['idTorneo'])){
        if(isset($_SESSION['usuario'])){
            $usuario = $_SESSION['usuario'];
        }
        else die(json_encode(array("error" => true, "mensaje" => "Error Sesion", "descripcion" => "No se encuentra logueado")));
        $idTorneo = $_POST['idTorneo'];
        $sql = "SELECT idEnvio,letra,titulo,fechaEnvio,horaEnvio,respuesta,lenguaje FROM BD.envios,BD.problemas WHERE problema = idProblema AND torneo = $idTorneo AND usuario = '$usuario';";
    }
    else{
        $usuario = $_POST['usuario'];
        $sql = "SELECT * FROM BD.envios,BD.problemas WHERE problema = idProblema AND usuario = '$usuario';";
    }
    $resp = mysqli_query($conexion,$sql);
    $arreglo["data"] = [];
    if(!$resp){
        die("Error");
    } 
    else{
        while($data = mysqli_fetch_assoc($resp)) {
            $arreglo["data"] []= $data;
        }
    }
   
    echo json_encode($arreglo);
?>