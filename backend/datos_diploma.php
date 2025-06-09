<?php
// filepath: c:\xampp\htdocs\S.W.A.D\backend\datos_diploma.php
session_start();
header('Content-Type: application/json');
require_once "bd.php";

$id_estudiante = $_SESSION['id_estudiante'] ?? null;
if (!$id_estudiante) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

// Consulta igual a la de generar_diploma.php
$sql = "SELECT 
            e.nombre,
            p.nombre AS programa,
            COUNT(DISTINCT pm.id_modulo) AS total_modulos,
            COUNT(DISTINCT em.id_modulo) AS modulos_cursados,
            CASE 
                WHEN COUNT(DISTINCT pm.id_modulo) = COUNT(DISTINCT em.id_modulo) 
                     AND COUNT(DISTINCT pm.id_modulo) > 0
                THEN 'COMPLETO'
                ELSE 'INCOMPLETO'
            END AS estado
        FROM estudiante e
        INNER JOIN programa p ON e.id_programa = p.id_programa
        INNER JOIN programa_modulo pm ON pm.id_programa = p.id_programa
        LEFT JOIN estudiante_modulo em 
            ON em.id_estudiante = e.id_estudiante 
            AND em.id_modulo = pm.id_modulo
            AND em.calificacion IS NOT NULL
        WHERE e.id_estudiante = ?
        GROUP BY e.id_estudiante, e.nombre, p.nombre";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id_estudiante]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);

// Firmas y nombres
$stmt2 = $pdo->prepare("
    SELECT 
        d.firma AS firma_docente,
        i.firma AS firma_instituto,
        d.nombres AS nombre_docente,
        i.nombre AS nombre_instituto
    FROM estudiante e
    INNER JOIN docente d ON e.id_docente = d.id_docente
    INNER JOIN instituto i ON d.id_instituto = i.id_instituto
    WHERE e.id_estudiante = ?
    LIMIT 1
");
$stmt2->execute([$id_estudiante]);
$firmas = $stmt2->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'data' => $data,
    'firmas' => $firmas
]);