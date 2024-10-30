<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: https://webtismanager.netlify.app"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php'; // Asegúrate de que la ruta a tu archivo de conexión es correcta

header('Content-Type: application/json'); // Establece el tipo de contenido a JSON

try {
    // Consulta a la función almacenada
    $query = "SELECT * FROM obtener_grupos_materia()";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    // Obtener los resultados en formato de array asociativo
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Verificar si se obtuvieron resultados
    if ($result) {
        echo json_encode($result); // Retornar los resultados en formato JSON
    } else {
        echo json_encode(['message' => 'No se encontraron grupos.']);
    }
} catch (Exception $e) {
    // Retornar un error JSON en caso de excepción
    echo json_encode(['error' => $e->getMessage()]);
}
?>
