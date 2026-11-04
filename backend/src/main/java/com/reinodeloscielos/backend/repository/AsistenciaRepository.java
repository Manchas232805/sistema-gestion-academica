package com.reinodeloscielos.backend.repository;

import com.reinodeloscielos.backend.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface AsistenciaRepository
        extends JpaRepository<Asistencia, Long> {

@EntityGraph(attributePaths = {"alumno", "curso"})
List<Asistencia> findByAlumnoIdOrderByFechaDesc(Long alumnoId);

@EntityGraph(attributePaths = {"alumno", "curso"})
List<Asistencia> findByCursoIdAndFechaOrderByAlumnoApellidosAsc(
        Long cursoId,
        java.time.LocalDate fecha
);

boolean existsByAlumnoIdAndCursoIdAndFecha(
        Long alumnoId,
        Long cursoId,
        java.time.LocalDate fecha
);

@EntityGraph(attributePaths = {"alumno", "curso"})
List<Asistencia> findByAlumnoIdAndCursoIdOrderByFechaDesc(
        Long alumnoId,
        Long cursoId
);

@EntityGraph(attributePaths = {"alumno", "curso"})
List<Asistencia> findAllByOrderByFechaDesc();
}