<?php
// filepath: c:\xampp\htdocs\S.W.A.D\backend\datos_estudiante.php
session_start();
header('Content-Type: application/json');
require_once "bd.php";

$id_estudiante = $_SESSION['id_estudiante'] ?? null;
if (!$id_estudiante) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

$stmt = $pdo->prepare("SELECT e.nombre, p.nombre AS programa FROM estudiante e INNER JOIN programa p ON e.id_programa = p.id_programa WHERE e.id_estudiante = ?");
$stmt->execute([$id_estudiante]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'data' => $data]);
?>