<?php
session_start();
include "bd.php";

if($_SERVER["REQUEST_METHOD"]=="POST"){
$user=$_POST["user"];
$password=$_POST["password"];
$rol=strtolower($_POST["userType"]);

$roles_permitidos=["administrador", "docente", "estudiante", "instituto"]


// verifica que el tipo elejido
if(in_array($rol,$roles_permitidos)){

    $sql="SELECT* FROM $rol WHERE usuario=? LIMIT 1";
    $stmt=$pdo->prepare($sql);
    $stmt->execute([$user]);

    $usuario=stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario && password_verify($password, $usuario["contraseña"])) {
        $_SESSION["user"] = $usuario["usuario"];
        $_SESSION["id"] = $usuario["id"];
        $_SESSION["role"] = $role;

        // Redirección basada en rol
        switch ($role) {
            case "administrador":
                header("Location: ../html/admin.html");
                break;
            case "docente":
                header("Location: ../html/docentes.html");
                break;
            case "estudiante":
                header("Location: ../html/estudiantes.html");
                break;
            case "instituto":
                header("Location: ../html/cliente.html");
                break;
        }
        exit();
    } else {
        echo "Usuario o contraseña incorrectos.";
    }
} else {
    echo "Rol no válido.";
}
}





?>