<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_conection.php'; // Asegúrate de que la ruta a tu archivo de conexión es correcta

header('Content-Type: application/json'); // Establece el tipo de contenido a JSON

try {
    // Verifica si es una solicitud GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Preparar la llamada a la función almacenada
        $query = "SELECT * FROM obtener_todas_las_evaluaciones();";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Obtener los resultados
        $evaluaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se encontraron resultados
        if (!$evaluaciones) {
            echo json_encode(['mensaje' => 'No se encontraron evaluaciones.']);
            exit();
        }

        // Enumerar los resultados
        $evaluacionesConId = array_map(function($evaluacion, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'id_eva' => $evaluacion['id_eva'],
                'tipo_eva' => $evaluacion['tipo_eva'],
                'descripcion_eva' => $evaluacion['descripcion_eva'],
                'fecha_ini' => $evaluacion['fecha_ini'],
                'fecha_fin' => $evaluacion['fecha_fin'],
                'contenido_eva' => $evaluacion['contenido_eva'],
                'nota_eva' => $evaluacion['nota_eva']
            ];
        }, $evaluaciones, array_keys($evaluaciones));

        // Retornar los resultados en formato JSON
        echo json_encode($evaluacionesConId);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
