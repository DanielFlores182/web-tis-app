<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php'; // Verifica que la ruta es correcta

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            throw new Exception('No se recibieron datos en la solicitud.');
        }

        // Verificar si los campos requeridos están presentes
        if (!isset($data['tipo_eva']) || !isset($data['descripcion_eva']) || !isset($data['fecha_ini']) || !isset($data['fecha_fin'])) {
            throw new Exception('Faltan campos obligatorios.');
        }

        // Asignar variables
        $tipo_eva = $data['tipo_eva'];
        $descripcion_eva = $data['descripcion_eva'];
        $fecha_ini = $data['fecha_ini'];
        $fecha_fin = $data['fecha_fin'];

        // Consulta SQL para insertar los datos
        $query = "INSERT INTO evaluacion_pro (tipo_eva, descripcion_eva, fecha_ini, fecha_fin) 
                  VALUES (:tipo_eva, :descripcion_eva, :fecha_ini, :fecha_fin)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':tipo_eva', $tipo_eva);
        $stmt->bindParam(':descripcion_eva', $descripcion_eva);
        $stmt->bindParam(':fecha_ini', $fecha_ini);
        $stmt->bindParam(':fecha_fin', $fecha_fin);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Evaluación registrada con éxito.']);
        } else {
            throw new Exception('Error al ejecutar la consulta SQL.');
        }
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Registrar el error y devolverlo como respuesta JSON
    error_log($e->getMessage()); // Esto escribirá el error en el log de PHP
    echo json_encode(['success' => false, 'message' => $e->getMessage()]); // Cambiar 'error' a 'message'
}
?>