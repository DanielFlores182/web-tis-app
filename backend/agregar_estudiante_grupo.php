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
        if (!isset($data->user_estudiante) || !isset($data->rol) || !isset($data->nombre_grupo)) {
            throw new Exception('Datos incompletos.');
        }

        // Extraer datos
        $user_estudiante = $data->user_estudiante; // Nombre de usuario del estudiante
        $rol = $data->rol; // Rol del estudiante
        $nombre_grupo = $data->nombre_grupo; // Nombre del grupo

        // Llamar al procedimiento almacenado para agregar el estudiante al grupo
        $query = "CALL public.add_student_to_group(:user_estudiante, :u_rol, :nombre_grupo)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_estudiante' => $user_estudiante,
            ':u_rol' => $rol,
            ':nombre_grupo' => $nombre_grupo
        ]);

        // Retornar una respuesta exitosa
        echo json_encode(['success' => true, 'message' => 'Estudiante agregado al grupo exitosamente.']);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
