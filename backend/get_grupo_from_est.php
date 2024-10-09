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
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener el username desde la solicitud POST
        $data = json_decode(file_get_contents('php://input'), true);
        $username = $data['username'] ?? null;

        if (!$username) {
            throw new Exception('El campo "username" es obligatorio.');
        }

        // Llamar al stored procedure para obtener el grupo del estudiante
        $query = "SELECT public.get_grupo_by_username(:username)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener el resultado
        $grupo = $stmt->fetchColumn();

        if ($grupo === false) {
            throw new Exception('No se pudo obtener el grupo.');
        }

        // Verificar si el resultado es un mensaje de error o un grupo válido
        if ($grupo == 'No se encontró un estudiante con ese username.' || $grupo == 'El estudiante no está registrado en ningún grupo.') {
            echo json_encode(['error' => $grupo]);
        } else {
            echo json_encode(['grupo' => $grupo]);
        }
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
