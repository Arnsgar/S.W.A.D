<?php
// filepath: c:\xampp\htdocs\S.W.A.D\backend\listar_modulos_estudiante.php
include "bd.php";
header('Content-Type: application/json');

$id_estudiante = $_GET['id_estudiante'] ?? null;
if (!$id_estudiante) {
    echo json_encode(['success' => false, 'error' => 'ID de estudiante no proporcionado']);
    exit;
}

try {
    $stmt = $pdo->prepare("
       SELECT 
            pm.id_modulo, 
            m.nombre AS modulo, 
            p.nombre AS programa,
            em.calificacion
        FROM programa_modulo pm
        INNER JOIN modulo m ON pm.id_modulo = m.id_modulo
        INNER JOIN programa p ON pm.id_programa = p.id_programa
        INNER JOIN estudiante e ON e.id_programa = pm.id_programa
        LEFT JOIN estudiante_modulo em 
            ON em.id_estudiante = e.id_estudiante AND em.id_modulo = pm.id_modulo
        WHERE e.id_estudiante = ?
        ORDER BY m.nombre
    ");
    $stmt->execute([$id_estudiante]);
    $modulos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $modulos]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}