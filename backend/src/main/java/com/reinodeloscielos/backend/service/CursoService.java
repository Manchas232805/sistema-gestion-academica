package com.reinodeloscielos.backend.service;

import com.reinodeloscielos.backend.dto.CursoRequestDto;
import com.reinodeloscielos.backend.dto.CursoResponseDto;

import java.util.List;

public interface CursoService {

    CursoResponseDto guardarCurso(CursoRequestDto curso);

    List<CursoResponseDto> listarCursos();

    void eliminarCurso(Long id);

    CursoResponseDto actualizarCurso(Long id, CursoRequestDto curso);
}