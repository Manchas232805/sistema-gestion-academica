
package com.reinodeloscielos.backend.controller;

import com.reinodeloscielos.backend.dto.CursoAlumnoResponse;
import com.reinodeloscielos.backend.entity.Matricula;
import com.reinodeloscielos.backend.entity.Usuario;
import com.reinodeloscielos.backend.repository.MatriculaRepository;
import com.reinodeloscielos.backend.repository.UsuarioRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/mis-cursos")
public class MisCursosController {

    private final MatriculaRepository matriculaRepository;
    private final UsuarioRepository usuarioRepository;

    public MisCursosController(
            MatriculaRepository matriculaRepository,
            UsuarioRepository usuarioRepository) {
        this.matriculaRepository = matriculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<CursoAlumnoResponse> listar(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debes iniciar sesión");
        }

        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"));

        if (!"ALUMNO".equals(usuario.getRol()) || usuario.getAlumno() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta sección es exclusiva para alumnos");
        }

        Long alumnoId = usuario.getAlumno().getId();

        return matriculaRepository
                .findByAlumnoIdAndEstadoOrderByIdDesc(
                        alumnoId,
                        Matricula.Estado.ACTIVA
                )
                .stream()
                .map(matricula -> {
                    var curso = matricula.getCurso();

                    String nombreDocente = "Docente no asignado";

                    if (curso.getDocente() != null) {
                        nombreDocente =
                                curso.getDocente().getNombres()
                                + " "
                                + curso.getDocente().getApellidos();
                    }

                    return new CursoAlumnoResponse(
                            curso.getId(),
                            curso.getNombreCurso(),
                            nombreDocente
                    );
                })
                .toList();
    }
}
