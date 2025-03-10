-----------------------------------------------------------------------
--Stored Procedures & funcions del esquema
-----------------------------------------------------------------------

\c mi_base_datos;  -- Conectar a la base de datos recién c  reada
----------------------------------------------------------------------------

-----------------------------------------------------------------------
-- FUNCION login_check
--
--Function  para obtener validacion del usuario ingresado, si es docente 
--devuelve 1 si es estudiante devuelve 2 y si no existe el usuario 
--devuelve 0
-----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.login_check(
	u_username character varying,
	u_password character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    user_role INTEGER;
BEGIN
    -- Buscar el rol del usuario con el nombre y clave proporcionados
    SELECT CASE
        WHEN tipo = '1' THEN 1
        WHEN tipo = '2' THEN 2
        WHEN tipo = '3' THEN 3
        ELSE 0
    END INTO user_role
    FROM user_n
    WHERE username = u_username
    AND clave = u_password;

    -- Si no se encontró ningún usuario, devolvemos 0
    IF user_role IS NULL THEN
        RETURN 0;
    END IF;

    RETURN user_role;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.add_plan(text, integer, integer, text, date, date)

-- DROP FUNCTION IF EXISTS public.add_plan(text, integer, integer, text, date, date);

CREATE OR REPLACE FUNCTION public.add_plan(
	p_grupo_nombre text,
	p_grupo_id_docente integer,
	p_tipo_plan integer,
	p_descripcion text,
	p_fecha_ini date,
	p_fecha_fin date)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO plan (grupo_nombre, grupo_id_docente, tipo_plan, descripcion, fecha_ini, fecha_fin)
    VALUES (p_grupo_nombre, p_grupo_id_docente, p_tipo_plan, p_descripcion, p_fecha_ini, p_fecha_fin);
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.add_sprint(text, integer, text, date, date)

-- DROP FUNCTION IF EXISTS public.add_sprint(text, integer, text, date, date);

CREATE OR REPLACE FUNCTION public.add_sprint(
	p_grupo_nombre text,
	p_grupo_id_docente integer,
	p_nombre text,
	p_fecha_ini date,
	p_fecha_fin date)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO sprint (grupo_nombre, grupo_id_docente, nombre, fecha_ini, fecha_fin)
    VALUES (p_grupo_nombre, p_grupo_id_docente, p_nombre, p_fecha_ini, p_fecha_fin);
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.get_all_docentes()

-- DROP FUNCTION IF EXISTS public.get_all_docentes();

CREATE OR REPLACE FUNCTION public.get_all_docentes(
	)
    RETURNS TABLE(nombres_d character varying, apellidos_d character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT nombres, apellidos
    FROM user_n
    WHERE tipo = 1;  -- 'tipo = 1' indica que es un docente
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.get_all_estudiantes()

-- DROP FUNCTION IF EXISTS public.get_all_estudiantes();

CREATE OR REPLACE FUNCTION public.get_all_estudiantes(
	)
    RETURNS TABLE(nombres_e character varying, apellidos_e character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT nombres, apellidos
    FROM user_n
    WHERE tipo = 2;  --'tipo = 2' indica que es un estudiante
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.get_estudiantes_by_grupo(character varying)

-- DROP FUNCTION IF EXISTS public.get_estudiantes_by_grupo(character varying);

CREATE OR REPLACE FUNCTION public.get_estudiantes_by_grupo(
	p_grupo_nombre character varying)
    RETURNS TABLE(nombres character varying, apellidos character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT u.nombres, u.apellidos
    FROM grupo AS ga
    JOIN grupo_estudiante AS ge ON ga.nombre = ge.grupo_nombre
    JOIN user_n AS u ON ge.id_estudiante = u.id_usuario
    WHERE ga.nombre = p_grupo_nombre
    AND u.tipo = 2;  -- Aseguramos que solo obtengamos estudiantes (tipo = 2)
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.get_grupo_by_username(character varying)

-- DROP FUNCTION IF EXISTS public.get_grupo_by_username(character varying);

CREATE OR REPLACE FUNCTION public.get_grupo_by_username(
	p_username character varying)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    estudiante_id INTEGER;
    grupo_nombre VARCHAR;
BEGIN
    -- Buscar el id_usuario del estudiante en la tabla user_n
    SELECT id_usuario INTO estudiante_id
    FROM user_n
    WHERE username = p_username
    AND tipo = 2; -- Aseguramos que sea un estudiante (tipo = 2)
    
    -- Verificamos si se encontró el estudiante
    IF NOT FOUND THEN
        RETURN 'No se encontró un estudiante con ese username.';
    END IF;
    
    -- Buscar el grupo al que está registrado en la tabla grupo_estudiante
    SELECT ga.nombre INTO grupo_nombre
    FROM grupo_estudiante AS ge
    JOIN grupo AS ga ON ga.nombre = ge.grupo_nombre
    WHERE ge.id_estudiante = estudiante_id;
    
    -- Verificamos si está registrado en algún grupo
    IF NOT FOUND THEN
        RETURN 'El estudiante no está registrado en ningún grupo.';
    ELSE
        RETURN  grupo_nombre;
    END IF;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.obtener_estado_evaluacion_grupo(
	p_grupo_materia integer)
    RETURNS TABLE(grupo_nombre character varying, estado_evaluacion character varying, fecha_acta_actual date) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        g.nombre AS grupo_nombre,
        
        -- Estado de la evaluación
        CAST(
            CASE
                WHEN COUNT(t.id_tarea) FILTER (WHERE t.entregado = TRUE) = COUNT(t.id_tarea) THEN 'completado'
                WHEN COUNT(t.id_tarea) FILTER (WHERE t.entregado = TRUE) > 0 THEN 'pendiente'
                ELSE 'atrasado'
            END
        AS VARCHAR) AS estado_evaluacion,
        
        -- Fecha del acta más reciente
        (SELECT MAX(a.fecha)
         FROM acta a
         WHERE a.plan_grupo_nombre = g.nombre
         AND a.plan_grupo_id_docente = g.id_docente) AS fecha_acta_actual

    FROM grupo g
    INNER JOIN docente d ON g.id_docente = d.id_usuario
    LEFT JOIN tarea t ON g.nombre = t.plan_grupo_nombre AND g.id_docente = t.plan_grupo_id_docente
    WHERE d.grupo_materia = p_grupo_materia
    GROUP BY g.nombre, g.id_docente;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.obtener_grupos_materia()

-- DROP FUNCTION IF EXISTS public.obtener_grupos_materia();

CREATE OR REPLACE FUNCTION public.obtener_grupos_materia(
	)
    RETURNS TABLE(grupos integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    -- Retornamos los valores únicos de grupo_materia
    RETURN QUERY
    SELECT DISTINCT grupo_materia
    FROM docente
    WHERE grupo_materia IS NOT NULL;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- FUNCTION: public.obtener_tareas_estudiante(integer)

-- DROP FUNCTION IF EXISTS public.obtener_tareas_estudiante(integer);

CREATE OR REPLACE FUNCTION public.obtener_tareas_estudiante(
	p_id_estudiante integer)
    RETURNS TABLE(estudiante_nombre character varying, tarea_id bigint, tarea_detalle character varying, entregado boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    -- Retornamos los datos solicitados
    RETURN QUERY
    SELECT
        CAST(u.nombres || ' ' || u.apellidos AS VARCHAR) AS estudiante_nombre,  -- Nombre completo del estudiante
        t.id_tarea,        -- ID de la tarea
        t.detalle,         -- Nombre/detalle de la tarea
        t.entregado        -- Estado de entrega
    FROM
        tarea t
    INNER JOIN
        estudiante e ON t.id_estudiante = e.id_usuario
    INNER JOIN
        user_n u ON e.id_usuario = u.id_usuario
    WHERE
        t.id_estudiante = p_id_estudiante;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.add_docente(character varying, character varying, character varying, character varying, integer, character varying)

-- DROP PROCEDURE IF EXISTS public.add_docente(character varying, character varying, character varying, character varying, integer, character varying);

CREATE OR REPLACE PROCEDURE public.add_docente(
	IN p_nombres character varying,
	IN p_apellidos character varying,
	IN p_username character varying,
	IN p_correo character varying,
	IN p_grupo_materia integer,
	IN p_clave character varying DEFAULT NULL::character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Si la clave es NULL o está vacía, asignamos un valor por defecto
    IF p_clave IS NULL OR p_clave = '' THEN
        p_clave := 'publica'; -- Valor por defecto
    END IF;
    IF p_username IS NULL OR p_username = '' THEN
        p_username := p_nombres ; -- Valor por defecto
    END IF;

    -- Insertamos el nuevo docente en la tabla user_n con el tipo = 1 (docente)
    INSERT INTO user_n (username, nombres, apellidos, clave, tipo, correo)
    VALUES (p_username, p_nombres, p_apellidos, p_clave, 1, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado
    
	INSERT INTO docente (id_usuario, grupo_materia)
        VALUES (new_id_usuario, p_grupo_materia);
       
    -- Mensaje de confirmación
    RAISE NOTICE 'docente %  ha sido insertado con éxito', p_nombres;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.add_grupo(character varying, character varying, character varying, character varying)

-- DROP PROCEDURE IF EXISTS public.add_grupo(character varying, character varying, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.add_grupo(
	IN g_nombres character varying,
	IN g_apellidos character varying,
	IN g_grupo character varying,
	IN g_descripcion character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto del docente del grupo
    selec_id_usuario INTEGER;
BEGIN
    -- Verificamos si el g_docente existe en la tabla user_n y si es un docente (tipo = 1)
    SELECT id_usuario INTO selec_id_usuario
    FROM user_n
    WHERE nombres = g_nombres AND apellidos= g_apellidos
    AND tipo = 1;

    -- Si no se encuentra ningún registro, lanzamos un error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El docente con id % no existe o no es un docente', g_nombres;
    END IF;

    -- Si el docente existe, procedemos con el INSERT en la tabla grupo
    INSERT INTO grupo (nombre, id_docente, descripcion)
    VALUES (g_grupo, selec_id_usuario, g_descripcion);

    RAISE NOTICE 'Grupo insertado con éxito con el docente %', selec_id_usuario;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.add_student(character varying, character varying, character varying, integer, character varying, integer, character varying)

-- DROP PROCEDURE IF EXISTS public.add_student(character varying, character varying, character varying, integer, character varying, integer, character varying);

CREATE OR REPLACE PROCEDURE public.add_student(
	IN p_nombres character varying,
	IN p_apellidos character varying,
	IN p_username character varying,
	IN p_codsis integer,
	IN p_correo character varying,
	IN p_carrera integer,
	IN p_clave character varying DEFAULT NULL::character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Si la clave es NULL o está vacía, asignamos un valor por defecto
    IF p_clave IS NULL OR p_clave = '' THEN
        p_clave := 'publica'; -- Valor por defecto
    END IF;
    IF p_username IS NULL OR p_username = '' THEN
        p_username := p_codsis::VARCHAR; -- Convertimos p_codsis a cadena
    END IF;
    
    -- Si el correo es NULL o está vacío, lo generamos con el codsis
    IF p_correo IS NULL OR p_correo = '' THEN
        p_correo := p_codsis::VARCHAR || '@est.umss.edu'; -- Concatenamos p_codsis con el dominio
    END IF;
    -- Insertamos el nuevo estudiante en la tabla user_n con el tipo = 2 (estudiante)
    INSERT INTO user_n (username, nombres, apellidos , clave, tipo, correo)
    VALUES (p_username, p_nombres, p_apellidos, p_clave, 2, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado
    
	INSERT INTO estudiante (id_usuario, cod_sis, carrera)
        VALUES (new_id_usuario, p_codsis, p_carrera);
        RAISE NOTICE 'El usuario ha sido insertado como estudiante con id %', new_id_usuario;
    -- Mensaje de confirmación
    RAISE NOTICE 'Estudiante % con código % ha sido insertado con éxito', p_nombres, p_codsis;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.add_student_to_group(character varying, character varying, integer, character varying)

-- DROP PROCEDURE IF EXISTS public.add_student_to_group(character varying, character varying, integer, character varying);

CREATE OR REPLACE PROCEDURE public.add_student_to_group(
	IN nombres_e character varying,
	IN apelllidos_e character varying,
	IN u_rol integer,
	IN nombre_grupo character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    id_estudiante INTEGER;
    id_docente_g INTEGER;
BEGIN
    -- Verificamos si el estudiante existe en la tabla user_n y obtenemos su id_contacto
    SELECT id_usuario INTO id_estudiante
    FROM user_n
    WHERE nombres = nombres_e AND apellidos = apelllidos_e
    AND tipo = 2;  -- tipo 2 para estudiante

    -- Si no se encuentra al estudiante, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El estudiante % no existe', nombres_e;
    END IF;

    -- Verificamos si el grupo existe y obtenemos el id del docente asociado al grupo
    SELECT id_docente INTO id_docente_g
    FROM grupo
    WHERE nombre = nombre_grupo;

    -- Si no se encuentra el grupo, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El grupo % no existe', nombre_grupo;
    END IF;

    -- Insertamos en la tabla grupo_estudiante los datos requeridos
    INSERT INTO grupo_estudiante (id_estudiante, grupo_nombre, grupo_id_docente, rol)
    VALUES (id_estudiante, nombre_grupo, id_docente_g, u_rol);

    -- Confirmación de éxito
    RAISE NOTICE 'Estudiante % ha sido agregado al grupo % con éxito', nombres_e, nombre_grupo;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.add_user_n(character varying, character varying, character varying, integer, character varying, integer)

-- DROP PROCEDURE IF EXISTS public.add_user_n(character varying, character varying, character varying, integer, character varying, integer);

CREATE OR REPLACE PROCEDURE public.add_user_n(
	IN p_nombre character varying,
	IN p_apellido character varying,
	IN p_clave character varying,
	IN p_tipo integer,
	IN p_correo character varying,
	IN p_detalle integer)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Insertamos el nuevo registro en la tabla user_n
    INSERT INTO user_n (nombres, apellidos, clave, tipo, correo)
    VALUES (p_nombre, p_clave, p_tipo, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado

    -- Dependiendo del valor de p_tipo, hacemos el insert en la tabla correspondiente
    IF p_tipo = 1 THEN
        -- Insertamos el id_contacto en la tabla docente
        INSERT INTO docente (id_usuario, grupo_materia)
        VALUES (new_id_usuario, p_detalle);
        RAISE NOTICE 'El usuario ha sido insertado como docente con id %', new_id_usuario;
    ELSIF p_tipo = 2 THEN
        -- Insertamos el id_contacto en la tabla estudiante
        INSERT INTO estudiante (id_usuario, cod_sis)
        VALUES (new_id_usuario, p_detalle);
        RAISE NOTICE 'El usuario ha sido insertado como estudiante con id %', new_id_usuario;
    ELSE
        -- Si el tipo no es 1 ni 2, emitimos una advertencia
        RAISE NOTICE 'El tipo de usuario no es válido. Solo 1 (docente) o 2 (estudiante)';
    END IF;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.asignar_tarea(integer, character varying, character varying, date, text)

-- DROP PROCEDURE IF EXISTS public.asignar_tarea(integer, character varying, character varying, date, text);

CREATE OR REPLACE PROCEDURE public.asignar_tarea(
	IN p_sprint_id integer,
	IN p_nombre_tarea character varying,
	IN p_responsable character varying,
	IN p_fecha_entrega date,
	IN p_entregable text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Insertar los datos en la tabla asignar_tareas
    INSERT INTO asignar_tareas (
        sprint_id,
        nombre_tarea,
        responsable,
        fecha_entrega,
        entregable
    ) VALUES (
        p_sprint_id,
        p_nombre_tarea,
        p_responsable,
        p_fecha_entrega,
        p_entregable
    );

    -- Confirmar el éxito de la operación
    RAISE NOTICE 'Tarea asignada correctamente al sprint %', p_sprint_id;

END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.change_doc_mat_group(character varying, character varying, integer)

-- DROP PROCEDURE IF EXISTS public.change_doc_mat_group(character varying, character varying, integer);

CREATE OR REPLACE PROCEDURE public.change_doc_mat_group(
	IN user_docente character varying,
	IN clave_d character varying,
	IN new_grupo_materia integer)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
	stored_password VARCHAR;
	id_docente_g INTEGER;
BEGIN
    -- Verificamos si el usuario existe en la tabla user_n y obtenemos su id
    SELECT clave INTO stored_password
    FROM user_n
    WHERE username = nombre_docente
    AND tipo = 1;  -- tipo 1 para docente

    -- Si no se encuentra al docente, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El docente % no existe', nombre_docente;
    END IF;
    
	SELECT id_usuario INTO id_docente_g
    FROM user_n
    WHERE username = nombre_docente;
	
    -- Verificamos si la contraseña antigua proporcionada coincide con la almacenada
    IF stored_password != clave_d THEN
        RAISE EXCEPTION 'La contraseña es incorrecta para el usuario %', u_username;
    END IF;

    UPDATE docente
    SET grupo_materia = new_grupo_materia
    WHERE id_usuario = id_docente_g;

    -- Confirmación de éxito
    RAISE NOTICE 'docente % ha sido modificado del grupo % con éxito', nombre_docente, new_grupo_materia;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.change_e_mail(character varying, character varying, character varying)

-- DROP PROCEDURE IF EXISTS public.change_e_mail(character varying, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.change_e_mail(
	IN u_username character varying,
	IN u_password character varying,
	IN new_e_mail character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    stored_password VARCHAR;
BEGIN
    -- Verificamos si el usuario existe y recuperamos su contraseña actual
    SELECT clave INTO stored_password
    FROM user_n
    WHERE username = u_username;

    -- Si no encontramos el usuario, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario % no existe', u_username;
    END IF;

    -- Verificamos si la contraseña antigua proporcionada coincide con la almacenada
    IF stored_password != u_password THEN
        RAISE EXCEPTION 'La contraseña antigua es incorrecta para el usuario %', u_username;
    END IF;

    -- Si todas las validaciones son correctas, actualizamos la contraseña
    UPDATE user_n
    SET correo = new_e_mail
    WHERE username = u_username;

    -- Confirmación de éxito
    RAISE NOTICE 'Contraseña actualizada con éxito para el usuario %', u_username;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.change_password(character varying, character varying, character varying, character varying)

-- DROP PROCEDURE IF EXISTS public.change_password(character varying, character varying, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.change_password(
	IN u_username character varying,
	IN u_old_password character varying,
	IN u_new_password character varying,
	IN u_confirm_password character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    stored_password VARCHAR;
BEGIN
    -- Verificamos si el usuario existe y recuperamos su contraseña actual
    SELECT clave INTO stored_password
    FROM user_n
    WHERE username = p_username;

    -- Si no encontramos el usuario, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario % no existe', u_username;
    END IF;

    -- Verificamos si la contraseña antigua proporcionada coincide con la almacenada
    IF stored_password != p_old_password THEN
        RAISE EXCEPTION 'La contraseña antigua es incorrecta para el usuario %', u_username;
    END IF;

    -- Verificamos que la nueva contraseña y la confirmación coincidan
    IF u_new_password != u_confirm_password THEN
        RAISE EXCEPTION 'La nueva contraseña y la confirmación no coinciden';
    END IF;

    -- Si todas las validaciones son correctas, actualizamos la contraseña
    UPDATE user_n
    SET clave = u_new_password
    WHERE username = u_username;

    -- Confirmación de éxito
    RAISE NOTICE 'Contraseña actualizada con éxito para el usuario %', u_username;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.crear_plan(character varying, integer, character varying, date, date)

-- DROP PROCEDURE IF EXISTS public.crear_plan(character varying, integer, character varying, date, date);

CREATE OR REPLACE PROCEDURE public.crear_plan(
	IN p_grupo_nombre character varying,
	IN p_grupo_id_docente integer,
	IN p_objetivo character varying,
	IN p_fecha_ini date,
	IN p_fecha_fin date)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Comprobamos si el grupo existe antes de insertar el plan
    IF EXISTS (SELECT 1 FROM grupo WHERE nombre = p_grupo_nombre AND id_docente = p_grupo_id_docente) THEN
        -- Insertamos el nuevo plan en la tabla "plan"
        INSERT INTO plan (grupo_nombre, grupo_id_docente, objetivo, fecha_ini, fecha_fin)
        VALUES (p_grupo_nombre, p_grupo_id_docente, p_objetivo, p_fecha_ini, p_fecha_fin);
        
        RAISE NOTICE 'Plan creado exitosamente para el grupo % y docente %', p_grupo_nombre, p_grupo_id_docente;
    ELSE
        -- Si el grupo no existe, mostramos un mensaje de error
        RAISE EXCEPTION 'El grupo con nombre % y docente % no existe', p_grupo_nombre, p_grupo_id_docente;
    END IF;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.crear_tarea(character varying, integer, character varying, bytea, character varying)

-- DROP PROCEDURE IF EXISTS public.crear_tarea(character varying, integer, character varying, bytea, character varying);

CREATE OR REPLACE PROCEDURE public.crear_tarea(
	IN p_plan_grupo_nombre character varying,
	IN p_id_estudiante integer,
	IN p_detalle character varying,
	IN p_archivo bytea DEFAULT NULL::bytea,
	IN p_path character varying DEFAULT NULL::character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    v_id_docente INTEGER;  -- Variable para almacenar el ID del docente
BEGIN
    -- Buscar el id_docente asociado al nombre del grupo
    SELECT g.id_docente
    INTO v_id_docente
    FROM grupo g
    WHERE g.nombre = p_plan_grupo_nombre;

    -- Si no se encuentra un docente para el grupo, arrojar un error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró un docente para el grupo %', p_plan_grupo_nombre;
    END IF;

    -- Realizamos la inserción dependiendo de si los valores de archivo y path son nulos o no
    IF p_archivo IS NULL AND p_path IS NULL THEN
        INSERT INTO tarea (plan_grupo_nombre, plan_grupo_id_docente, id_estudiante, detalle)
        VALUES (p_plan_grupo_nombre, v_id_docente, p_id_estudiante, p_detalle);
    
    ELSIF p_archivo IS NULL THEN
        INSERT INTO tarea (plan_grupo_nombre, plan_grupo_id_docente, id_estudiante, detalle, path)
        VALUES (p_plan_grupo_nombre, v_id_docente, p_id_estudiante, p_detalle, p_path);
    
    ELSIF p_path IS NULL THEN
        INSERT INTO tarea (plan_grupo_nombre, plan_grupo_id_docente, id_estudiante, detalle, archivo)
        VALUES (p_plan_grupo_nombre, v_id_docente, p_id_estudiante, p_detalle, p_archivo);
    
    ELSE
        INSERT INTO tarea (plan_grupo_nombre, plan_grupo_id_docente, id_estudiante, detalle, archivo, path)
        VALUES (p_plan_grupo_nombre, v_id_docente, p_id_estudiante, p_detalle, p_archivo, p_path);
    END IF;
    
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.drop_student_of_group(character varying, character varying, character varying)

-- DROP PROCEDURE IF EXISTS public.drop_student_of_group(character varying, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.drop_student_of_group(
	IN nombres_e character varying,
	IN apellidos_e character varying,
	IN nombre_grupo character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    id_estudiante_g INTEGER;
	id_docente_g INTEGER;
BEGIN
    -- Verificamos si el estudiante existe en la tabla user_n y obtenemos su id_contacto
    SELECT id_usuario INTO id_estudiante_g
    FROM user_n
    WHERE nombres = nombres_e AND apellidos = apellidos_e
    AND tipo = 2;  -- tipo 2 para estudiante

    -- Si no se encuentra al estudiante, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El estudiante % no existe', nombres_e;
    END IF;

    -- Verificamos si el grupo existe y obtenemos el id del docente asociado al grupo
    SELECT id_docente INTO id_docente_g
    FROM grupo
    WHERE nombre = nombre_grupo;

    -- Si no se encuentra el grupo, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El grupo % no existe', nombre_grupo;
    END IF;

    -- Eliminamos de la tabla grupo_estudiante los datos requeridos
    DELETE FROM public.grupo_estudiante
	WHERE id_estudiante = id_estudiante_g;

    -- Confirmación de éxito
    RAISE NOTICE 'Estudiante % ha sido eliminado del grupo % con éxito', nombres_e, nombre_grupo;
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.insertar_sprint(character varying, integer, character varying, date, date)

-- DROP PROCEDURE IF EXISTS public.insertar_sprint(character varying, integer, character varying, date, date);

CREATE OR REPLACE PROCEDURE public.insertar_sprint(
	IN p_grupo_nombre character varying,
	IN p_grupo_id_docente integer,
	IN p_nombre character varying,
	IN p_fecha_ini date,
	IN p_fecha_fin date)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Insertar los datos en la tabla sprint
    INSERT INTO sprint (
        grupo_nombre,
        grupo_id_docente,
        nombre,
        fecha_ini,
        fecha_fin
    ) VALUES (
        p_grupo_nombre,
        p_grupo_id_docente,
        p_nombre,
        p_fecha_ini,
        p_fecha_fin
    );

    -- No se necesita devolver nada, ya que es un procedimiento.
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
-- PROCEDURE: public.insertar_tarea(integer, character varying, character varying, date, text)

-- DROP PROCEDURE IF EXISTS public.insertar_tarea(integer, character varying, character varying, date, text);

CREATE OR REPLACE PROCEDURE public.insertar_tarea(
	IN p_sprintid integer,
	IN p_nombre_tarea character varying,
	IN p_responsable character varying,
	IN p_fecha_entrega date,
	IN p_entregable text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    -- Insertar la tarea en la tabla
    INSERT INTO tareas (sprintId, nombre_tarea, responsable, fecha_entrega, entregable)
    VALUES (p_sprintId, p_nombre_tarea, p_responsable, p_fecha_entrega, p_entregable);
    
    -- Opcionalmente, puedes agregar validaciones adicionales aquí o triggers que verifiquen la integridad de los datos
END;
$BODY$;
----------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------
