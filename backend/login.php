<?php
session_start();
include "bd.php";

if($_SERVER["REQUEST_METHOD"]=="POST"){
$user=$_POST["user"];
$password=$_POST["password"];

//Verificar que el usuario exista en la BD

$sql="SELECT* FROM docentes WHERE usuario=? LIMIT=1";
$stmt=$pdo->prepare($sql);
$stmt->execute([$user]);
$docente=stmt->fetch(PDO::FETCH_ASSC);

//verificar si se encontro el usuario
if($docente){
    if($password==$docente["contraseña"]){
        $_SESSION["user"]=$profesores["usuario"];
        $_SESSION["id"]=$profesor["id_profesor"]
    } 
}

}


?>