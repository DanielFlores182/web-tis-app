<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight (solicitudes OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir la conexión a la base de datos
require 'db_conection.php'; // Asegúrate de que este archivo configure la conexión a Supabase

header('Content-Type: application/json');
function convertBooleansToStrings($data) {
    foreach ($data as $key => $value) {
        if (is_bool($value)) {
            $data->$key = $value ? 'true' : 'false'; // Convierte booleanos a cadenas
        } elseif (is_object($value) || is_array($value)) {
            $data->$key = convertBooleansToStrings($value); // Recursión para objetos o arrays anidados
        }
    }
    return $data;
}

try {
    // Verifica si es una solicitud POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"));

        // Verificar si se recibieron datos
        if (!$data) {
            throw new Exception('No se recibieron datos en el cuerpo de la solicitud.');
        }
        // Convertir booleanos a cadenas
        $data = convertBooleansToStrings($data);
        // Extraer los datos del JSON
        $clinica = $data->clinica ?? null;
        $odontologo = $data->odontologo ?? null;
        $direccion = $data->direccion ?? null;
        $telefono_dentista = $data->telefono_o ?? null;
        $descripcion = $data->descripcion ?? null;
        $paciente = $data->paciente ?? null;
        $colorimetro = $data->colorimetro ?? null;
        $fecha_inicio = $data->fechaRecibo ?? null;
        $fecha_entrega = $data->fechaEntrega ?? null;
        $edad = $data->edad ?? null;
        $genero = $data->sexo ?? null; // Ahora es texto
        $telefono_clinica = $data->telefono ?? null;
        $urgente = $data->urgente ?? null;
        $regular = $data->regular ?? null;
        $especial = $data->especial ?? null;
        $largoplazo = $data->largoplazo ?? null;
        $antagonista = $data->ingresa->antagonista ?? null;
        $articulador = $data->ingresa->articulador ?? null;
        $transfer = $data->implante->transfer ?? null;
        $analogo = $data->implante->analogo ?? null;
        $tornillo = $data->implante->tornillo ?? null;
        $uclas = $data->implante->uclas ?? null;
        $otros = $data->implante->otros ?? null;
        $cara_oclusal_si = $data->caraoclusal->si ?? null;
        $cara_oclusal_no = $data->caraoclusal->no ?? null;
        $zona_cervical_oscura = $data->zonacervical->oscura ?? null;
        $zona_cervical_normal = $data->zonacervical->normal ?? null;
        $incisal_translucida = $data->incisal->translucida ?? null;
        $incisal_normal = $data->incisal->tormal ?? null;
        $mamelones_si = $data->mamelones->si ?? null;
        $mamelones_no = $data->mamelones->no ?? null;

        // Llamar a la función insertar_orden_de_trabajo
        $query = "SELECT public.insertar_orden_de_trabajo(
            :clinica, :odontologo, :direccion, :telefono_dentista, :descripcion, :paciente, :colorimetro,
            :fecha_inicio, :fecha_entrega, :edad, :genero, :telefono_clinica, :urgente, :regular, :especial,
            :largoplazo, :antagonista, :articulador, :transfer, :analogo, :tornillo, :uclas, :otros,
            :cara_oclusal_si, :cara_oclusal_no, :zona_cervical_oscura, :zona_cervical_normal,
            :incisal_translucida, :incisal_normal, :mamelones_si, :mamelones_no
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
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_entrega', $fecha_entrega);
        $stmt->bindParam(':edad', $edad);
        $stmt->bindParam(':genero', $genero);
        $stmt->bindParam(':telefono_clinica', $telefono_clinica);
        $stmt->bindParam(':urgente', $urgente);
        $stmt->bindParam(':regular', $regular);
        $stmt->bindParam(':especial', $especial);
        $stmt->bindParam(':largoplazo', $largoplazo);
        $stmt->bindParam(':antagonista', $antagonista);
        $stmt->bindParam(':articulador', $articulador);
        $stmt->bindParam(':transfer', $transfer);
        $stmt->bindParam(':analogo', $analogo);
        $stmt->bindParam(':tornillo', $tornillo);
        $stmt->bindParam(':uclas', $uclas);
        $stmt->bindParam(':otros', $otros);
        $stmt->bindParam(':cara_oclusal_si', $cara_oclusal_si);
        $stmt->bindParam(':cara_oclusal_no', $cara_oclusal_no);
        $stmt->bindParam(':zona_cervical_oscura', $zona_cervical_oscura);
        $stmt->bindParam(':zona_cervical_normal', $zona_cervical_normal);
        $stmt->bindParam(':incisal_translucida', $incisal_translucida);
        $stmt->bindParam(':incisal_normal', $incisal_normal);
        $stmt->bindParam(':mamelones_si', $mamelones_si);
        $stmt->bindParam(':mamelones_no', $mamelones_no);

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
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}