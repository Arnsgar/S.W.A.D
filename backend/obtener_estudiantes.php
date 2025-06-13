<?php
include "bd.php";
session_start();
header('Content-Type: application/json');

// Verifica que el docente esté logueado
if (!isset($_SESSION['id_docente'])) {
    echo json_encode(['success' => false, 'error' => 'No hay sesión activa de docente.']);
    exit;
}

$id_docente = $_SESSION['id_docente'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            e.id_estudiante,
            e.nombre,
            e.apellido,
            e.correo,
            e.num_documento AS cedula,
            p.nombre AS programa
        FROM estudiante e
        INNER JOIN programa p ON e.id_programa = p.id_programa
        WHERE e.id_docente = ?
        ORDER BY e.apellido, e.nombre
    ");
    $stmt->execute([$id_docente]);
    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $estudiantes]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
