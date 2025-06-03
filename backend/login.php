<?php
session_start();
include "bd.php";
date_default_timezone_set("America/Bogota");
header("Content-Type: application/json");
$response = ["success" => false, "message" => ""];



if($_SERVER["REQUEST_METHOD"]=="POST"){
    $roles_permitidos=["administrador", "docente", "estudiante", "instituto"];
    $user=trim($_POST["user"]);
    $password=$_POST["password"];
    $rol=strtolower($_POST["userType"]);
 
   
    if(!isset($_POST["noRobot"])){
        $response["message"] = "Verifica que no eres un robot.";
        echo json_encode($response);
        exit();
    }

    if(!isset($_SESSION["intentos"])){
        $_SESSION["intentos"]=0;
        $_SESSION["bloqueo_hasta"]=null;

    }
    $ahora=time();

    if (!empty($_SESSION["bloqueo_hasta"]) && $ahora < $_SESSION["bloqueo_hasta"]) {
        $response["message"] = "Usuario bloqueado hasta " . date("H:i:s", $_SESSION["bloqueo_hasta"]);
        echo json_encode($response);
        exit();
    }


    if (in_array($rol, $roles_permitidos)) {
   
    $stmt=$pdo->prepare("SELECT * FROM  $rol WHERE usuario = ? LIMIT 1");
    $stmt->execute([$user]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);





    if ($usuario && password_verify($password, $usuario["contraseña"])) {
        $_SESSION["user"] = $usuario["usuario"];
        $_SESSION["rol"] = $rol;
             if ($rol === "administrador") {
                 $_SESSION["id_administrador"] = $usuario["id_administrador"]; // 🟢 Guarda el ID en sesión
             }
             if ($rol === "instituto") {
                 $_SESSION["id_instituto"] = $usuario["id_instituto"]; // 🟢 Guarda el ID en sesión
             }
             if ($rol === "docente") {
                 $_SESSION["id_docente"] = $usuario["id_docente"]; // 🟢 Guarda el ID en sesión
             }
             if ($rol === "estudiante") {
                 $_SESSION["id_estudiante"] = $usuario["id_estudiante"]; // 🟢 Guarda el ID en sesión
             }
        $_SESSION["intentos"]=0;
        $_SESSION["bloqueo_hasta"]=null;    

        // Redirección basada en rol
        $redirecciones = [
            "administrador" => "../html/admin.html",
            "docente" => "../html/docentes.html",
            "estudiante" => "../html/estudiantes.html",
            "instituto" => "../html/cliente.html"
        ];

        $response["success"] = true;
        $response["redirect"] = $redirecciones[$rol];
    
    } else {
        $_SESSION["intentos"]++;
        if($_SESSION["intentos"]>=10){
            $_SESSION["bloqueo_hasta"]=$ahora+600;
            $response["message"] = "Demasiados intentos fallidos. Usuario bloqueado por 10 minutos.";
        }else{
            $response["message"] = "Usuario o contraseña incorrectos.";
        }
       
    }
} else {
    $response["message"] = "Rol no válido.";

}
}

echo json_encode($response);
exit();

?>