<?php
header("Content-Type: application/json");
require_once "bd.php"; // Incluye la conexión PDO

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $id = isset($_GET["id"]) ? intval($_GET["id"]) : null;
    $num_documento = isset($_GET["num_documento"]) ? trim($_GET["num_documento"]) : null;
    $nombre_instituto = isset($_GET["nombre_instituto"]) ? trim($_GET["nombre_instituto"]) : null;

    try {
        $query = "SELECT * FROM instituto WHERE 1=1";
        $params = [];

        if ($id) {
            $query .= " AND id_instituto = ?";
            $params[] = $id;
        }
        if ($num_documento) {
            $query .= " AND num_documento = ?"; // Asegurarse de que el campo num_documento esté correctamente definido
            $params[] = $num_documento;
        }
        if ($nombre_instituto) {
            $query .= " AND nombre_instituto LIKE ?";
            $params[] = "%" . $nombre_instituto . "%";
        }

        // Registro de depuración
        error_log("Consulta: $query");
        error_log("Parámetros: " . json_encode($params));

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $institutos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($institutos) {
            echo json_encode(["success" => true, "institutos" => $institutos]);
        } else {
            echo json_encode(["success" => false, "message" => "No se encontraron resultados."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error en la consulta: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Solicitud inválida."]);
}
?>
