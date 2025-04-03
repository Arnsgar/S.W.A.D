<?php
// Configuración de la base de datos
$host = 'localhost';
$user = 'root'; // Usuario por defecto de XAMPP
$password = ''; // Contraseña por defecto de XAMPP (vacía)
$database = 'registro'; // Nombre de la base de datos

try{
    $pdo=new PDO("mysql:host=$host;dbname=$database;charset=utf8",$user,$password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa a la base de datos 'registro'";
}catch(PDOException $e){
    echo "Error de conexión: " . $e->getMessage();
    // echo "Error de conexión: ".$e->getMessage();
}


?>