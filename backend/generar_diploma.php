<?php
session_start();


require('../backend/bd.php');
require('../backend/generar_diploma/dompdf/autoload.inc.php');

use Dompdf\Dompdf;

// Verificar si el estudiante está autenticado
if (!isset($_SESSION['id_estudiante'])) {
    die("Acceso denegado. Por favor, inicia sesión.");
}

$id_estudiante = $_SESSION['id_estudiante'];

// Consulta para obtener los datos del estudiante
$sql = "SELECT 
            e.id_estudiante,
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
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($result) === 0) {
    die("No se encontraron datos para el estudiante.");
}

$data = $result[0];


// Obtener firmas y nombres
$stmt = $pdo->prepare("
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
$stmt->execute([$id_estudiante]);
$firmas = $stmt->fetch(PDO::FETCH_ASSOC);

$root = $_SERVER['DOCUMENT_ROOT'];
$base = '/S.W.A.D/backend/'; // Ahora incluye /backend/

$firma_docente = $firmas['firma_docente'] ? $root . $base . $firmas['firma_docente'] : '';
$firma_instituto = $firmas['firma_instituto'] ? $root . $base . $firmas['firma_instituto'] : '';
$nombre_docente = $firmas['nombre_docente'] ?? 'Docente';
$nombre_instituto = $firmas['nombre_instituto'] ?? 'Rector';

file_put_contents('debug_ruta_firma.txt', $firma_docente . PHP_EOL . $firma_instituto);
if (!file_exists($firma_docente)) {
    file_put_contents('debug_ruta_firma.txt', "NO EXISTE: $firma_docente" . PHP_EOL, FILE_APPEND);
}
if (!file_exists($firma_instituto)) {
    file_put_contents('debug_ruta_firma.txt', "NO EXISTE: $firma_instituto" . PHP_EOL, FILE_APPEND);
}
// Generar el contenido del diploma directamente
$html = "<!DOCTYPE html>
<html lang='es'>
<head>
  <meta charset='UTF-8'>
  <title>Diploma de Certificación</title>
  <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
  <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto&display=swap' rel='stylesheet'>
  <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css' rel='stylesheet'>
  <style>
    body {
      background: #fefcf7;
      font-family: 'Roboto', sans-serif;
      padding: 40px;
    }
    .certificado {
      border: 10px solid #d4af37;
      padding: 40px 60px;
      background: white;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      position: relative;
    }
    .certificado h1 {
      font-family: 'Playfair Display', serif;
      color: #bfa036;
      font-size: 36px;
      margin-bottom: 20px;
    }
    .certificado h2 {
      font-size: 20px;
      color: #444;
    }
    .nombre {
      font-size: 28px;
      font-weight: bold;
      color: #000;
      margin: 30px 0;
    }
    .texto {
      font-size: 16px;
      margin-bottom: 40px;
    }
    .firmas {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
    }
    .firma {
      text-align: center;
      width: 200px;
      border-top: 1px solid #888;
      padding-top: 5px;
    }
    .logo {
      position: absolute;
      top: 40px;
      right: 40px;
    }
    .logo img {
      width: 80px;
    }
    .decoracion {
      position: absolute;
      top: 40px;
      left: 40px;
      font-size: 36px;
      color: #d4af37;
    }
  </style>
</head>
<body>

  <div class='certificado'>
    <div class='decoracion'><i class='fas fa-certificate'></i></div>
    <div class='logo'><img src='../img/logo2.png' alt='Logo Institución'></div>

    <div class='text-center'>
      <h1>Diploma de Certificación</h1>
      <h2>Otorgado a</h2>
      <div class='nombre'>" . htmlspecialchars($data['nombre']) . "</div>
      <div class='texto'>
        En reconocimiento por haber completado exitosamente el programa <strong>" . htmlspecialchars($data['programa']) . "</strong>, demostrando excelencia y compromiso académico.
      </div>
      <div class='texto'>
        Estado del Programa: <strong>" . htmlspecialchars($data['estado']) . "</strong>
      </div>
      <div class='texto'>
        Total de Módulos: <strong>" . htmlspecialchars($data['total_modulos']) . "</strong>
      </div>
      <div class='texto'>
        Módulos Cursados: <strong>" . htmlspecialchars($data['modulos_cursados']) . "</strong>
      </div>
    </div>

       <div class='firmas'>
      <div class='firma'>
        <img src='" . htmlspecialchars($firma_instituto) . "' alt='Firma Rector' style='height:60px;'><br>
        " . htmlspecialchars($nombre_instituto) . "<br>
        Rector
      </div>
      <div class='firma'>
        <img src='" . htmlspecialchars($firma_docente) . "' alt='Firma Docente' style='height:60px;'><br>
        " . htmlspecialchars($nombre_docente) . "<br>
        Docente
      </div>
      <div class='firma'>Fecha: " . date("d \d\e F \d\e Y") . "</div>
<img src='C:/xampp/htdocs/S.W.A.D/prueba.jpg' style='height:60px;'>    </div>

    <div class='text-center mt-4'>
      <a href='../backend/generar_diploma.php?download=true' class='btn btn-outline-primary'>Descargar Diploma en PDF</a>
    </div>
  </div>
</body>
</html>";

if (isset($_GET['download'])) {
    $dompdf = new Dompdf();
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    $dompdf->stream("Diploma_" . $data['nombre'] . ".pdf", ["Attachment" => true]);
    exit;
}

// Mostrar el diploma en el navegador
echo $html;
?>
