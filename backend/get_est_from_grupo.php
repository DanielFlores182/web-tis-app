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
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener el nombre del grupo desde el cuerpo de la solicitud
        $input = json_decode(file_get_contents('php://input'), true);
        $grupo_nombre = $input['grupo_nombre'] ?? null;

        if (!$grupo_nombre) {
            throw new Exception('El nombre del grupo no ha sido proporcionado.');
        }

        // Llamar a la función almacenada para obtener los estudiantes del grupo
        $query = "SELECT * FROM get_estudiantes_by_grupo(:grupo_nombre)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':grupo_nombre', $grupo_nombre, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener los resultados
        $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si hay resultados
        if (count($estudiantes) === 0) {
            throw new Exception('No se encontraron estudiantes para el grupo proporcionado.');
        }

        // Enumerar los resultados y agregar un id, además de formatear los nombres
        $estudiantesConId = array_map(function($estudiante, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'nombres_e' => $estudiante['nombres'],
                'apellidos_e' => $estudiante['apellidos']
            ];
        }, $estudiantes, array_keys($estudiantes));

        // Retornar los resultados en formato JSON
        echo json_encode($estudiantesConId);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
