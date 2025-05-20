<?php

include 'bd.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("  SELECT 
        e.id_estudiante, 
        e.nombre, 
        e.apellido, 
        p.id_programa, 
        p.nombre AS programa
    FROM estudiante e
    JOIN programa p ON e.id_programa = p.id_programa");
    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $estudiantes]);
    exit;
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
?>