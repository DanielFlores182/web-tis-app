CREATE OR REPLACE PROCEDURE crear_orden_de_trabajo(
    p_clinica CHARACTER VARYING,
    p_odontologo CHARACTER VARYING,
    p_direccion CHARACTER VARYING,
    p_telefono_dentista BIGINT,
    p_descripcion CHARACTER VARYING,
    p_paciente CHARACTER VARYING,
    p_colorimetro CHARACTER VARYING,
    p_tipo BIGINT,
    p_fecha_inicio DATE,
    p_fecha_entrega DATE,
    p_edad BIGINT,
    p_genero BOOLEAN,
    p_telefono_clinica BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insertar una nueva orden de trabajo
    INSERT INTO public.orden_de_trabajo (
        clinica,
        odontologo,
        direccion,
        telefono_dentista,
        descripcion,
        paciente,
        colorimetro,
        tipo,
        fecha_inicio,
        fecha_entrega,
        edad,
        genero,
        telefono_clinica
    ) VALUES (
        p_clinica,
        p_odontologo,
        p_direccion,
        p_telefono_dentista,
        p_descripcion,
        p_paciente,
        p_colorimetro,
        p_tipo,
        p_fecha_inicio,
        p_fecha_entrega,
        p_edad,
        p_genero,
        p_telefono_clinica
    );

    -- Opcional: Mostrar un mensaje de éxito
    RAISE NOTICE 'Orden de trabajo creada exitosamente.';
END;
$$;