<?php
    include ('conexion.php');
    session_start();
    date_default_timezone_set('America/Argentina/Salta');
    $idTorneo = $_POST['idTorneo'];
    $sql = "SELECT respuesta,COUNT(respuesta) as cantidad FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo GROUP BY respuesta ORDER BY respuesta;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $json = array();
    while($row = mysqli_fetch_array($resp)) $json []= array('respuesta' => $row['respuesta'], 'cantidad' => $row['cantidad']);

    $sql = "SELECT * FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $totalEnvio = mysqli_num_rows($resp);

    $sql = "SELECT DISTINCT BD.envios.usuario FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $totalUsuario = mysqli_num_rows($resp);

    $sqlProblemas = "SELECT letra,titulo FROM BD.problemas WHERE torneo = $idTorneo ORDER BY letra;";
    $respProblemas = mysqli_query($conexion,$sqlProblemas);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $problemas = array();
    while($data = mysqli_fetch_object($respProblemas)){ 
        $problemas []= $data;
    }
    $totalProblemas = mysqli_num_rows($respProblemas);
    $setRespuesta = array();
    $arrayRespuestas = ['Tiempo Limite Excedido','Error en Tiempo de Ejecucion','Compilacion Fallida','Respuesta Incorrecta','Aceptado','En Espera'];
    for($i = 0; $i < 6; $i++){
        $sql = "SELECT letra,COUNT(letra) as cantidad FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo AND respuesta = '$arrayRespuestas[$i]' INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo GROUP BY letra ORDER BY letra;";
        $resp = mysqli_query($conexion,$sql);
        if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
        $respuestaProblema = array();
        while($row = mysqli_fetch_array($resp)) $respuestaProblema []= array('letra' => $row['letra'], 'cantidad' => $row['cantidad']);
        $setRespuesta []= array('respuesta' => $arrayRespuestas[$i], 'cantidadRespuesta' => $respuestaProblema);
    }

    $sql = "SELECT lenguaje,COUNT(lenguaje) as cantidad FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1 INNER JOIN BD.inscripcion ON BD.inscripcion.usuario = BD.usuarios.usuario AND BD.inscripcion.torneo = $idTorneo GROUP BY lenguaje ORDER BY lenguaje;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $lenguajes = array();
    while($row = mysqli_fetch_array($resp)) $lenguajes []= intval($row['cantidad']);

    $sql = "SELECT letra,COUNT(letra) as cantidad FROM BD.preguntas INNER JOIN BD.problemas ON BD.preguntas.problema = idProblema AND torneo = $idTorneo GROUP BY letra ORDER BY letra;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    foreach($letras as $letra) $contadorPreguntas[$letra] = 0;
    while($row = mysqli_fetch_array($resp)) $contadorPreguntas[$row['letra']] += intval($row['cantidad']);

    $sql = "SELECT nombre,COUNT(nombre) as cantidad FROM BD.usuarios INNER JOIN (SELECT DISTINCT BD.envios.usuario as u FROM BD.envios INNER JOIN BD.problemas ON problema = idProblema AND torneo = $idTorneo INNER JOIN BD.usuarios ON BD.envios.usuario = BD.usuarios.usuario AND nivel = 1) as Consulta1 ON u = usuario INNER JOIN BD.paises ON id = pais GROUP BY nombre ORDER BY nombre;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    $paises = []; $numeroUsuario = [];
    while($row = mysqli_fetch_array($resp)){
        $paises []= $row["nombre"];
        $numeroUsuario []= intval($row["cantidad"]);
    }
    $datoPais = array(
        "paises" => $paises,
        "numero" => $numeroUsuario
    );
    $respuesta = array('json' => $json, 'totalEnvio' => $totalEnvio, 'totalUsuario' => $totalUsuario, 'setRespuesta' => $setRespuesta, 'totalProblemas' => $totalProblemas, 'problemas' => $problemas, 'lenguajes' => $lenguajes, 'preguntas' => $contadorPreguntas, 'datoPais' => $datoPais);
    echo json_encode(array('error' => false, "datos" => $respuesta));
?>