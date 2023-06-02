<?php
    include ('conexion.php');
    include ('funciones.php');
    session_start();
    if(isset($_SESSION['usuario'])) $usuario = $_SESSION['usuario'];
    else die("Error Sesion"); 
    if(!controlPaginaAdministrador($conexion,$usuario)) die("Error admin");   
    $sql = "SELECT * FROM BD.usuarios INNER JOIN BD.paises WHERE id = pais;"; 
    $resp = mysqli_query($conexion,$sql);
    $arreglo['data'] = [];
    while($data = mysqli_fetch_assoc($resp)){
        switch(intval($data['nivel'])){
            case 0: $nivelUsuario = "Usuario Bloqueado";
                    break;
            case 1: $nivelUsuario = "Usuario Normal";
                    break;
            case 2: $nivelUsuario = "Administrador";
                    break;
            case 3: $nivelUsuario = "Super Administrador";
                    break;
        }
        if(intval($data['activo'])) $activoUsuario = '<div><i class="bi bi-patch-check"></i><span> Cuenta verificada </span></div>';
        else $activoUsuario = '<div><i class="bi bi-exclamation-circle"></i><span> Cuenta no verificada </span></div>';
        $data['activoUsuario'] = $activoUsuario;
        $data['nivelUsuario'] = $nivelUsuario;
        $datosFechas = explode(' ',$data['fechaDeCreacion']);
        $data['fechaC'] = $datosFechas[0];
        $data['horaC'] = $datosFechas[1];
        $datosFechas = explode(' ',$data['ultimaConexion']);
        $data['ultimaFC'] = $datosFechas[0];
        $data['ultimaHC'] = $datosFechas[1];
        $data['editUsuario'] = '<button type="button" class="btn btn-danger btn-sm editar-usuario" data-bs-toggle="tooltip-botones" data-bs-placement="left" title="Editar Usuario"><i class="bi bi-pencil-square"></i></button>';
        $data['DT_RowClass'] = 'align-middle';
        $data['DT_RowAttr'] = (object) array("idUsuario" => $data['usuario']);
        $data['imagen'] = '<button type="button" class="btn btn-light btn-sm mostrar-imagen" data-bs-toggle="tooltip-botones" data-bs-placement="left" title="Editar Imagen de perfil"><i class="bi bi-image"></i></button>';
        $arreglo['data'] []= $data;
    }
    echo json_encode($arreglo);
?>