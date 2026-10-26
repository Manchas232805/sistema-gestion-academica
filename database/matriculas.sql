-- Ejecutar sobre gestion_academica después de iniciar el backend al menos una vez:
-- Hibernate crea las tablas alumnos y curso del proyecto existente.
-- No borra ni modifica los registros actuales.
CREATE TABLE IF NOT EXISTS matriculas (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    alumno_id BIGINT NOT NULL,
    curso_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(10) NOT NULL DEFAULT 'ACTIVA',
    CONSTRAINT uk_matricula_alumno_curso UNIQUE (alumno_id, curso_id),
    CONSTRAINT fk_matricula_alumno FOREIGN KEY (alumno_id) REFERENCES alumnos(id),
    CONSTRAINT fk_matricula_curso FOREIGN KEY (curso_id) REFERENCES curso(id)
);
