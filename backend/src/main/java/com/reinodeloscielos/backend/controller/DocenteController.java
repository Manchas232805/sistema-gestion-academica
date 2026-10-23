package com.reinodeloscielos.backend.controller;

import com.reinodeloscielos.backend.entity.Docente;
import com.reinodeloscielos.backend.service.DocenteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin(origins = "http://localhost:4200")
public class DocenteController {

    private final DocenteService docenteService;

    public DocenteController(DocenteService docenteService) {
        this.docenteService = docenteService;
    }

    @GetMapping
    public List<Docente> listarTodos() {
        return docenteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> buscarPorId(@PathVariable Long id) {
        return docenteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Docente> crear(@RequestBody Docente docente) {
        Docente nuevoDocente = docenteService.guardar(docente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDocente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docente> actualizar(
            @PathVariable Long id,
            @RequestBody Docente datosDocente) {
                Docente actualizado = docenteService.actualizar(id, datosDocente);
    return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (docenteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        docenteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
