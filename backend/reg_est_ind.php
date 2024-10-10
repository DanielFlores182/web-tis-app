<?php

try {
    // Crear una conexión a la base de datos PostgreSQL
    $conn = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si la solicitud es de tipo POST
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Obtener los datos enviados desde el frontend
        $data = json_decode(file_get_contents('php://input'), true);

        // Verificar que los campos requeridos no estén vacíos
        if (!empty($data['nombres']) && !empty($data['apellidos']) && !empty($data['codsis']) && !empty($data['carrera'])) {
            // Preparar la consulta SQL para insertar los datos
            $query = "INSERT INTO estudiantes (nombres, apellidos, codsis, carrera) 
                    VALUES (:nombres, :apellidos, :codsis, :carrera)";

            $stmt = $conn->prepare($query);

            // Asignar valores a los parámetros de la consulta
            $stmt->bindParam(':nombres', $data['nombres']);
            $stmt->bindParam(':apellidos', $data['apellidos']);
            $stmt->bindParam(':codsis', $data['codsis']);
            $stmt->bindParam(':carrera', $data['carrera']);

            // Ejecutar la consulta
            if ($stmt->execute()) {
                // Respuesta exitosa
                echo json_encode(['status' => 'success', 'message' => 'Estudiante registrado con éxito']);
            } else {
                // Respuesta de error
                echo json_encode(['status' => 'error', 'message' => 'Error al registrar estudiante']);
            }
        } else {
            // Respuesta de error si faltan campos requeridos
            echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
        }
    }
} catch (PDOException $e) {
    // Manejo de errores en la conexión
    echo json_encode(['status' => 'error', 'message' => 'Error en la conexión a la base de datos: ' . $e->getMessage()]);
}
?>
