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
    WHERE nombre = u_username
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
CREATE OR REPLACE PROCEDURE add_user_n(p_nombre VARCHAR, p_clave VARCHAR, p_tipo INTEGER, p_correo VARCHAR, p_detalle INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Insertamos el nuevo registro en la tabla user_n
    INSERT INTO user_n (nombre, clave, tipo, correo)
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
CREATE OR REPLACE PROCEDURE add_grupo(g_nombre VARCHAR, g_docente VARCHAR, g_descripcion VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto del docente del grupo
    selec_id_usuario INTEGER;
BEGIN
    -- Verificamos si el g_docente existe en la tabla user_n y si es un docente (tipo = 1)
    SELECT id_usuario INTO selec_id_usuario
    FROM user_n
    WHERE nombre = g_docente
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
    WHERE nombre = p_username;

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
    WHERE nombre = u_username;

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
    WHERE nombre = u_username;

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
    WHERE nombre = u_username;

    -- Confirmación de éxito
    RAISE NOTICE 'Contraseña actualizada con éxito para el usuario %', u_username;
END;
$$;
----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
--STORED PROCEDURE para agregar el estudiante elegido al grupo señalado en el rol que esta ejerciendo
----------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE add_student_to_group(nombre_estudiante VARCHAR, u_rol INTEGER, nombre_grupo VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    id_estudiante INTEGER;
    id_docente_g INTEGER;
BEGIN
    -- Verificamos si el estudiante existe en la tabla user_n y obtenemos su id_contacto
    SELECT id_usuario INTO id_estudiante
    FROM user_n
    WHERE nombre = nombre_estudiante
    AND tipo = 2;  -- tipo 2 para estudiante

    -- Si no se encuentra al estudiante, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El estudiante % no existe', nombre_estudiante;
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
    RAISE NOTICE 'Estudiante % ha sido agregado al grupo % con éxito', nombre_estudiante, nombre_grupo;
END;
$$;
--------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------
--STORED PROCEDURE que elimmina a un estudiante elegido del grupo especificado
---------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE drop_student_of_group(nombre_estudiante VARCHAR, nombre_grupo VARCHAR)
LANGUAGE plpgsql AS $$
DECLARE
    id_estudiante_g INTEGER;
	id_docente_g INTEGER;
BEGIN
    -- Verificamos si el estudiante existe en la tabla user_n y obtenemos su id_contacto
    SELECT id_usuario INTO id_estudiante_g
    FROM user_n
    WHERE nombre = nombre_estudiante
    AND tipo = 2;  -- tipo 2 para estudiante

    -- Si no se encuentra al estudiante, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El estudiante % no existe', nombre_estudiante;
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
    RAISE NOTICE 'Estudiante % ha sido eliminado del grupo % con éxito', nombre_estudiante, nombre_grupo;
END;
$$;
------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------------------------------------------
--STORED PROCEDURE para cambiar al docente de su grupo de materia
------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE change_doc_mat_group(nombre_docente VARCHAR, clave_d VARCHAR, new_grupo_materia INTEGER)
LANGUAGE plpgsql AS $$
DECLARE
	stored_password VARCHAR;
	id_docente_g INTEGER;
BEGIN
    -- Verificamos si el usuario existe en la tabla user_n y obtenemos su id
    SELECT clave INTO stored_password
    FROM user_n
    WHERE nombre = nombre_docente
    AND tipo = 1;  -- tipo 1 para docente

    -- Si no se encuentra al docente, lanzamos una excepción
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El docente % no existe', nombre_docente;
    END IF;
    
	SELECT id_usuario INTO id_docente_g
    FROM user_n
    WHERE nombre = nombre_docente;
	
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
CREATE OR REPLACE PROCEDURE add_docente(p_nombre VARCHAR, p_correo VARCHAR, p_grupo_materia INTEGER, p_clave VARCHAR DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Si la clave es NULL o está vacía, asignamos un valor por defecto
    IF p_clave IS NULL OR p_clave = '' THEN
        p_clave := 'publica'; -- Valor por defecto
    END IF;

    -- Insertamos el nuevo docente en la tabla user_n con el tipo = 1 (docente)
    INSERT INTO user_n (nombre, clave, tipo, correo)
    VALUES (p_nombre, p_clave, 1, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado
    
	INSERT INTO docente (id_usuario, grupo_materia)
        VALUES (new_id_usuario, p_grupo_materia);
       
    -- Mensaje de confirmación
    RAISE NOTICE 'docente %  ha sido insertado con éxito', p_nombre;
END;
$$;
-----------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE add_student(p_nombre VARCHAR, p_codsis INTEGER, p_correo VARCHAR, p_carrera INTEGER, p_clave VARCHAR DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE
    -- Declaramos una variable para almacenar el id_contacto que se autoincrementa
    new_id_usuario INTEGER;
BEGIN
    -- Si la clave es NULL o está vacía, asignamos un valor por defecto
    IF p_clave IS NULL OR p_clave = '' THEN
        p_clave := 'publica'; -- Valor por defecto
    END IF;

    -- Insertamos el nuevo estudiante en la tabla user_n con el tipo = 2 (estudiante)
    INSERT INTO user_n (nombre, clave, tipo, correo)
    VALUES (p_nombre, p_clave, 2, p_correo)
    RETURNING id_usuario INTO new_id_usuario; -- Guardamos el id autoincrementado
    
	INSERT INTO estudiante (id_usuario, cod_sis, carrera)
        VALUES (new_id_usuario, p_codsis, p_carrera);
        RAISE NOTICE 'El usuario ha sido insertado como estudiante con id %', new_id_usuario;
    -- Mensaje de confirmación
    RAISE NOTICE 'Estudiante % con código % ha sido insertado con éxito', p_nombre, p_codsis;
END;
$$;
--------------------------------------------------------------------------------------------------------------------------------------------------