<?php
session_start();

if (!isset($_SESSION['diploma_data'])) {
    die("No se encontraron datos para el diploma.");
}

$data = $_SESSION['diploma_data'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Diploma de Certificación</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
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
  <div class="certificado">
    <div class="decoracion"><i class="fas fa-certificate"></i></div>
    <div class="logo"><img src="../img/logo2.png" alt="Logo Institución"></div>

    <div class="text-center">
      <h1>Diploma de Certificación</h1>
      <h2>Otorgado a</h2>
      <div class="nombre"><?php echo htmlspecialchars($data['nombre']); ?></div>
      <div class="texto">
        En reconocimiento por haber completado exitosamente el programa <strong><?php echo htmlspecialchars($data['programa']); ?></strong>, demostrando excelencia y compromiso académico.
      </div>
      <div class="texto">
        Estado del Programa: <strong><?php echo htmlspecialchars($data['estado']); ?></strong>
      </div>
      <div class="texto">
        Total de Módulos: <strong><?php echo htmlspecialchars($data['total_modulos']); ?></strong>
      </div>
      <div class="texto">
        Módulos Cursados: <strong><?php echo htmlspecialchars($data['modulos_cursados']); ?></strong>
      </div>
    </div>

    <div class="firmas">
      <div class="firma">Director Académico</div>
      <div class="firma">Fecha: <?php echo date("d \d\e F \d\e Y"); ?></div>
    </div>
  </div>
</body>
</html>
