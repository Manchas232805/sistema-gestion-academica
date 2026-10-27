
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AlumnoService, Alumno } from '../../services/alumno';
import { DocenteService } from '../../services/docentes';
import { CursoService } from '../../services/curso-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private readonly alumnoService = inject(AlumnoService);
  private readonly docenteService = inject(DocenteService);
  private readonly cursoService = inject(CursoService);

  alumnos: Alumno[] = [];
  totalDocentes = 0;
  totalCursos = 0;

  cargandoAlumnos = true;
  errorAlumnos = false;

  get alumnosRecientes(): Alumno[] {
    return this.alumnos.slice(-5).reverse();
  }

  ngOnInit(): void {
    forkJoin({
      alumnos: this.alumnoService.listar(),
      docentes: this.docenteService.listar(),
      cursos: this.cursoService.listar()
    }).subscribe({
      next: (datos) => {
        this.alumnos = datos.alumnos;
        this.totalDocentes = datos.docentes.length;
        this.totalCursos = datos.cursos.length;
        this.cargandoAlumnos = false;
      },
      error: (error) => {
        console.error('Error al cargar las estadísticas:', error);
        this.errorAlumnos = true;
        this.cargandoAlumnos = false;
      }
    });
  }
}
