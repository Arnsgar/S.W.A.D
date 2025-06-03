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

        // 1. Obtener la ruta de la firma
    $stmt = $pdo->prepare("SELECT firma FROM docente WHERE id_docente = ?");
    $stmt->execute([$id]);
    $docente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($docente && !empty($docente['firma'])) {
        $rutaFirma = __DIR__ . '/../' . $docente['firma'];
        // 2. Eliminar el archivo físico si existe
        if (file_exists($rutaFirma)) {
            unlink($rutaFirma);
        }
    }

    // Eliminar el docente de la base de datos
    $stmt = $pdo->prepare("DELETE FROM docente WHERE id_docente = ?");
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
            'message' => 'No se puede eliminar el docente porque tiene estudiantes vinculados.'
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
}

?>