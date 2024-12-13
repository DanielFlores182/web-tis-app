<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde cualquier origen
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php';

header('Content-Type: application/json'); // Establece el tipo de contenido a JSON

try {
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener datos del cuerpo de la solicitud
        $input = json_decode(file_get_contents('php://input'), true);

        // Validar los parámetros requeridos
        if (!isset($input['texto']) || !isset($input['id_docente'])) {
            throw new Exception('Parámetros insuficientes. Se requiere "texto" e "id_docente".');
        }

        $texto = $input['texto'];
        $id_docente = $input['id_docente'];

        // Llamar al procedimiento almacenado
        $query = "CALL agregar_anuncio(:texto, :id_docente);";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':texto', $texto, PDO::PARAM_STR);
        $stmt->bindParam(':id_docente', $id_docente, PDO::PARAM_INT);

        // Ejecutar la consulta
        $stmt->execute();

        // Respuesta de éxito
        echo json_encode(['success' => true, 'message' => 'Anuncio agregado exitosamente.']);
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
