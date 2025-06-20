<?php
include "bd.php";


session_start();
if (!isset($_SESSION['docente_id'])) {
    header('Location: login.php');
    exit();
}
header("Content-Type: application/json");

$response = ["success" => false, "message" => ""];
file_put_contents("log.txt", "Se hizo una petición\n", FILE_APPEND);
if($_SERVER["REQUEST_METHOD"]=="POST"){
    try{
        if (!isset($_SESSION["id_instituto"])) {
            throw new Exception("No hay sesión activa de Instituto.");
        }

    $rutaRelativa=null;

    $name=trim($_POST["nombres"]);
    $surname=trim($_POST["apellidos"]);
    $document_type=trim($_POST["tipoDoc"]);
    $document_number=trim($_POST["numDoc"]);
    $email=trim($_POST["correo"]);
    $phone=trim($_POST["telefono"]);
    $firmaBase64=isset($_POST["firmaBase64"]) ? $_POST["firmaBase64"] : null;
    $username=trim($_POST["usuario"]);
    $password=password_hash(trim($_POST["contrasena"]), PASSWORD_DEFAULT);
  
    $id_instituto = $_SESSION["id_instituto"];

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

$nombreArchivo = 'firmaDocente_' . time() . '.png';
$rutaRelativa = 'firmas/' . $nombreArchivo;
$rutaServidor = __DIR__ . '/firmas/' . $nombreArchivo;

file_put_contents($rutaServidor, $imagenDatos);


    $check= $pdo->prepare("SELECT id_docente FROM docente WHERE usuario = ? OR num_documento = ?");
    $check->execute([$username, $document_number]);
  if ($check->rowCount() > 0) {
            $response["message"] = "El usuario o documento ya está registrado.";
            echo json_encode($response);
            exit;
        }

file_put_contents("log.txt", "Datos recibidos: " . json_encode($_POST) . "\n", FILE_APPEND);

        $stmt=$pdo->prepare("INSERT INTO docente 
            (nombres, apellidos, id_tipodoc, num_documento, correo,telefono, usuario, contraseña, id_instituto, firma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $surname, $document_type, $document_number, $email, $phone, $username, $password, $id_instituto, $rutaRelativa]);

        $response["success"] = true;
        $response["message"] = "Docente registrado exitosamente.";



    }catch (PDOException $e) {
        $response["message"] = "Error al registrar el docente: " . $e->getMessage();
        } catch (Exception $e) {
                 $response["message"] = "Error: " . $e->getMessage();
         }
};

echo json_encode($response);


?>