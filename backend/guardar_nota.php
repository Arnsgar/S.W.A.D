<?php
// filepath: c:\xampp\htdocs\S.W.A.D\backend\guardar_nota.php
include "bd.php";
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id_estudiante = $data['id_estudiante'] ?? null;
$id_modulo = $data['id_modulo'] ?? null;
$nota = $data['nota'] ?? null;

if (!$id_estudiante || !$id_modulo || $nota === null) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

try {
    // Si ya existe, actualiza; si no, inserta
    $stmt = $pdo->prepare("SELECT 1 FROM estudiante_modulo WHERE id_estudiante=? AND id_modulo=?");
    $stmt->execute([$id_estudiante, $id_modulo]);
    if ($stmt->fetch()) {
        $stmt = $pdo->prepare("UPDATE estudiante_modulo SET calificacion=? WHERE id_estudiante=? AND id_modulo=?");
        $stmt->execute([$nota, $id_estudiante, $id_modulo]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO estudiante_modulo (id_estudiante, id_modulo, calificacion) VALUES (?, ?, ?)");
        $stmt->execute([$id_estudiante, $id_modulo, $nota]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}