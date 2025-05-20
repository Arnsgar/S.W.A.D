<?php
include 'bd.php';
header('Content-Type: application/json');

$id_programa = isset($_GET['id_programa']) ? intval($_GET['id_programa']) : 0;

try {
    if ($id_programa > 0) {
        $stmt = $pdo->prepare("
            SELECT m.id_modulo, m.nombre
            FROM programa_modulo pm
            JOIN modulo m ON pm.id_modulo = m.id_modulo
            WHERE pm.id_programa = ?
        ");
        $stmt->execute([$id_programa]);
        $modulos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $modulos]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Parámetro id_programa no válido']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>