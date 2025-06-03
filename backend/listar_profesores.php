<?php
// filepath: c:\xampp\htdocs\S.W.A.D\backend\listar_estudiantes_por_docente.php
require_once "bd.php";
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
        SELECT e.id_estudiante, 
        e.nombre, e.apellido, 
        e.num_documento AS cedula, 
        p.nombre AS programa 
        FROM estudiante e 
        INNER JOIN programa p ON e.id_programa = p.id_programa 
        WHERE e.id_docente = ? ORDER BY e.apellido, e.nombre;
    ");
    $stmt->execute([$id_docente]);
    $docente = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $docente]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
