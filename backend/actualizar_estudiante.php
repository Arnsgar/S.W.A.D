<?php
include 'conexion.php';

$id = $_POST['id'];
$nombre = $_POST['nombre_est'];
$tipo_doc = $_POST['tipo_doc'];
$num_doc = $_POST['num_doc'];
$fecha_nac = $_POST['fecha_nac'];
$correo = $_POST['correo'];
$programa = $_POST['programa'];

$sql = "UPDATE estudiante SET 
            nombre_est = '$nombre', 
            tipo_doc = '$tipo_doc', 
            num_doc = '$num_doc', 
            fecha_nac = '$fecha_nac', 
            correo = '$correo', 
            programa = '$programa' 
        WHERE id = $id";

if (mysqli_query($conexion, $sql)) {
    echo "Estudiante actualizado";
} else {
    echo "Error: " . mysqli_error($conexion);
}
?>
