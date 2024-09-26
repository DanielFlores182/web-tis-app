-- -------------------------------------------------------------------------
-- PostgreSQL SQL create tables
-- exported at Mon Sep 16 12:10:38 BOT 2024 with easyDesigner
-- -------------------------------------------------------------------------

-- -------------------------------------------------------------------------
-- Table: user_n
-- -------------------------------------------------------------------------
CREATE DATABASE mi_base_datos;
\c mi_base_datos;  -- Conectar a la base de datos recién c  reada
----------------------------------------------------------------------------
CREATE TABLE "user_n" (
  "id_usuario" bigserial NOT NULL,
  "username" CHARACTER VARYING NULL,
  "nombres" CHARACTER VARYING NOT NULL,
  "apellidos" CHARACTER VARYING NOT NULL,
  "clave" CHARACTER VARYING NOT NULL,
  "tipo" INTEGER NOT NULL,
  "correo" CHARACTER VARYING NOT NULL,
  PRIMARY KEY ("id_usuario")
);

-- -------------------------------------------------------------------------
-- Table: estudiante
-- -------------------------------------------------------------------------
CREATE TABLE "estudiante" (
  "id_usuario" INTEGER NOT NULL,
  "cod_sis" INTEGER NOT NULL,
  PRIMARY KEY ("id_usuario")
);

-- -------------------------------------------------------------------------
-- Table: docente
-- -------------------------------------------------------------------------
CREATE TABLE "docente" (
  "id_usuario" INTEGER NOT NULL,
  "grupo_materia" INTEGER NULL,
  PRIMARY KEY ("id_usuario")
);

-- -------------------------------------------------------------------------
-- Table: grupo_estudiante
-- -------------------------------------------------------------------------
CREATE TABLE "grupo_estudiante" (
  "id_estudiante" INTEGER NOT NULL,
  "grupo_nombre" CHARACTER VARYING NOT NULL,
  "grupo_id_docente" INTEGER NOT NULL,
  "rol" INTEGER NOT NULL,
  PRIMARY KEY ("id_estudiante", "grupo_nombre", "grupo_id_docente")
);

-- -------------------------------------------------------------------------
-- Table: grupo
-- -------------------------------------------------------------------------
CREATE TABLE "grupo" (
  "nombre" CHARACTER VARYING NOT NULL,
  "id_docente" INTEGER NOT NULL,
  "descripcion" CHARACTER VARYING NOT NULL,
  PRIMARY KEY ("nombre", "id_docente")
);

-- -------------------------------------------------------------------------
-- Table: plan
-- -------------------------------------------------------------------------
CREATE TABLE "plan" (
  "grupo_nombre" CHARACTER VARYING NOT NULL,
  "grupo_id_docente" INTEGER NOT NULL,
  "tipo_plan" INTEGER NOT NULL,
  "descripcion" VARCHAR(255) NOT NULL,
  "fecha_ini" DATE NULL,
  "fecha_fin" DATE NULL,
  PRIMARY KEY ("grupo_nombre", "grupo_id_docente")
);

-- -------------------------------------------------------------------------
-- Table: tipo_plan
-- -------------------------------------------------------------------------
CREATE TABLE "tipo_plan" (
  "id_plan" bigserial NOT NULL,
  "nombre" CHARACTER VARYING NOT NULL,
  "detalle" CHARACTER VARYING NOT NULL,
  "requerimiento" INTEGER NULL,
  PRIMARY KEY ("id_plan")
);

-- -------------------------------------------------------------------------
-- Table: tarea
-- -------------------------------------------------------------------------
CREATE TABLE "tarea" (
  "plan_grupo_nombre" CHARACTER VARYING NOT NULL,
  "plan_grupo_id_docente" INTEGER NOT NULL,
  "id_estudiante" INTEGER NOT NULL,
  "id_tarea" bigserial NOT NULL,
  "detalle" CHARACTER VARYING NOT NULL,
  "archivo" BYTEA NULL,
  "path" CHARACTER VARYING NULL,
  PRIMARY KEY ("plan_grupo_nombre", "plan_grupo_id_docente", "id_estudiante")
);

-- -------------------------------------------------------------------------
-- Table: evaluacion
-- -------------------------------------------------------------------------
CREATE TABLE "evaluacion" (
  "plan_grupo_nombre" CHARACTER VARYING NOT NULL,
  "plan_grupo_id_docente" INTEGER NOT NULL,
  "tipo_evaluacion" INTEGER NOT NULL,
  "calificacion" INTEGER NOT NULL,
  "descripcion" CHARACTER VARYING NOT NULL,
  PRIMARY KEY ("plan_grupo_nombre", "plan_grupo_id_docente")
);

-- -------------------------------------------------------------------------
-- Table: evaluacion_pares
-- -------------------------------------------------------------------------
CREATE TABLE "evaluacion_pares" (
  "evaluacion_plan_grupo_nombre" CHARACTER VARYING NOT NULL,
  "evaluacion_plan_grupo_id_docente" INTEGER NOT NULL,
  "id_estudiante" INTEGER NOT NULL,
  "evaluado" INTEGER NOT NULL,
  PRIMARY KEY ("evaluacion_plan_grupo_nombre", "evaluacion_plan_grupo_id_docente", "id_estudiante", "evaluado")
);

-- -------------------------------------------------------------------------
-- Table: evaluacion_cruzada
-- -------------------------------------------------------------------------
CREATE TABLE "evaluacion_cruzada" (
  "evaluacion_plan_grupo_nombre" CHARACTER VARYING NOT NULL,
  "evaluacion_plan_grupo_id_docente" INTEGER NOT NULL,
  "grupo_nombre" CHARACTER VARYING NOT NULL,
  "grupo_id_docente" INTEGER NOT NULL,
  PRIMARY KEY ("evaluacion_plan_grupo_nombre", "evaluacion_plan_grupo_id_docente")
);

-- -------------------------------------------------------------------------
-- Table: acta
-- -------------------------------------------------------------------------
CREATE TABLE "acta" (
  "plan_grupo_nombre" CHARACTER VARYING NOT NULL,
  "plan_grupo_id_docente" INTEGER NOT NULL,
  "id_acta" bigserial NOT NULL,
  "fecha" DATE NULL,
  "descripcion" CHARACTER VARYING NULL,
  PRIMARY KEY ("plan_grupo_nombre", "plan_grupo_id_docente", "id_acta")
);

-- -------------------------------------------------------------------------
-- Relations for table: estudiante
-- -------------------------------------------------------------------------
ALTER TABLE "estudiante" ADD FOREIGN KEY ("id_usuario") 
    REFERENCES "user_n" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: docente
-- -------------------------------------------------------------------------
ALTER TABLE "docente" ADD FOREIGN KEY ("id_usuario") 
    REFERENCES "user_n" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: grupo_estudiante
-- -------------------------------------------------------------------------
ALTER TABLE "grupo_estudiante" ADD FOREIGN KEY ("id_estudiante") 
    REFERENCES "estudiante" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "grupo_estudiante" ADD FOREIGN KEY ("grupo_nombre", "grupo_id_docente") 
    REFERENCES "grupo" ("nombre", "id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: grupo
-- -------------------------------------------------------------------------
ALTER TABLE "grupo" ADD FOREIGN KEY ("id_docente") 
    REFERENCES "docente" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: plan
-- -------------------------------------------------------------------------
ALTER TABLE "plan" ADD FOREIGN KEY ("grupo_nombre", "grupo_id_docente") 
    REFERENCES "grupo" ("nombre", "id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "plan" ADD FOREIGN KEY ("tipo_plan") 
    REFERENCES "tipo_plan" ("id_plan")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: tarea
-- -------------------------------------------------------------------------
ALTER TABLE "tarea" ADD FOREIGN KEY ("plan_grupo_nombre", "plan_grupo_id_docente") 
    REFERENCES "plan" ("grupo_nombre", "grupo_id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "tarea" ADD FOREIGN KEY ("id_estudiante") 
    REFERENCES "estudiante" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: evaluacion
-- -------------------------------------------------------------------------
ALTER TABLE "evaluacion" ADD FOREIGN KEY ("plan_grupo_nombre", "plan_grupo_id_docente") 
    REFERENCES "plan" ("grupo_nombre", "grupo_id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: evaluacion_pares
-- -------------------------------------------------------------------------
ALTER TABLE "evaluacion_pares" ADD FOREIGN KEY ("evaluacion_plan_grupo_nombre", "evaluacion_plan_grupo_id_docente") 
    REFERENCES "evaluacion" ("plan_grupo_nombre", "plan_grupo_id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "evaluacion_pares" ADD FOREIGN KEY ("id_estudiante") 
    REFERENCES "estudiante" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "evaluacion_pares" ADD FOREIGN KEY ("evaluado") 
    REFERENCES "estudiante" ("id_usuario")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: evaluacion_cruzada
-- -------------------------------------------------------------------------
ALTER TABLE "evaluacion_cruzada" ADD FOREIGN KEY ("evaluacion_plan_grupo_nombre", "evaluacion_plan_grupo_id_docente") 
    REFERENCES "evaluacion" ("plan_grupo_nombre", "plan_grupo_id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
ALTER TABLE "evaluacion_cruzada" ADD FOREIGN KEY ("grupo_nombre", "grupo_id_docente") 
    REFERENCES "grupo" ("nombre", "id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;

-- -------------------------------------------------------------------------
-- Relations for table: acta
-- -------------------------------------------------------------------------
ALTER TABLE "acta" ADD FOREIGN KEY ("plan_grupo_nombre", "plan_grupo_id_docente") 
    REFERENCES "plan" ("grupo_nombre", "grupo_id_docente")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;