<?php
header('Content-Type: application/json');
require 'db_conection.php';

try {
    if (!isset($_GET['id'])) {
        throw new Exception('ID de tarea no proporcionado.');
    }

    $idTarea = $_GET['id'];

    // Obtener detalles de la tarea
    $query = "SELECT nombre, detalle FROM tareas WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $idTarea);
    $stmt->execute();
    $tarea = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tarea) {
        throw new Exception('Tarea no encontrada.');
    }

    // Obtener comentarios de la tarea
    $queryComentarios = "SELECT comentario FROM comentarios WHERE id_tarea = :id";
    $stmtComentarios = $pdo->prepare($queryComentarios);
    $stmtComentarios->bindParam(':id', $idTarea);
    $stmtComentarios->execute();
    $comentarios = $stmtComentarios->fetchAll(PDO::FETCH_COLUMN);

    // Devolver respuesta con tarea y comentarios
    echo json_encode([
        'nombre' => $tarea['nombre'],
        'descripcion' => $tarea['detalle'],
        'comentarios' => $comentarios
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
