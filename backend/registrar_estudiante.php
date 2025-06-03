<?php
// backend/registrar_estudiante.php
session_start();
header('Content-Type: application/json');
include 'bd.php';
if (!isset($_SESSION['id_docente'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión activa de docente.']);
    exit;
}
$id_docente = $_SESSION['id_docente'];

// Recibir datos del formulario (POST)
$data = json_decode(file_get_contents('php://input'), true);

$campos = [
    'nombre', 'apellido', 'id_tipodoc', 'num_documento', 'sexo_nacimiento', 'fecha_nacimiento', 'nacionalidad',
    'departamento', 'municipio', 'direccion_residencia', 'correo', 'telefono', 'usuario', 'contrasena',
    'nivel_estudios', 'institucion_procedencia', 'año_graduacion', 'id_programa'
];

foreach ($campos as $campo) {
    if (!isset($data[$campo]) || $data[$campo] === '') {
        echo json_encode(['success' => false, 'message' => "Falta el campo: $campo"]);
        exit;
    }
}
// Obtener el id_docente de la sesión

try {
    $stmt = $pdo->prepare("INSERT INTO estudiante (nombre, apellido, id_tipodoc, num_documento, sexo_nacimiento, fecha_nacimiento, nacionalidad, departamento, municipio, direccion_residencia, correo, telefono, usuario, contraseña, nivel_estudios, institucion_procedencia, año_graduacion, id_programa, id_docente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['nombre'],
        $data['apellido'],
        $data['id_tipodoc'],
        $data['num_documento'],
        $data['sexo_nacimiento'],
        $data['fecha_nacimiento'],
        $data['nacionalidad'],
        $data['departamento'],
        $data['municipio'],
        $data['direccion_residencia'],
        $data['correo'],
        $data['telefono'],
        $data['usuario'],
        password_hash($data['contrasena'], PASSWORD_DEFAULT),
        $data['nivel_estudios'],
        $data['institucion_procedencia'],
        $data['año_graduacion'],
        $data['id_programa'],
         $id_docente // <-- de la sesión
    ]);
    echo json_encode(['success' => true, 'message' => 'Estudiante registrado correctamente']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $e->getMessage()]);
}
?>
