<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde tu frontend
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");   // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Continúa con la lógica de registro
require 'db_conection.php';

header('Content-Type: application/json');

try {
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->nombres) || !isset($data->apellidos) || !isset($data->codsis) || !isset($data->carrera)) {
            throw new Exception('Faltan campos obligatorios.');
        }

        $nombres = $data->nombres;
        $apellidos = $data->apellidos;
        $codsis = $data->codsis;
        $carrera = $data->carrera;
        
        // Valores predeterminados para correo, username y clave
        $username = ''; // Se establece como vacío
        $correo = '';   // Se establece como vacío
        $clave = '';    // Se establece como vacío (puedes cambiar esto si deseas otro valor)

        // Llamar al procedimiento add_student de PostgreSQL
        $query = "CALL add_student(:nombres, :apellidos, :username, :codsis, :correo, :carrera, :clave)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':nombres', $nombres);
        $stmt->bindParam(':apellidos', $apellidos);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':codsis', $codsis);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':carrera', $carrera);
        $stmt->bindParam(':clave', $clave); // También envías el valor vacío para la clave

        // Ejecutar la declaración
        if ($stmt->execute()) {
            echo json_encode(['message' => 'Estudiante registrado con éxito.']);

        } else {
            throw new Exception('Error al registrar estudiante.');
        }
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
