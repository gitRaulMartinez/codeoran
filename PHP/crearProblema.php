<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    $letras = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    if(!isset($_SESSION['usuario'])) die(json_encode(array("error" => true,"mensaje" => "Error de sesion","descripcion" => "Error ningun usuario logueado")));
    else $usuarioAdmin = $_SESSION['usuario'];
    if(!controlPaginaAdministrador($conexion,$usuarioAdmin)) die(json_encode(array("error" => true,"mensaje" => "Error administracion","descripcion" => "No tiene permisos para ingresar a este nivel de la pagina")));
    $idTorneo = $_POST['idTorneo'];
    /* Obtener numero de problemas actuales */
    $sql = "SELECT COUNT(idProblema) as cantidad FROM BD.problemas WHERE torneo = $idTorneo;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos Nande","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($dato = mysqli_fetch_array($resp)) $cantidad = intval($dato['cantidad']);

    /* Verificacion de maximo de 15 problemas */
    if($cantidad >= 15) die(json_encode(array("error" => true,"mensaje" => "Maximo cantidad de problema permitida","descripcion" => "Maxima cantidad permitida de 15 problemas")));
    $titulo = $_POST['titulo'];

    /*Crear Problema*/
    $sql = "INSERT INTO BD.problemas (titulo,torneo,test,letra,testPublico,testSalida,limite) VALUE('$titulo',$idTorneo,0,'$letras[$cantidad]',0,0,1);";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));

    /* Obtener ID problema */
    $sql = "SELECT MAX(idProblema) as idMAX FROM BD.problemas;";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true,"mensaje" => "Fallo en la base de datos","descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)) $idProblema = $row['idMAX'];
    $ruta = "../Datos/Problemas/".$idProblema;

    /* Creacion de directorios */
    if(!mkdir($ruta)) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta)));
    if(!mkdir($ruta."/datos")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta."/datos")));
    if(!mkdir($ruta."/in")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta."/in")));
    if(!mkdir($ruta."/out")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta."/out")));
    if(!mkdir($ruta."/solucion")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta."/solucion")));
    if(!mkdir($ruta."/time")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de directorios", "descripcion" => "No se pudo crear la carpeta ".$ruta."/time")));
    if(!fopen($ruta."/datos/descripcion.txt","w+b")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de archivos", "descripcion" => "No se pudo crear el archivo ".$ruta."/datos/descripcion.txt")));
    if(!fopen($ruta."/datos/entrada.txt","w+b")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de archivos", "descripcion" => "No se pudo crear el archivo ".$ruta."/datos/entrada.txt")));
    if(!fopen($ruta."/datos/salida.txt","w+b")) die(json_encode(array("error" => true, "mensaje" => "Error en creacion de archivos", "descripcion" => "No se pudo crear el archivo ".$ruta."/datos/salida.txt")));

    /* Actualizar descripcion */
    echo json_encode(array("error" => false, "mensaje" => "Problema Creado", "idProblema" => $idProblema, "letra" => $letras[$cantidad]));
?>