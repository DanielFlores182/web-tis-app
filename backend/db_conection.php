<?php
 $host = 'aws-0-sa-east-1.pooler.supabase.com'; 
 $port = '6543'; // Puerto por defecto de PostgreSQL
 $dbname = 'postgres';
 $user = 'postgres.yofxxjpkfxwicvnonvna';
 $password = 'SodacorpDBpassword';

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password);
    // Configura el modo de error de PDO a excepción
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  //  echo "Conexión exitosa a la base de datos.";
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit();
}
?>
