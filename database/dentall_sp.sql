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

CREATE OR REPLACE FUNCTION public.obtener_ordenes_no_entregadas_por_fecha(fecha_entrega_param date)
RETURNS TABLE (
    id bigint,
    clinica character varying,
    odontologo character varying,
    direccion character varying,
    telefono_dentista bigint,
    descripcion character varying,
    paciente character varying,
    colorimetro character varying,
    fecha_inicio date,
    fecha_entrega date,
    edad bigint,
    genero text,
    telefono_clinica bigint,
    urgente boolean,
    regular boolean,
    especial boolean,
    largoplazo boolean,
    antagonista boolean,
    articulador boolean,
    transfer boolean,
    analogo boolean,
    tornillo boolean,
    uclas boolean,
    otros boolean,
    cara_oclusal_si boolean,
    cara_oclusal_no boolean,
    zona_cervical_oscura boolean,
    zona_cervical_normal boolean,
    incisal_translucida boolean,
    incisal_normal boolean,
    mamelones_si boolean,
    mamelones_no boolean,
    entregado boolean,
    hora_de_entrega time
) AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.orden_de_trabajo as A
    WHERE A.fecha_entrega = fecha_entrega_param
      AND A.entregado = false
    ORDER BY
        CASE
            WHEN A.urgente = true THEN 1
            WHEN A.especial = true THEN 2
            WHEN A.regular = true THEN 3
            WHEN A.largoplazo = true THEN 4
            ELSE 5
        END;
END;
$$ LANGUAGE plpgsql;