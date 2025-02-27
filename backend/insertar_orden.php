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

// Incluir la conexión a la base de datos
require 'db_conection.php'; // Asegúrate de que este archivo configure la conexión a PostgreSQL

header('Content-Type: application/json');

try {
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Verificar si se recibieron datos
        if (!$data) {
            throw new Exception('No se recibieron datos en el cuerpo de la solicitud.');
        }

        // Extraer los datos del JSON
        $clinica = $data->clinica ?? null;
        $odontologo = $data->odontologo ?? null;
        $direccion = $data->direccion ?? null;
        $telefono_dentista = $data->telefono_o ?? null; // Usamos telefono_o del frontend
        $descripcion = $data->descripcion ?? null;
        $paciente = $data->paciente ?? null;
        $colorimetro = $data->colorimetro ?? null;
        $tipo = $data->tipo ?? null; // Puedes definir cómo se calcula o envía este campo desde el frontend
        $fecha_inicio = $data->fechaRecibo ?? null; // Usamos fechaRecibo del frontend
        $fecha_entrega = $data->fechaEntrega ?? null;
        $edad = $data->edad ?? null;
        $genero = $data->sexo === 'Masculino' ? true : ($data->sexo === 'Femenino' ? false : null); // Convertir sexo a booleano
        $telefono_clinica = $data->telefono ?? null; // Usamos telefono del frontend

        // Llamar a la función insertar_orden_de_trabajo
        $query = "SELECT public.insertar_orden_de_trabajo(
            :clinica, 
            :odontologo, 
            :direccion, 
            :telefono_dentista, 
            :descripcion, 
            :paciente, 
            :colorimetro, 
            :tipo, 
            :fecha_inicio, 
            :fecha_entrega, 
            :edad, 
            :genero, 
            :telefono_clinica
        )";
        $stmt = $pdo->prepare($query);

        // Bind de los parámetros
        $stmt->bindParam(':clinica', $clinica);
        $stmt->bindParam(':odontologo', $odontologo);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':telefono_dentista', $telefono_dentista);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':paciente', $paciente);
        $stmt->bindParam(':colorimetro', $colorimetro);
        $stmt->bindParam(':tipo', $tipo);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_entrega', $fecha_entrega);
        $stmt->bindParam(':edad', $edad);
        $stmt->bindParam(':genero', $genero);
        $stmt->bindParam(':telefono_clinica', $telefono_clinica);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            // Obtener el ID de la nueva orden de trabajo
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $nueva_orden_id = $result['insertar_orden_de_trabajo'];

            echo json_encode(['success' => true, 'id' => $nueva_orden_id]);
        } else {
            throw new Exception('Error al ejecutar la consulta.');
        }
    } else {
        throw new Exception('Método HTTP no permitido.');
    }
} catch (Exception $e) {
    // Devolver un error JSON con success false
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}