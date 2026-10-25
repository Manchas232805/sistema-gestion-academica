package com.reinodeloscielos.backend.service.impl;

import com.reinodeloscielos.backend.dto.CursoRequestDto;
import com.reinodeloscielos.backend.dto.CursoResponseDto;
import com.reinodeloscielos.backend.entity.Curso;
import com.reinodeloscielos.backend.entity.Docente;
import com.reinodeloscielos.backend.repository.CursoRepository;
import com.reinodeloscielos.backend.repository.DocenteRepository;
import com.reinodeloscielos.backend.service.CursoService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final DocenteRepository docenteRepository;

    public CursoServiceImpl(
            CursoRepository cursoRepository,
            DocenteRepository docenteRepository) {
        this.cursoRepository = cursoRepository;
        this.docenteRepository = docenteRepository;
    }

    @Override
    public CursoResponseDto guardarCurso(CursoRequestDto curso) {

        Curso cursoGuardado = new Curso();

        cursoGuardado.setNombreCurso(curso.getNombre());

        if (curso.getIdDocente() != null) {
            Docente docente = docenteRepository.findById(curso.getIdDocente())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Docente no encontrado"));

            cursoGuardado.setDocente(docente);
        }

        Curso cursoSave = cursoRepository.save(cursoGuardado);

        return toDto(cursoSave);
    }

    @Override
    public List<CursoResponseDto> listarCursos() {

        return cursoRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public void eliminarCurso(Long id) {

        if (cursoRepository.findById(id).isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Curso no encontrado");
        }

        cursoRepository.deleteById(id);
    }

    @Override
    public CursoResponseDto actualizarCurso(
            Long id,
            CursoRequestDto curso) {

        Curso cursoActualizado = cursoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Curso no encontrado"));

        cursoActualizado.setNombreCurso(curso.getNombre());

        if (curso.getIdDocente() != null) {
            Docente docente = docenteRepository.findById(curso.getIdDocente())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Docente no encontrado"));

            cursoActualizado.setDocente(docente);
        } else {
            cursoActualizado.setDocente(null);
        }

        Curso actualizado = cursoRepository.save(cursoActualizado);

        return toDto(actualizado);
    }

    private CursoResponseDto toDto(Curso curso) {

        CursoResponseDto dto = new CursoResponseDto();

        dto.setId(curso.getId());
        dto.setNombre(curso.getNombreCurso());

        if (curso.getDocente() != null) {
            dto.setIdDocente(curso.getDocente().getId());
        } else {
            dto.setIdDocente(null);
        }

        return dto;
    }
}