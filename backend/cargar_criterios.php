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

try {
    // Recupera los criterios de la base de datos
    $stmt = $conn->query("SELECT nombre, descripcion, porcentaje FROM criterios");
    $criterios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Define los valores predeterminados para tareas, sprints y faltas
    $tareas = 5;
    $sprints = 5;
    $faltas = 0;

    echo json_encode([
        'criterios' => $criterios,
        'tareas' => $tareas,
        'sprints' => $sprints,
        'faltas' => $faltas
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al cargar criterios', 'message' => $e->getMessage()]);
}
?>
