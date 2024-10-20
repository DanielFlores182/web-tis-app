<?php
header("Access-Control-Allow-Origin: *"); // Permite todas las solicitudes de origen
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Permitir métodos
header("Access-Control-Allow-Headers: Content-Type"); // Permitir encabezados específicos

// Manejar la solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Configuración de la base de datos PostgreSQL
$host = 'isabelle.db.elephantsql.com';
$port = '5432';
$dbname = 'bymbbrry';
$user = 'bymbbrry';
$password = 'vwqXSm7GuRBcQLjfNubKMWNer-Jek6PG';

// Conectar a la base de datos PostgreSQL
$connectionString = "host=$host port=$port dbname=$dbname user=$user password=$password";
$conn = pg_connect($connectionString);

if (!$conn) {
    echo json_encode(['message' => 'Error al conectar a la base de datos']);
    exit;
}

// Obtener el cuerpo de la solicitud
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Verificar que los datos existan
if (!$data) {
    echo json_encode(['message' => 'No se enviaron datos válidos.']);
    exit;
}

// Extraer los datos del JSON
$meetingNumber = $data['meetingNumber'];
$meetingDate = $data['meetingDate'];
$startTime = $data['startTime'];
$comments = $data['comments'];

// Preparar y ejecutar la llamada al Stored Procedure
$query = "CALL guardar_acta($1, $2, $3, $4, $5)";
$result = pg_query_params($conn, $query, [$meetingNumber, $meetingDate, $startTime, $comments]);

if ($result) {
    echo json_encode(['message' => 'Acta guardada correctamente']);
} else {
    echo json_encode(['message' => 'Error al ejecutar el Stored Procedure']);
}

// Cerrar la conexión
pg_close($conn);
?>
