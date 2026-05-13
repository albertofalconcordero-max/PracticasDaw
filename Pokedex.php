<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="Pokedex.css">
</head>
<body>
    <?php
        $id=rand(1,1025);
        $shiny=rand(1,15) === 1;

        $url="https://pokeapi.co/api/v2/pokemon/" .$id;
        $openUrl=curl_init($url);

        curl_setopt($openUrl, CURLOPT_RETURNTRANSFER, true);

        $respuesta=curl_exec($openUrl);
        curl_close($openUrl);

        $datos=json_decode($respuesta, true);
        echo "<div>";
        echo "<table border=2>";
        echo "<tr>";
        echo "<td><h2>" .$datos['name']. "</h2></td>";
        echo "</tr>";
        if ($shiny) {
                echo "<td><img src='" . $datos['sprites']['front_shiny'] . "'>";
                echo "<p>¡Es shiny!</p></td>";
            } else {
                echo "<td><img src='" . $datos['sprites']['front_default'] . "'>";
                echo "<p>Normal</p></td>";
            } "'></td>";
        echo "</tr>";
        echo "<tr>";
        echo "<td><h2>". "Altura: " .$datos['height']. "</h2>";
        echo "<h2>". "Peso: " .$datos['weight']. "</h2>";
        echo "<h2>". "Tipo: " .$datos['types'][0]['type']['name']. "</h2></td>";
        echo "</tr>";
        
        echo "<tr>";
        echo "<form action=''>";
          echo "<td><button type='submit'>Buscar</button></td>";
        echo "</form>";
        echo "</tr>";
        echo "</table>";
        echo "</div>";
    ?>

    <script src="Pokedex.js"></script>
</body>
</html>