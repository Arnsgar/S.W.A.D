<?php
require_once "bd.php"; 

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("
        SELECT 
            id_docente AS id, 
            nombres AS nombres, 
            apellidos AS apellidos, 
            id_tipodoc AS tipo_documento, 
            num_documento AS numero_documento, 
            correo AS correo,
            telefono AS telefono, 
            usuario AS usuario     
        FROM docente
    ");

    $docente = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $docente]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
