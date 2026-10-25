package com.reinodeloscielos.backend.dto;

public class CursoRequestDto {

    private String nombre;
    private Long idDocente;

    public CursoRequestDto() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getIdDocente() {
        return idDocente;
    }

    public void setIdDocente(Long idDocente) {
        this.idDocente = idDocente;
    }
}