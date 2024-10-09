<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permite solicitudes desde tu frontend
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
    // Verifica si es una solicitud GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Llamar al stored procedure para obtener todos los docentes
        $query = "SELECT * FROM get_all_docentes();";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Obtener los resultados
        $docentes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Enumerar los resultados y agregar un id
        $docentesConId = array_map(function($docente, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'nombres_d' => $docente['nombres_d'],
                'apellidos_d' => $docente['apellidos_d']
            ];
        }, $docentes, array_keys($docentes));

        // Retornar los resultados en formato JSON
        echo json_encode($docentesConId);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
