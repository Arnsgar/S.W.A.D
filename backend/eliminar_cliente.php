<?php
include "bd.php";
session_start();
header("Content-Type: application/json");

try {
    // Recibir el id por JSON
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['id'])) {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
        exit;
    }
    $id = $input['id'];

    // Eliminar el instituto de la base de datos
    $stmt = $pdo->prepare("DELETE FROM instituto WHERE id_instituto = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontró el instituto o ya fue eliminado']);
    }
} catch (PDOException $e) {
    // Si es un error de clave foránea (código 23000)
    if ($e->getCode() == 23000) {
        echo json_encode([
            'success' => false,
            'message' => 'No se puede eliminar el instituto porque tiene docentes vinculados.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}

?>