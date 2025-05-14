<?php
require_once "bd.php"; // Asegúrate que $pdo esté definido aquí

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT 
            id_instituto AS id, 
            nombre AS nombres, 
            apellidos, 
            id_tipodoc AS tipo_documento, 
            num_documento AS numero_documento, 
            correo, 
            usuario, 
            nombre_instituto AS empresa
        FROM instituto
    ");

    $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $clientes]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
