package com.reinodeloscielos.backend.service;

import com.reinodeloscielos.backend.entity.Docente;
import com.reinodeloscielos.backend.repository.DocenteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteService {

    private final DocenteRepository docenteRepository;

    public DocenteService(DocenteRepository docenteRepository) {
        this.docenteRepository = docenteRepository;
    }

    public List<Docente> listarTodos() {
        return docenteRepository.findAll();
    }

    public Optional<Docente> buscarPorId(Long id) {
        return docenteRepository.findById(id);
    }

    public Docente guardar(Docente docente) {
        validarCorreo(docente.getCorreo(), null);
        return docenteRepository.save(docente);
    }

    public Docente actualizar(Long id, Docente datosDocente) {
        Docente existente = docenteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Docente no encontrado"));

        validarCorreo(datosDocente.getCorreo(), id);

        existente.setNombres(datosDocente.getNombres());
        existente.setApellidos(datosDocente.getApellidos());
        existente.setCorreo(datosDocente.getCorreo());
        existente.setTelefono(datosDocente.getTelefono());
        existente.setEspecialidad(datosDocente.getEspecialidad());

        return docenteRepository.save(existente);
    }

    public void eliminar(Long id) {
        docenteRepository.deleteById(id);
    }

    private void validarCorreo(String correo, Long idActual) {
        if (correo == null || correo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El correo es obligatorio");
        }

        boolean duplicado = idActual == null
                ? docenteRepository.existsByCorreoIgnoreCase(correo.trim())
                : docenteRepository.existsByCorreoIgnoreCaseAndIdNot(
                        correo.trim(), idActual);

        if (duplicado) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un docente registrado con ese correo");
        }
    }
}
