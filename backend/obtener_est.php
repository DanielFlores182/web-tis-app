<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permitir solicitudes desde el frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Continúa con la lógica de obtención de datos del estudiante
require 'db_conection.php'; // Archivo de conexión a la base de datos

header('Content-Type: application/json');

try {
    // Verificar si es una solicitud GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtener el ID del estudiante desde la URL
        if (!isset($_GET['id'])) {
            throw new Exception('ID del estudiante no proporcionado.');
        }

        $idEstudiante = intval($_GET['id']);

        // Consulta para obtener el nombre del estudiante
        $query = "SELECT nombre FROM estudiantes WHERE id = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $idEstudiante);
        $stmt->execute();
        $nombre = $stmt->fetchColumn();

        if ($nombre === false) {
            throw new Exception('Estudiante no encontrado.');
        }

        // Consulta para obtener las tareas del estudiante
        $query = "SELECT id, nombre, estado FROM tareas WHERE id_estudiante = :id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $idEstudiante);
        $stmt->execute();
        $tareas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los datos en formato JSON
        echo json_encode([
            'nombre' => $nombre,
            'tareas' => $tareas
        ]);
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error en formato JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
