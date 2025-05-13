<?php
session_start();
include "bd.php";
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];
file_put_contents("log.txt", "Se hizo una petición\n", FILE_APPEND);
if($_SERVER["REQUEST_METHOD"]=="POST"){
    try{
        if (!isset($_SESSION["id_administrador"])) {
            throw new Exception("No hay sesión activa de administrador.");
        }

 
    $institute_name=trim($_POST["institute_name"]);
    $address=trim($_POST["address"]);
    $phone=trim($_POST["phone"]);
    $email=trim($_POST["email"]);
    $rector_name=trim($_POST["rector_name"]);
    $rector_surname=trim($_POST["rector_surname"]);
    $document_type=trim($_POST["document_type"]);
    $document_number=trim($_POST["document_number"]);
    $username=trim($_POST["username"]);
    $password=password_hash(trim($_POST["password"]), PASSWORD_DEFAULT);
    $code_type=strtolower(trim($_POST["code_type"]));
    $code=trim($_POST["code"]);
    //$firma=trim($_POST["firma"]);
    $id_administrador = $_SESSION["id_administrador"];

    $check= $pdo->prepare("SELECT id_instituto FROM instituto WHERE usuario = ? OR num_documento = ?");
    $check->execute([$username, $document_number]);
  if ($check->rowCount() > 0) {
            $response["message"] = "El usuario o documento ya está registrado.";
            echo json_encode($response);
            exit;
        }
file_put_contents("log.txt", "Datos recibidos: " . json_encode($_POST) . "\n", FILE_APPEND);

        $stmt=$pdo->prepare("INSERT INTO instituto 
            (nombre_instituto, direccion, telefono, correo, nombre, apellidos, id_tipodoc, num_documento, usuario, contraseña, codigo, tipo_codigo, id_administrador)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$institute_name, $address, $phone, 
        $email, $rector_name, $rector_surname, $document_type, 
        $document_number, $username, $password, $code, $code_type, 
        $id_administrador]);

        $response["success"] = true;
        $response["message"] = "Instituto registrado exitosamente.";



    }catch (PDOException $e) {
        $response["message"] = "Error al registrar el instituto: " . $e->getMessage();
        } catch (Exception $e) {
                 $response["message"] = "Error: " . $e->getMessage();
         }
};

echo json_encode($response);


?>