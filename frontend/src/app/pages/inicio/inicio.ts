import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlumnoService, Alumno } from '../../services/alumno';
import { MatriculaService } from '../../services/matricula-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private readonly alumnoService = inject(AlumnoService);
  private readonly matriculaService = inject(MatriculaService);
  totalMatriculas = 0;
  cargandoMatriculas = true;
  errorMatriculas = false;

  alumnos: Alumno[] = [];
  get alumnosRecientes(): Alumno[] {
  return this.alumnos.slice(-5).reverse();
}
  cargandoAlumnos = true;
  errorAlumnos = false;

  ngOnInit(): void {
    this.matriculaService.listar().subscribe({
      next: datos => { this.totalMatriculas = datos.length; this.cargandoMatriculas = false; },
      error: () => { this.errorMatriculas = true; this.cargandoMatriculas = false; }
    });
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
