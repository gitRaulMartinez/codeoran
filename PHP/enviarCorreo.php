<?php
    $respuestaError = "";
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require 'PHPMailer/src/Exception.php';
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';

    function enviarCorreo($usuario,$correo,$asunto,$mensaje){
        $mail = new PHPMailer(true);
        try {
            //Server settings
            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
            $mail->isSMTP();                                            // Send using SMTP
            $mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
            $mail->Username   = 'codeoranweb@gmail.com';                     // SMTP username
            $mail->Password   = 'fcocniescvvzfbos';                               // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
            $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
    
            //Recipients
            $mail->setFrom('codeoranweb@gmail.com', 'Codeoran Web');
            $mail->addAddress($correo,$usuario);  //quien va a recibir el correo
            //$mail->addAddress('ellen@example.com');               // Para mas personas.
            //$mail->addReplyTo('info@example.com', 'Information');
            //$mail->addCC('cc@example.com');
            //$mail->addBCC('bcc@example.com');
    
            // Attachments
            //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
            //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    
            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->CharSet = 'UTF-8';
            $mail->Subject = $asunto;
            $mail->Body    = $mensaje;
            //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    
            $mail->send();
            return true;
        } catch (Exception $e) {
            $respuestaError = $e;
            return false;
        }
    }
?>