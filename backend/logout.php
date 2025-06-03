<?php
// Inicia la sesión si aún no se ha iniciado
session_start();

// Destruye todos los datos de sesión
session_unset();
session_destroy();

// Redirige al inicio de sesión o página principal
header("Location: ../html/index.html");
exit();
?>