<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); // Permitir solicitudes desde el frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header('Content-Type: application/json');
require 'db_conection.php';

try {
    if (!isset($_GET['id'])) {
        throw new Exception('ID de tarea no proporcionado.');
    }

    $idTarea = $_GET['id'];

    // Obtener detalles de la tarea
    $query = "SELECT detalle, entregado, archivo FROM tarea WHERE id_tarea = :id"; // Asegúrate de que 'archivo' sea el nombre correcto de tu columna
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $idTarea);
    $stmt->execute();
    $tarea = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tarea) {
        throw new Exception('Tarea no encontrada.');
    }

    // Devolver respuesta con los campos requeridos
    echo json_encode([
        'detalle' => $tarea['detalle'],
        'entregado' => $tarea['entregado'], // Este será un booleano
        'archivo' => base64_encode($tarea['archivo']) // Codifica el archivo en base64 si es necesario
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
