import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsistenciaService, Asistencia } from '../../services/asistencia-service';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css'
})
export class AsistenciaComponent implements OnInit {

  asistencias: Asistencia[] = [];
  cargando = true;
  error = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAsistencia();
  }

  cargarAsistencia(): void {
    this.cargando = true;

    this.asistenciaService.obtenerMiAsistencia().subscribe({
      next: (data) => {
        this.asistencias = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar asistencia:', err);
        this.error = 'No se pudo cargar tu historial de asistencia.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get totalAsistencias(): number {
    return this.asistencias.filter(a => a.estado === 'ASISTIO').length;
  }

  get totalFaltas(): number {
    return this.asistencias.filter(a => a.estado === 'FALTA').length;
  }

  get totalTardanzas(): number {
    return this.asistencias.filter(a => a.estado === 'TARDANZA').length;
  }

  get porcentajeAsistencia(): number {
    if (this.asistencias.length === 0) return 0;

    return Math.round(
      (this.totalAsistencias / this.asistencias.length) * 100
    );
  }
}
