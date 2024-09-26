<?php
$host = 'localhost'; // Reemplaza con el hostname que te proporciona ElephantSQL
$port = '5432';          // Puerto estándar de PostgreSQL
$dbname = 'TIS'; // Reemplaza con el nombre de tu base de datos
$user = 'postgres';    // Reemplaza con tu usuario
$password = 'password'; // Reemplaza con tu contraseña

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname";

try {
    $conn = new PDO($dsn, $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa a PostgreSQL en ElephantSQL";
} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}
?>
