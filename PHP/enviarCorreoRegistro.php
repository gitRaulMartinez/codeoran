<?php
    session_start();

    include ('conexion.php');
    include('enviarCorreo.php');
    
    if(isset($_SESSION['usuario'])) $usuario = $_SESSION['usuario'];
    else die(json_encode(array("error" => true, "mensaje" => "Error sesion", "descripcion" => "No se encuentra logueado el usuario")));
    $sql = "SELECT * FROM BD.usuarios WHERE usuario = '$usuario';";
    $resp = mysqli_query($conexion,$sql);
    if(!$resp) die(json_encode(array("error" => true, "mensaje" => "Error en la base de datos", "descripcion" => 'Query Error'.mysqli_error($conexion))));
    while($row = mysqli_fetch_array($resp)) {
        $correo = $row['correo'];
        $hashActivo = sha1($row['hashActivo']);
    }

    $asunto = 'Bienvenido';
    $mensaje = '
        <div style="width: 100%; display: flex; font-size:15px">
            <div style="width:auto; min-width: 400px; margin: 0 auto; background: #212020; color: white;">
                <div style="margin: 10px;">
                    <h2>Code Orán</h2>
                    <div style="max-height: 1px; height: 1px; border-radius: 0.5px; width: 100%; margin: 0 auto; background: white; margin: 8px 0;"></div>
                    <p>¡Hola '.$usuario.'!, su registro fue un excitó ahora solo debe activar la cuenta para poder participar de los torneos. Copie y pegue el código siguiente. </p>
                    <br>
                </div>  
                <div style="background: white; padding: 8rem 1rem; display: flex;">
                    <div style="margin: 0 auto; font-size: 17px;">
                        <span style="display: inline-block; padding: 10px; background: #212020; color: white; border: 1px #212020 solid;">Codigo:</span><span style="display: inline-block; padding: 10px; border: 1px #212020 solid; color: grey;" >'.$hashActivo.'</span>
                    </div>
                </div>
                <div>
                    <div style="display: flex; padding: 30px; justify-content: center;">
                        <img src="https://cdn-icons-png.flaticon.com/512/2917/2917242.png" width="100" height="100">
                        <div style="font-size: 20px; margin: auto 0;">
                            <div style="color: yellow;"><b>Code Orán</b></div>
                            <div style="color: white;">
                                <div>PROGRAMACIÓN</div>
                                <div>COMPETITIVA</div>
                            </div>
                        </div>
                    </div>
                    <div style="background: white; color: grey; padding: 20px; text-align: center; font-size: 12px;"><em>Este correo fue enviado por CodeOrán no debe responder a este correo, Gracias Saludos.</em></div>
                </div>
            </div>
        </div>
    ';
    if(enviarCorreo($usuario,$correo,$asunto,$mensaje)){
        echo json_encode(array("error" => false));
    }
    else{
        echo json_encode(array("error" => true, "mensaje" => "Error envio", "descripcion" => $respuestaError));
    }
?>