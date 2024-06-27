<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'datosConexion.php';   
$data = json_decode(file_get_contents("php://input"),true);

if ($data && isset($data['aGuardar']) && is_array($data['aGuardar'])) {
    $values = array();
    foreach ($data['aGuardar'] as $item) {
        $value = $conn->real_escape_string(json_encode($item));
        $values[] = "('$value')";
    }

    $sql = "TRUNCATE TABLE albumes";
    if ($conn->query($sql) === TRUE) {
        $sql = "INSERT INTO albumes (imags) VALUES " . implode(',', $values);

        if ($conn->query($sql) === TRUE) {
            echo "Datos insertados correctamente";
        } else {
            echo "Error al insertar datos: " . $conn->error;
        }
    } else {
        echo "Error al truncar tabla: " . $conn->error;
    }
} else {
    echo "Datos no recibidos correctamente o no es un arreglo válido";
}

$conn->close();
?>