<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: https://webtismanager.netlify.app"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header('Content-Type: application/json');

// Obtiene los datos enviados desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['criterios'])) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos de criterios']);
    exit();
}

// Ruta del archivo JSON
$file_path = 'criterios.json';

try {
    // Guardar los datos en el archivo JSON
    file_put_contents($file_path, json_encode($data['criterios'], JSON_PRETTY_PRINT));

    // Conectar a la base de datos PostgreSQL
    $host = 'aws-0-sa-east-1.pooler.supabase.com';
    $port = '6543';
    $dbname = 'postgres';
    $user = 'postgres.yofxxjpkfxwicvnonvna';
    $password = 'SodacorpDBpassword';
    $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Llamar al procedimiento almacenado para guardar los datos
    $stmt = $conn->prepare("CALL guardar_criterios(:criterios_json)");
    $stmt->bindValue(':criterios_json', json_encode($data['criterios'])); // Pasa el JSON al procedimiento
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Criterios guardados en JSON y base de datos exitosamente']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al guardar datos', 'error' => $e->getMessage()]);
}
?>
