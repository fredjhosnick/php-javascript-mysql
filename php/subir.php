<?php
// Include CORS headers
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Define directory and filenames
$carpeta = "../ficheros/";
$nombreOriginal = basename($_FILES["fichero"]["name"]);
$uploadOK = 1;
$formatImagen = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
$nombreUnico = md5(uniqid());
$nombreFinal = $carpeta . $nombreUnico . "." . $formatImagen;
$imagenAMostrar = "ficheros/" . $nombreUnico . "." . $formatImagen;

// Check if the file is an image
$check = getimagesize($_FILES["fichero"]["tmp_name"]);
if ($check === false) {
    echo json_encode(["status" => "error", "message" => "El archivo no es una imagen. Lo siento, únicamente se pueden subir imágenes."]);
    $uploadOK = 0;
}

// Check file size
if ($_FILES["fichero"]["size"] > 10000000) {
    echo json_encode(["status" => "error", "message" => "Lo siento, tu archivo es demasiado grande. El tamaño máximo es 10MB."]);
    $uploadOK = 0;
}

// Attempt to upload the file if all checks pass
if ($uploadOK === 1) {
    if (move_uploaded_file($_FILES["fichero"]["tmp_name"], $nombreFinal)) {
        echo json_encode(["status" => "success", "file" => $imagenAMostrar]);
    } else {
        echo json_encode(["status" => "error", "message" => "Lo siento, hubo un error al subir el archivo."]);
    }
}
?>