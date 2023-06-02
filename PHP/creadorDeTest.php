<?php
    $n = 1000;
    $m = 1000;
    $file = fopen("test15.in", "w");
    fwrite($file,$n." ".$m. PHP_EOL);
    for($i = 0; $i < $n ; $i++){
        for($j = 0; $j < $m ; $j++){
            $numero = rand(1,11);
            if($numero == 1) $colocar = '/';
            if($numero == 2) $colocar = '.';
            if($numero == 3) $colocar = '.';
            if($numero == 4) $colocar = '.';
            if($numero == 5) $colocar = '.';
            if($numero == 6) $colocar = '.';
            if($numero == 7) $colocar = '.';
            if($numero == 8) $colocar = '.';
            if($numero == 9) $colocar = '.';
            if($numero == 10) $colocar = '.';
            if($numero == 11) $colocar = chr(92);
            fwrite($file,$colocar);
        }
        fwrite($file,PHP_EOL);
    }
    echo "Termine";
?>