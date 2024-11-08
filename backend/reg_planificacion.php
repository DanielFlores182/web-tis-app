<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS solo para localhost durante el desarrollo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php';

header('Content-Type: application/json');

try {
    // Verificar si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método HTTP no permitido.');
    }

    // Obtener los datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents("php://input"));

    // Validar los campos obligatorios
    if (!isset($data->grupo_nombre) || !isset($data->grupo_id_docente) || !isset($data->objetivo)) {
        throw new Exception('Faltan campos obligatorios.');
    }

    // Validar que el ID del docente sea un número entero
    if (!filter_var($data->grupo_id_docente, FILTER_VALIDATE_INT)) {
        throw new Exception('El ID del docente debe ser un número entero.');
    }

    // Extraer otros datos
    $nombre = $data->grupo_nombre;
    $id_docente = $data->grupo_id_docente;
    $objetivo = $data->objetivo;

    // Iniciar una transacción
    $pdo->beginTransaction();

    // Preparar y ejecutar la consulta para el plan
    $queryPlan = "CALL crear_plan(:grupo_nombre, :grupo_id_docente, :objetivo, :fecha_ini, :fecha_fin)";
    $stmtPlan = $pdo->prepare($queryPlan);
    $stmtPlan->bindParam(':grupo_nombre', $nombre);
    $stmtPlan->bindParam(':grupo_id_docente', $id_docente);
    $stmtPlan->bindParam(':objetivo', $objetivo);

    // Asignar fechas iniciales y finales del primer sprint (puedes ajustarlo si es necesario)
    $primerSprint = $data->sprints[0];
    $fecha_ini_plan = DateTime::createFromFormat('d-m-Y', $primerSprint->fecha_ini)->format('Y-m-d');
    $fecha_fin_plan = DateTime::createFromFormat('d-m-Y', $primerSprint->fecha_fin)->format('Y-m-d');
    $stmtPlan->bindParam(':fecha_ini', $fecha_ini_plan);
    $stmtPlan->bindParam(':fecha_fin', $fecha_fin_plan);

    if (!$stmtPlan->execute()) {
        throw new Exception('Error al crear el plan.');
    }

    // Preparar la consulta para insertar sprints
    $querySprint = "CALL insertar_sprint(:grupo_nombre, :grupo_id_docente, :nombre, :fecha_ini, :fecha_fin)";
    $stmtSprint = $pdo->prepare($querySprint);

    // Ejecutar el procedimiento para cada sprint
    foreach ($data->sprints as $sprint) {
        // Validar los campos de fechas para cada sprint
        if (!isset($sprint->fecha_ini) || !isset($sprint->fecha_fin)) {
            throw new Exception('Cada sprint debe tener fechas de inicio y fin.');
        }

        // Validar el formato de las fechas (dd-mm-yyyy)
        if (!preg_match("/^\d{2}-\d{2}-\d{4}$/", $sprint->fecha_ini) || !preg_match("/^\d{2}-\d{2}-\d{4}$/", $sprint->fecha_fin)) {
            throw new Exception('Las fechas deben estar en el formato dd-mm-yyyy.');
        }

        // Convertir las fechas al formato YYYY-MM-DD
        $fecha_ini = DateTime::createFromFormat('d-m-Y', $sprint->fecha_ini)->format('Y-m-d');
        $fecha_fin = DateTime::createFromFormat('d-m-Y', $sprint->fecha_fin)->format('Y-m-d');

        // Verificar que la conversión de fechas fue exitosa
        if (!$fecha_ini || !$fecha_fin) {
            throw new Exception('Error al convertir las fechas.');
        }

        // Ligar los parámetros para insertar el sprint
        $stmtSprint->bindParam(':grupo_nombre', $nombre);
        $stmtSprint->bindParam(':grupo_id_docente', $id_docente);
        $stmtSprint->bindParam(':nombre', $sprint->nombre); // nombre del sprint
        $stmtSprint->bindParam(':fecha_ini', $fecha_ini);
        $stmtSprint->bindParam(':fecha_fin', $fecha_fin);

        // Ejecutar el procedimiento para cada sprint
        if (!$stmtSprint->execute()) {
            throw new Exception('Error al insertar el sprint: ' . $sprint->nombre);
        }
    }

    // Confirmar la transacción
    $pdo->commit();

    // Respuesta de éxito
    echo json_encode([
        'success' => true,
        'status' => 201, // Created
        'message' => 'Planificación registrada con éxito.'
    ]);

} catch (Exception $e) {
    // Revertir la transacción en caso de error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // Registrar el error en un archivo de logs
    error_log($e->getMessage());

    // Enviar la respuesta con el código de error HTTP adecuado
    if ($e->getMessage() === 'Faltan campos obligatorios.') {
        http_response_code(400); // Bad request
    } else {
        http_response_code(500); // Internal server error
    }

    // Devolver un error en formato JSON
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
