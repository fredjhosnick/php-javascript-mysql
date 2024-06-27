<?php
header("Access-Control-Allow-Origin: http://localhost:5500");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$ficheroABorrar = urldecode($_POST['ficheroABorrar']);
if (file_exists("../" . $ficheroABorrar)) {
    unlink("../" . $ficheroABorrar);
    echo "Fichero borrado";
} else {
    echo "El fichero no existe";
}
?>