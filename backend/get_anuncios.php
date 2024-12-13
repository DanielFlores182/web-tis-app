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
        // Llamar a la función obtener_anuncios()
        $query = "SELECT * FROM obtener_anuncios();"; // Llama a la función
        $stmt = $pdo->prepare($query);
        $stmt->execute();

        // Obtener los resultados
        $anuncios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Opcional: Enumerar los resultados
        $anunciosConId = array_map(function($anuncio, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'docente_nombre' => $anuncio['docente_nombre'],
                'texto' => $anuncio['texto'],
                'grupo' => $anuncio['grupo'],
                'fecha' => $anuncio['fecha']
            ];
        }, $anuncios, array_keys($anuncios));

        // Retornar los resultados en formato JSON
        echo json_encode($anunciosConId);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>

