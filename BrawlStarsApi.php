<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datos Api Clash Of Clans</title>
    <link rel="stylesheet" href="BrawlStarsApi.css">
</head>
<body>
    <?php
        $url="https://api.brawlstars.com/v1/brawlers/";
        $openUrl=curl_init($url);

        curl_setopt($openUrl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($openUrl, CURLOPT_HTTPHEADER, ['Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImQ0OTE3ZTY2LTY0NmUtNGFjMC05OTA0LTZlNjA0ODkwZGU0NyIsImlhdCI6MTc3ODc0MzY2NCwic3ViIjoiZGV2ZWxvcGVyLzUxZDIxMjVjLTAxMTQtYTIyNS0yMmUyLTk5MDJmYzIxODk4NSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg1LjEwNy41Ni40NSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.RH-nQHUn6XL0izzQHh0khUMfo0Uv08_LgGV-_Fc3CC1PcMqPSAqCKGGiXjpc-eSW_vZ3_D3Up9A3zj7UpNyDvw']);
        $respuesta=curl_exec($openUrl);
        curl_close($openUrl);
        
        $datos=json_decode($respuesta, true);
        $brawlers = $datos['items'];
        $brawler = $brawlers[array_rand($brawlers)];
        
        echo "<div>";
        echo "<table border='2'>";
        echo "<tr>";
        echo "<td colspan='5'><h2>".$brawler['name']."</h2></td>";
        echo "</tr>";
        echo "<tr>";
        echo "<td colspan='5'><img src='https://cdn.brawlify.com/brawlers/borderless/" . $brawler['id'] . ".png'></td>";
        echo "</tr>";
        echo "<tr>";
        foreach ($brawler['gadgets'] as $gadget){
        echo "<td><h2>".$gadget['name']."</h2></td>";
        }
        foreach ($brawler['starPowers'] as $starPowers){
        echo "<td><h2>".$starPowers['name']."</h2></td>";
        }
        echo "<form action=''>";
          echo "<td><button type='submit'>Buscar</button></td>";
        echo "</form>";
        echo "</tr>";
        echo "</table>";
        echo "</div>";
    ?>
</body>
</html>