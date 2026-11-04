package com.reinodeloscielos.backend.repository;

import com.reinodeloscielos.backend.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    @EntityGraph(attributePaths = {"docente"})
    List<Curso> findByDocenteIdOrderByNombreCursoAsc(Long docenteId);
}