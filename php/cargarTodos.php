<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'datosConexion.php'; 

$sql = "SELECT imags FROM albumes";
$result = $conn->query($sql);

$albumes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $albumes[] = json_decode($row['imags'], true);
    }
}

$conn->close();

echo json_encode($albumes);
?>