<?php
header("Content-Type: application/json");
require_once "conexion.php"; // Conexión a la base de datos

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"])) {
    echo json_encode(["success" => false, "message" => "Correo no proporcionado."]);
    exit;
}

$email = $data["email"];
$conn = new mysqli($host, $usuario, $clave, $bd);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit;
}

// Verificar si el correo existe
$sql = "SELECT * FROM usuarios WHERE correo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Correo no encontrado."]);
    exit;
}

// Generar una nueva contraseña aleatoria
$nueva_contrasena = substr(md5(time()), 0, 8);
$hashed_password = password_hash($nueva_contrasena, PASSWORD_BCRYPT);

// Actualizar la contraseña en la base de datos
$sql_update = "UPDATE usuarios SET contrasena = ? WHERE correo = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("ss", $hashed_password, $email);
$stmt_update->execute();

// Enviar la nueva contraseña por correo
$asunto = "Recuperación de contraseña - SWAB";
$mensaje = "Tu nueva contraseña es: $nueva_contrasena\nPor favor, cámbiala después de iniciar sesión.";
$headers = "From: soporte@swab.com";

if (mail($email, $asunto, $mensaje, $headers)) {
    echo json_encode(["success" => true, "message" => "Contraseña enviada correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo enviar el correo."]);
}

$conn->close();
?>
