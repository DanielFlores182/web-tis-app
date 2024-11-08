<?php
// Mostrar errores durante el desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db_conection.php'; // Asegúrate de tener la conexión a la base de datos configurada

header('Content-Type: application/json');

try {
    // Verificar si es una solicitud GET (para obtener sprints o miembros) o POST (para asignar tareas)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Verificar si se solicita obtener los sprints o los miembros
        if (isset($_GET['grupo_nombre'])) {
            // OBTENER SPRINTS ASOCIADOS AL GRUPO
            $grupoNombre = $_GET['grupo_nombre'];

            if (empty($grupoNombre)) {
                throw new Exception('El nombre del grupo es obligatorio.');
            }

            // Consulta para obtener los sprints
            $stmt = $pdo->prepare("SELECT id, nombre FROM sprint WHERE grupo_nombre = :grupo_nombre");
            $stmt->bindParam(':grupo_nombre', $grupoNombre, PDO::PARAM_STR);
            $stmt->execute();

            $sprints = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($sprints)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'No se encontraron sprints para este grupo.'
                ]);
            } else {
                // Retornar los sprints encontrados
                echo json_encode([
                    'success' => true,
                    'sprints' => $sprints
                ]);
            }
        } elseif (isset($_GET['grupo_estudiante'])) {
            // OBTENER ESTUDIANTES ASOCIADOS AL GRUPO
            $grupoNombreEstudiantes = $_GET['grupo_estudiante'];

            if (empty($grupoNombreEstudiantes)) {
                throw new Exception('El nombre del grupo es obligatorio.');
            }

            // Consulta para obtener los estudiantes asociados al grupo
            $stmt = $pdo->prepare("SELECT id_estudiante, grupo_nombre, rol FROM grupo_estudiante WHERE grupo_nombre = :grupo_nombre");
            $stmt->bindParam(':grupo_nombre', $grupoNombreEstudiantes, PDO::PARAM_STR);
            $stmt->execute();

            $miembros = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($miembros)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'No se encontraron miembros para este grupo.'
                ]);
            } else {
                // Retornar los miembros encontrados
                echo json_encode([
                    'success' => true,
                    'miembros' => $miembros
                ]);
            }
        } else {
            throw new Exception('Parámetro inválido para la solicitud GET.');
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // ASIGNAR TAREAS A UN SPRINT USANDO PROCEDIMIENTO ALMACENADO
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['sprintId']) || !isset($input['tareas']) || !is_array($input['tareas'])) {
            throw new Exception('Datos insuficientes para asignar tareas.');
        }

        $sprintId = $input['sprintId'];
        $tareas = $input['tareas'];

        // Preparar la llamada al procedimiento almacenado
        $query = "CALL asignar_tarea(:sprint_id, :nombre_tarea, :responsable, :fecha_entrega, :entregable)";
        $stmt = $pdo->prepare($query);

        // Llamar al procedimiento almacenado para cada tarea
        foreach ($tareas as $tarea) {
            $stmt->bindParam(':sprint_id', $sprintId, PDO::PARAM_INT);
            $stmt->bindParam(':nombre_tarea', $tarea['nombre'], PDO::PARAM_STR);
            $stmt->bindParam(':responsable', $tarea['responsable'], PDO::PARAM_STR);
            $stmt->bindParam(':fecha_entrega', $tarea['fechaEntrega'], PDO::PARAM_STR); // Asegúrate que el formato sea YYYY-MM-DD
            $stmt->bindParam(':entregable', $tarea['entregable'], PDO::PARAM_STR);

            if (!$stmt->execute()) {
                throw new Exception('Error al asignar la tarea: ' . $stmt->errorInfo()[2]);
            }
        }

        // Retornar respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => 'Tareas asignadas correctamente.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido.'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
