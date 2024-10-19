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
        // Obtener el contenido JSON de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Validar que se reciban todos los datos necesarios
        if (!isset($data->groupName) || !isset($data->groupLeader) || !isset($data->groupDescription)) {
            throw new Exception('Datos incompletos.');
        }

        // Extraer datos
        $groupName = $data->groupName;
        $groupLeaderNames = $data->groupLeader->nombres; // Nombre del docente
        $groupLeaderApellidos = $data->groupLeader->apellidos; // Apellido del docente
        $groupDescription = $data->groupDescription;

        // Llamar al procedimiento almacenado para agregar el grupo
        $query = "CALL add_grupo(:nombres, :apellidos, :grupo, :descripcion)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':nombres' => $groupLeaderNames,
            ':apellidos' => $groupLeaderApellidos,
            ':grupo' => $groupName,
            ':descripcion' => $groupDescription
        ]);

        // Retornar una respuesta exitosa
        echo json_encode(['success' => true, 'message' => 'Grupo agregado exitosamente.']);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
