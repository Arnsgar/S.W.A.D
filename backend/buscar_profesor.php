<?php
include 'bd.php'; // Conexión a la base de datos

// Asegurarse de que la conexión a la base de datos esté definida
if (!isset($pdo)) {
    die('Error: No se pudo establecer la conexión a la base de datos.');
}

// Obtener el parámetro de búsqueda unificado
$busqueda = isset($_GET['busqueda']) ? $_GET['busqueda'] : null;

// Ajustar la consulta SQL para excluir el campo contraseña
$query = "SELECT id_docente, nombres, apellidos, id_tipodoc, num_documento, correo, telefono, usuario, fecha_registro FROM docente WHERE 1=1";

// Agregar filtro según el parámetro recibido
if ($busqueda) {
    $query .= " AND (id_docente = ? OR nombres LIKE ? OR num_documento = ?)";
}

$stmt = $pdo->prepare($query);

// Vincular parámetros
if ($busqueda) {
    $likeBusqueda = '%' . $busqueda . '%';
    $stmt->bindParam(1, $busqueda, PDO::PARAM_STR);
    $stmt->bindParam(2, $likeBusqueda, PDO::PARAM_STR);
    $stmt->bindParam(3, $busqueda, PDO::PARAM_STR);
}

$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

$profesores = [];
foreach ($result as $row) {
    $profesores[] = $row;
}

// Devolver los resultados en formato JSON
header('Content-Type: application/json');
echo json_encode($profesores);
?>