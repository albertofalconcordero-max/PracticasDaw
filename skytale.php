<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method="POST">
        <label>Introduzca la frase a Cifrar por Skytale</label>
        <input type="text" name="frase" required>
        <button type="input">Generar</button>
    </form>
    <?php
    if ($_SERVER["REQUEST_METHOD"]=="POST") {
        $frase=$_POST['frase'];
        echo "<h1>$frase</h1>"; 
       
        $colm=4;
        while (strlen($frase)%$colm!=0) {
            $frase.="*";
        }
        
        $fraseChar=str_split($frase,$colm);
        print_r($fraseChar);
        echo "<br>";
        
        $cifrado="";
        for ($i=0; $i < $colm; $i++) { 
            for ($j=0; $j < count($fraseChar); $j++) { 
                $cifrado.=$fraseChar[$j][$i];
            }
            //echo $cifrado. "<br>";
        }
        echo "Mensaje cifrado: " .$cifrado;
        echo "<br>";
        
        $descifrado="";
        $filas=count($fraseChar);
        $cifradoChar=str_split($cifrado,$filas);
        for ($i=0; $i < $filas; $i++) { 
            for ($j=0; $j < $colm; $j++) { 
                $descifrado.=$cifradoChar[$j][$i];
            }
        }
        echo "Mensaje descifrado: " .$descifrado;
        
    }
    ?>
</body>
</html>