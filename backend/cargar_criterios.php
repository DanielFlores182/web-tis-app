<?php
header('Content-Type: application/json');
include 'db_connection.php';

try {
    // Recupera los criterios de la base de datos
    $stmt = $conn->query("SELECT nombre, descripcion, porcentaje FROM criterios");
    $criterios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Define los valores predeterminados para tareas, sprints y faltas
    $tareas = 5;
    $sprints = 5;
    $faltas = 0;

    echo json_encode([
        'criterios' => $criterios,
        'tareas' => $tareas,
        'sprints' => $sprints,
        'faltas' => $faltas
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al cargar criterios', 'message' => $e->getMessage()]);
}
?>
