package com.reinodeloscielos.backend.repository;

import com.reinodeloscielos.backend.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}