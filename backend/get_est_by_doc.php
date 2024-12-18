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

require 'db_conection.php'; // Asegúrate de que la ruta a tu archivo de conexión es correcta

header('Content-Type: application/json'); // Establece el tipo de contenido a JSON

try {
    // Verifica si es una solicitud GET
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtener el parámetro 'username' de la URL
        if (!isset($_GET['username'])) {
            throw new Exception('El parámetro username es requerido.');
        }

        $username_docente = $_GET['username']; // Obtiene el nombre de usuario del docente

        // Preparar la llamada a la función almacenada
        $query = "SELECT * FROM obtener_estudiantes_por_grupo_docente(:username_docente);";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':username_docente', $username_docente, PDO::PARAM_STR);
        $stmt->execute();

        // Obtener los resultados
        $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se encontraron resultados
        if (!$estudiantes) {
            echo json_encode(['mensaje' => 'No se encontraron estudiantes para el docente especificado.']);
            exit();
        }

        // Enumerar los resultados
        $estudiantesConId = array_map(function($estudiante, $index) {
            return [
                'id' => $index + 1, // Enumeración comenzando desde 1
                'grupo_nombre' => $estudiante['grupo_nombre'],
                'id_docente' => $estudiante['id_docente'],
                'nombre_estudiante' => $estudiante['estudiante_nombre'],
                'apellido_estudiante' => $estudiante['estudiante_apellido'],
                'correo_estudiante' => $estudiante['estudiante_correo'],
                'cod_sis' => $estudiante['estudiante_cod_sis']
            ];
        }, $estudiantes, array_keys($estudiantes));

        // Retornar los resultados en formato JSON
        echo json_encode($estudiantesConId);
    } else {
        throw new Exception('Método HTTP no permitido.'); // Manejo de métodos no permitidos
    }
} catch (Exception $e) {
    // Devolver un error JSON
    echo json_encode(['error' => $e->getMessage()]);
}
?>
