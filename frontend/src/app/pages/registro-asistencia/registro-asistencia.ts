import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AsistenciaService } from '../../services/asistencia-service';

@Component({
  selector: 'app-registro-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-asistencia.html',
  styleUrl: './registro-asistencia.css'
})
export class RegistroAsistenciaComponent implements OnInit {

  cursos: any[] = [];
  alumnos: any[] = [];

  cursoSeleccionado: number | null = null;
  fecha: string = new Date().toLocaleDateString('en-CA');

  cargando = false;
  guardando = false;
  mensaje = '';
  error = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.asistenciaService.obtenerMisCursos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.error = 'No se pudieron cargar tus cursos.';
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarCurso(): void {
    if (!this.cursoSeleccionado) {
      this.alumnos = [];
      return;
    }

    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.asistenciaService
      .obtenerAlumnosDelCurso(this.cursoSeleccionado)
      .subscribe({
        next: (data) => {
          this.alumnos = data.map(alumno => ({
            ...alumno,
            estado: 'ASISTIO'
          }));

          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar alumnos:', err);
          this.error = 'No se pudieron cargar los alumnos.';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  guardarAsistencia(): void {
    if (!this.cursoSeleccionado || !this.fecha || this.alumnos.length === 0) {
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    let completados = 0;
    let errores = 0;

    this.alumnos.forEach(alumno => {
      this.asistenciaService.registrar({
        alumnoId: alumno.alumnoId,
        cursoId: this.cursoSeleccionado!,
        fecha: this.fecha,
        estado: alumno.estado
      }).subscribe({
        next: () => {
          completados++;
          this.finalizarGuardado(completados, errores);
        },
        error: (err) => {
          errores++;
          console.error('Error al registrar asistencia:', err);
          this.finalizarGuardado(completados, errores);
        }
      });
    });
  }

  private finalizarGuardado(completados: number, errores: number): void {
    if (completados + errores === this.alumnos.length) {
      this.guardando = false;

      if (errores === 0) {
        this.mensaje = 'Asistencia registrada correctamente.';
      } else {
        this.mensaje =
          `Se guardaron ${completados} registros. ${errores} no pudieron guardarse; posiblemente ya existían.`;
      }

      this.cdr.detectChanges();
    }
  }
}
