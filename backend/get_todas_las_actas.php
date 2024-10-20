<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia el puerto si es necesario
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php';  // Cambia la ruta si es necesario

header('Content-Type: application/json'); // Establece el tipo de contenido a JSON

try {
    // Verificar si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener el contenido JSON de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Validar que el grupo_materia esté presente
        if (!isset($data->grupo_materia)) {
            throw new Exception('No se ha proporcionado el grupo_materia.');
        }

        $grupo_materia = $data->grupo_materia;

        // Ejecutar la función en PostgreSQL
        $query = "SELECT * FROM obtener_estado_evaluacion_grupo(:grupo_materia)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([':grupo_materia' => $grupo_materia]);

        // Obtener los resultados
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Devolver los resultados en formato JSON
        echo json_encode($result);

    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error en formato JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
