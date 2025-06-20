<?php 
include "bd.php"; // Asegúrate de que el archivo esté en la ruta correcta
header("Content-Type: application/json");

$response = ["existe" => false];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $accion = $_POST["accion"] ?? '';

    if ($accion === "verificar_usuario") {
        $usuario = trim($_POST["usuario"]);

        $stmt = $pdo->prepare("SELECT id_docente FROM docente WHERE usuario = ?");
        $stmt->execute([$usuario]);

        if ($stmt->fetch()) {
            $response["existe"] = true;
        }
    }

    if ($accion === "verificar_documento") {
        $documento = trim($_POST["documento"]);

        $stmt = $pdo->prepare("SELECT id_docente FROM docente WHERE num_documento = ?");
        $stmt->execute([$documento]);

        if ($stmt->fetch()) {
            $response["existe"] = true;
        }
    }
    if ($accion === "verificar_correo") {
        $correo = trim($_POST["correo"]);

        $stmt = $pdo->prepare("SELECT id_docente FROM docente WHERE correo = ?");
        $stmt->execute([$correo]);

        if ($stmt->fetch()) {
            $response["existe"] = true;
        }
    }
}

echo json_encode($response);
?>