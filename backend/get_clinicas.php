<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde cualquier origen (ajusta según tu necesidad)
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar solicitudes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php'; // Asegúrate de que la ruta a tu archivo de conexión es correcta

try {
    // Verifica si es una solicitud GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Llamar a la función de Supabase para obtener todas las clínicas
        $query = "SELECT * FROM obtener_clinicas();";
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Obtener los resultados
        $clinicas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retornar los resultados en formato JSON
        echo json_encode($clinicas);
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>