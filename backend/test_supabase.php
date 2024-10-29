<?php
$host = 'aws-0-sa-east-1.pooler.supabase.com'; // Reemplaza con el hostname que te proporciona ElephantSQL
$port = '6543';          // Puerto estándar de PostgreSQL
$dbname = 'postgres'; // Reemplaza con el nombre de tu base de datos
$user = 'postgres.yofxxjpkfxwicvnonvna';    // Reemplaza con tu usuario
$password = 'SodacorpDBpassword'; // Reemplaza con tu contraseña

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

try {
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa a PostgreSQL en ElephantSQL";
} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}
?>