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
        // Obtener la fecha de entrega desde los parámetros de la solicitud
        $fecha_entrega = $_GET['fecha_entrega'] ?? null;

        if (!$fecha_entrega) {
            throw new Exception('La fecha de entrega es requerida.');
        }

        // Llamar a la función de PostgreSQL para obtener las órdenes no entregadas
        $query = "SELECT * FROM public.obtener_ordenes_no_entregadas_por_fecha(:fecha_entrega);";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':fecha_entrega', $fecha_entrega);
        $stmt->execute();

        // Obtener los resultados
        $ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retornar los resultados en formato JSON
        echo json_encode($ordenes);
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>