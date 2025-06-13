<?php
include 'conexion.php';

$id = $_POST['id'];

$sql = "DELETE FROM estudiante WHERE id = $id";

if (mysqli_query($conexion, $sql)) {
    echo "Estudiante eliminado correctamente.";
} else {
    echo "Error al eliminar: " . mysqli_error($conexion);
}
?>
