<?php
    date_default_timezone_set('America/Argentina/Salta');
    $hoy = getdate();
    function devolverHora($hoy){
        $resultado = '';
        if($hoy['hours']<10) $resultado .= '0'.$hoy['hours'].':';
        else $resultado .= $hoy['hours'].':';
        if($hoy['minutes']<10) $resultado .= '0'.$hoy['minutes'].':';
        else $resultado .= $hoy['minutes'].':';
        if($hoy['seconds']<10) $resultado .= '0'.$hoy['seconds'];
        else $resultado .= $hoy['seconds'];
        return $resultado;
    }
    function devolverFecha($hoy){
        $resultado = strval($hoy['year']).'-';
        if($hoy['mon']<10) $resultado .= '0'.$hoy['mon'].'-';
        else $resultado .= $hoy['mon'].'-';
        if($hoy['mday']<10) $resultado .= '0'.$hoy['mday'];
        else $resultado .= $hoy['mday'];
        return $resultado;
    }
?>