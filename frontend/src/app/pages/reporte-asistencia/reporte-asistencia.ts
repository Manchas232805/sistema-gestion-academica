import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService, Asistencia } from '../../services/asistencia-service';

@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './reporte-asistencia.html',
  styleUrl: './reporte-asistencia.css'
})
export class ReporteAsistenciaComponent implements OnInit {

  asistencias: Asistencia[] = [];
  asistenciasFiltradas: Asistencia[] = [];

  cargando = false;
  error = '';

  busqueda = '';
  filtroEstado = 'TODOS';

  totalAsistencias = 0;
  totalFaltas = 0;
  totalTardanzas = 0;
  porcentajeAsistencia = 0;

  constructor(
    private asistenciaService: AsistenciaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  cargarAsistencias(): void {
    this.cargando = true;
    this.error = '';

    this.asistenciaService.obtenerTodasLasAsistencias().subscribe({
      next: data => {
        this.asistencias = data;
        this.aplicarFiltros();
        this.calcularEstadisticas();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar asistencias:', err);
        this.error = 'No se pudieron cargar los registros de asistencia.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    const texto = this.busqueda.toLowerCase().trim();

    this.asistenciasFiltradas = this.asistencias.filter(a => {
      const coincideTexto =
        a.alumnoNombre.toLowerCase().includes(texto) ||
        a.cursoNombre.toLowerCase().includes(texto);

      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        a.estado === this.filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }

  calcularEstadisticas(): void {
    this.totalAsistencias = this.asistencias.filter(
      a => a.estado === 'ASISTIO'
    ).length;

    this.totalFaltas = this.asistencias.filter(
      a => a.estado === 'FALTA'
    ).length;

    this.totalTardanzas = this.asistencias.filter(
      a => a.estado === 'TARDANZA'
    ).length;

    this.porcentajeAsistencia = this.asistencias.length > 0
      ? Math.round((this.totalAsistencias / this.asistencias.length) * 100)
      : 0;
  }
}
