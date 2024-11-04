<?php
header('Content-Type: application/json');

try {
    // Conectar a la base de datos PostgreSQL
    $host = 'aws-0-sa-east-1.pooler.supabase.com';
    $port = '6543';
    $dbname = 'postgres';
    $user = 'postgres.yofxxjpkfxwicvnonvna';
    $password = 'SodacorpDBpassword';
    $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Llamar al procedimiento almacenado para cargar los datos
    $stmt = $conn->prepare("CALL cargar_criterios()");
    $stmt->execute();

    // Obtener los datos en formato JSON
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Enviar los datos al frontend
    echo json_encode($result['criterios_json']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar datos', 'error' => $e->getMessage()]);
}
?>
