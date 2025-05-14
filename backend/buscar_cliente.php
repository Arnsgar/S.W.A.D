<?php
// filepath: d:\Users\JUANES\Downloads\S.W.A.D-main\S.W.A.D-main\backend\buscar_cliente.php

header("Content-Type: application/json");
require_once "bd.php"; // Incluye la conexión PDO

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {
    $id = intval($_GET["id"]); // Sanitizar el ID recibido

    try {
        $stmt = $pdo->prepare("SELECT * FROM instituto WHERE id_instituto = ?");
        $stmt->execute([$id]);
        $instituto = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($instituto) {
            echo json_encode(["success" => true, "instituto" => $instituto]);
        } else {
            echo json_encode(["success" => false, "message" => "Instituto no encontrado."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error en la consulta: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Solicitud inválida."]);
}
?>