import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlumnoService, Alumno } from '../../services/alumno';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private readonly alumnoService = inject(AlumnoService);

  alumnos: Alumno[] = [];
  get alumnosRecientes(): Alumno[] {
  return this.alumnos.slice(-5).reverse();
}
  cargandoAlumnos = true;
  errorAlumnos = false;

  ngOnInit(): void {
    this.alumnoService.listar().subscribe({
      next: (datos) => {
        this.alumnos = datos;
        this.cargandoAlumnos = false;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
        this.errorAlumnos = true;
        this.cargandoAlumnos = false;
      }
    });
  }
}
