<?php
include "bd.php";


session_start();

header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];
file_put_contents("log.txt", "Se hizo una petición\n", FILE_APPEND);
if($_SERVER["REQUEST_METHOD"]=="POST"){
    try{
        if (!isset($_SESSION["id_administrador"])) {
            throw new Exception("No hay sesión activa de administrador.");
        }

    $rutaRelativa=null;

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
    $firmaBase64=isset($_POST["firmaBase64"]) ? $_POST["firmaBase64"] : null;
    //$firma=trim($_POST["firma"]);
    $id_administrador = $_SESSION["id_administrador"];

// Validar firma
if (!$firmaBase64 || strlen(trim($firmaBase64)) < 50) {
    $response["message"] = "Firma no válida o vacía.";
    echo json_encode($response);
    exit;
}

// Guardar firma
$firmaBase64 = str_replace('data:image/png;base64,', '', $firmaBase64);
$firmaBase64 = str_replace(' ', '+', $firmaBase64);
$imagenDatos = base64_decode($firmaBase64);

$nombreArchivo = 'firmaRector_' . time() . '.png';
$rutaRelativa = 'firmas/' . $nombreArchivo;
$rutaServidor = __DIR__ . '/firmas/' . $nombreArchivo;

file_put_contents($rutaServidor, $imagenDatos);


    $check= $pdo->prepare("SELECT id_instituto FROM instituto WHERE usuario = ? OR num_documento = ?");
    $check->execute([$username, $document_number]);
  if ($check->rowCount() > 0) {
            $response["message"] = "El usuario o documento ya está registrado.";
            echo json_encode($response);
            exit;
        }
file_put_contents("log.txt", "Datos recibidos: " . json_encode($_POST) . "\n", FILE_APPEND);

        $stmt=$pdo->prepare("INSERT INTO instituto 
            (nombre_instituto, direccion, telefono, correo, nombre, apellidos, id_tipodoc, num_documento, usuario, contraseña, codigo, firma, tipo_codigo, id_administrador)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$institute_name, $address, $phone, 
        $email, $rector_name, $rector_surname, $document_type, 
        $document_number, $username, $password, $code, $rutaRelativa, $code_type, 
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