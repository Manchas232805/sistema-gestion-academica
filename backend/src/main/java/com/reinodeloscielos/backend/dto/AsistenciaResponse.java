package com.reinodeloscielos.backend.dto;

import java.time.LocalDate;

public record AsistenciaResponse(
        Long id,
        Long alumnoId,
        String alumnoNombre,
        Long cursoId,
        String cursoNombre,
        LocalDate fecha,
        String estado
) {}