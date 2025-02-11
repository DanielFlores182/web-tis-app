<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Habilitar CORS
header("Access-Control-Allow-Origin: https://dentallmanager.netlify.app"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Continúa con la lógica del login
require 'db_conection.php';

header('Content-Type: application/json');

try {
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->username) || !isset($data->clave)) {
            throw new Exception('Faltan campos obligatorios.');
        }

        $username = $data->username;
        $clave = $data->clave;

        // Llamar a la función login_check de PostgreSQL
        $query = "SELECT login_check(:username, :clave)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':clave', $clave);
        $stmt->execute();
        $result = $stmt->fetchColumn();

        if ($result === false) {
            throw new Exception('Error en la consulta.');
        }

        // Devolver la respuesta en formato JSON
        echo json_encode(['role' => (int)$result]);
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
