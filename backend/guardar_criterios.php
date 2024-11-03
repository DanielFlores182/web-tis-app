<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: https://webtismanager.netlify.app"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header('Content-Type: application/json');
include 'db_connection.php';

// Lee los datos JSON enviados en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['criterios'])) {
    echo json_encode(['error' => 'No se recibieron datos de criterios']);
    exit();
}

try {
    // Inicia una transacción
    $conn->beginTransaction();

    // Limpia la tabla actual (opcional)
    $conn->exec("DELETE FROM criterios");

    // Inserta los nuevos criterios
    $stmt = $conn->prepare("INSERT INTO criterios (nombre, descripcion, porcentaje) VALUES (:nombre, :descripcion, :porcentaje)");

    foreach ($data['criterios'] as $criterio) {
        $stmt->execute([
            ':nombre' => $criterio['nombre'],
            ':descripcion' => $criterio['descripcion'],
            ':porcentaje' => $criterio['porcentaje']
        ]);
    }

    // Confirmar transacción
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Criterios guardados exitosamente']);
} catch (Exception $e) {
    // Revertir transacción si ocurre un error
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error al guardar criterios', 'error' => $e->getMessage()]);
}
?>
