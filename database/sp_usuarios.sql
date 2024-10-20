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
CREATE OR REPLACE FUNCTION login_check(u_username TEXT, u_password TEXT)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------
--STORED PROCEDURE add_user_n
--este stored procedure añade un nuevo usuario con su nombre y password
--deseados ademas de el tipo de usuario que seria ya sea 1 docente o 2 estudainte
-----------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE add_user_n(p_nombre VARCHAR, p_apellido VARCHAR, p_clave VARCHAR, p_tipo INTEGER, p_correo VARCHAR, p_detalle INTEGER)
LANGUAGE plpgsql AS $$
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
$$;
------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------------
--STORED PROCEDURE para agregar grupos con un docente a cargo y la descripcion de datos
--y/o de contacto con el grupo
------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE add_grupo(g_nombres VARCHAR, g_apellidos VARCHAR, g_docente VARCHAR, g_descripcion VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto del docente del grupo
    selec_id_usuario INTEGER;
BEGIN
    -- Verificamos si el g_docente existe en la tabla user_n y si es un docente (tipo = 1)
    SELECT id_usuario INTO selec_id_usuario
    FROM user_n
    WHERE nombres = g_docente AND apellidos= g_apellidos
    AND tipo = 1;

    -- Si no se encuentra ningún registro, lanzamos un error
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El docente con id % no existe o no es un docente', g_docente;
    END IF;

    -- Si el docente existe, procedemos con el INSERT en la tabla grupo
    INSERT INTO grupo (nombre, id_docente, descripcion)
    VALUES (g_nombre, selec_id_usuario, g_descripcion);

    RAISE NOTICE 'Grupo insertado con éxito con el docente %', selec_id_usuario;
END;
$$;
----------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------
--STORED PROCEDURE donde se cambia el password de una cuenta indicada, se valuda con el nombre
--y el password antiguo y se le manda el nuevo password mas una copia para confirmacion
----------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE change_password(u_username VARCHAR, u_old_password VARCHAR, u_new_password VARCHAR, u_confirm_password VARCHAR)
LANGUAGE plpgsql AS $$
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
$$;
----------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------
--STORED PROCEDURE para cambiar e_mail, se manda usuario y password junto con el nuevo correo
----------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE change_e_mail(u_username VARCHAR, u_password VARCHAR, new_e_mail VARCHAR)
LANGUAGE plpgsql AS $$
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
$$;
----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
--STORED PROCEDURE para agregar el estudiante elegido al grupo señalado en el rol que esta ejerciendo
----------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE add_student_to_group(nombres_e VARCHAR, apelllidos_e VARCHAR, u_rol INTEGER, nombre_grupo VARCHAR)
LANGUAGE plpgsql AS $$
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
        RAISE EXCEPTION 'El estudiante % no existe', user_estudiante;
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
    RAISE NOTICE 'Estudiante % ha sido agregado al grupo % con éxito', user_estudiante, nombre_grupo;
END;
$$;
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
--STORED PROCEDURE que elimmina a un estudiante elegido del grupo especificado
---------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE drop_student_of_group(nombres_e VARCHAR, apellidos_e VARCHAR, nombre_grupo VARCHAR)
LANGUAGE plpgsql AS $$
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
    RAISE NOTICE 'Estu  diante % ha sido eliminado del grupo % con éxito', nombres_e, nombre_grupo;
END;
$$;
------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------------------------------
--STORED PROCEDURE para cambiar al docente de su grupo de materia
------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE change_doc_mat_group(user_docente VARCHAR, clave_d VARCHAR, new_grupo_materia INTEGER)
LANGUAGE plpgsql AS $$
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
$$;
----------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE add_docente(p_nombres VARCHAR, p_apellidos VARCHAR, p_username VARCHAR, p_correo VARCHAR, p_grupo_materia INTEGER, p_clave VARCHAR DEFAULT NULL)
LANGUAGE plpgsql AS $$
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
    VALUES (p_username, p_nombres, p_apellidos p_clave, 1, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado
    
	INSERT INTO docente (id_usuario, grupo_materia)
        VALUES (new_id_usuario, p_grupo_materia);
       
    -- Mensaje de confirmación
    RAISE NOTICE 'docente %  ha sido insertado con éxito', p_nombre;
END;
$$;
-----------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE add_student(p_nombres VARCHAR, p_apellidos VARCHAR, p_username VARCHAR, p_codsis INTEGER, p_correo VARCHAR, p_carrera INTEGER, p_clave VARCHAR DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Si la clave es NULL o está vacía, asignamos un valor por defecto
    IF p_clave IS NULL OR p_clave = '' THEN
        p_clave := 'publica'; -- Valor por defecto
    END IF;
    IF p_username IS NULL OR p_username = '' THEN
        p_username := p_codsis; -- Valor por defecto
    END IF;
    IF p_correo IS NULL OR p_correo = '' THEN
        p_correo := 'dummy@correo.com'; -- Valor por defecto
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
$$;
--------------------------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_all_docentes()
RETURNS TABLE(nombre VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT nombres, apellidos
    FROM user_n
    WHERE tipo = 1;  -- Suponiendo que 'tipo = 1' indica que es un docente
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_all_estudiantes()
RETURNS TABLE(nombre VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT nombres, apellidos
    FROM user_n
    WHERE tipo = 2;  -- Suponiendo que 'tipo = 2' indica que es un estudiante
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------------------------------
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
----------------------------------------------------------------------------------------------------
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
-------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE crear_plan(
    p_grupo_nombre VARCHAR,
    p_grupo_id_docente INTEGER,
    p_objetivo VARCHAR(255),
    p_fecha_ini DATE,
    p_fecha_fin DATE
)
LANGUAGE plpgsql
AS $$
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
$$;
---------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION obtener_tareas_estudiante(p_id_estudiante INTEGER)
RETURNS TABLE (
    estudiante_nombre VARCHAR,
    tarea_id BIGINT,
    tarea_detalle VARCHAR,
    entregado BOOLEAN
) 
LANGUAGE plpgsql
AS $$
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
$$;
---------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION obtener_grupos_materia()
RETURNS TABLE(grupos INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Retornamos los valores únicos de grupo_materia
    RETURN QUERY
    SELECT DISTINCT grupo_materia
    FROM docente
    WHERE grupo_materia IS NOT NULL;
END;
$$;
---------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION obtener_estado_evaluacion_grupo(
    p_grupo_materia INTEGER
)
RETURNS TABLE(
    grupo_nombre VARCHAR,
    estado_evaluacion VARCHAR,
    fecha_acta_actual DATE
)
LANGUAGE plpgsql
AS $$
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
$$;

---------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE crear_tarea(
    p_plan_grupo_nombre VARCHAR,
    p_id_estudiante INTEGER,
    p_detalle VARCHAR,
    p_archivo BYTEA DEFAULT NULL,
    p_path VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
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
$$;
---------------------------------------------------------------------------------------------------------------------------