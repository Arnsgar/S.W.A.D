<?php
require_once 'dompdf/autoload.inc.php';

use Dompdf\Dompdf;

// Reemplaza dinámicamente los datos
$html = file_get_contents('diploma_template.html');
$html = str_replace('{{NOMBRE_ESTUDIANTE}}', 'Juan Pérez', $html);
$html = str_replace('{{NOMBRE_PROGRAMA}}', 'Desarrollo Web Full Stack', $html);
$html = str_replace('{{FECHA_GRADUACION}}', date('d/m/Y'), $html);

// Inicializa Dompdf
$dompdf = new Dompdf();
$dompdf->loadHtml($html);

// Configura el tamaño y orientación del papel
$dompdf->setPaper('A4', 'portrait'); // Vertical

// Renderiza y envía al navegador
$dompdf->render();
$dompdf->stream("diploma_Juan_Perez.pdf", array("Attachment" => false)); // false: muestra en navegador
?>