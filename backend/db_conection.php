<?php
 $host = 'isabelle.db.elephantsql.com'; 
 $port = '5432'; // Puerto por defecto de PostgreSQL
 $dbname = 'bymbbrry';
 $user = 'bymbbrry';
 $password = 'vwqXSm7GuRBcQLjfNubKMWNer-Jek6PG';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password);
    // Configura el modo de error de PDO a excepción
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa a la base de datos.";
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>
