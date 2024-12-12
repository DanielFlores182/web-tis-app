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
        // Llamar al stored procedure para obtener todos los estudiantes
        $query = "SELECT * FROM obtener_estudiantes();"; // Llamada a la función
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Obtener los resultados
        $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Opcional: Enumerar los resultados
        $estudiantesConId = array_map(function($estudiante, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'nombres' => $estudiante['nombres'],
                'apellidos' => $estudiante['apellidos'],
                'correo' => $estudiante['correo'],
                'carrera' => $estudiante['carrera'],
                'cod_sis' => $estudiante['cod_sis'],
                'grupo_materia' => $estudiante['grupo_materia']
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
