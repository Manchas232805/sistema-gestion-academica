import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Curso } from '../../../models/Curso';
import { CursoService } from '../../../services/curso-service';
import { DocenteService } from '../../../services/docentes';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css'
})
export class CursosComponent implements OnInit {

  mostrarConfirmacionEliminar = false;
  cursoPendienteEliminar: number | null = null;

  get cursosConDocente(): number {
  return this.cursos.filter(c => c.idDocente != null).length;
}

get cursosSinDocente(): number {
  return this.cursos.filter(c => c.idDocente == null).length;
}

  cursos: Curso[] = [];
  docentes: any[] = [];

  mostrarFormulario: boolean = false;

  cursoTemp: Curso = {
    id: 0,
    nombre: '',
    idDocente: null
  };

  idEditando: number | null = null;

  constructor(
    private cursoService: CursoService,
    private docenteService: DocenteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
    this.cargarDocentes();
  }

  cargarCursos(): void {
    this.cursoService.listar().subscribe({
      next: (data) => {
        this.cursos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
      }
    });
  }

  cargarDocentes(): void {
    this.docenteService.listar().subscribe({
      next: (data) => {
        this.docentes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar docentes:', err);
      }
    });
  }

  obtenerNombreDocente(id: number | null): string {
    if (!id) {
      return 'Sin asignar';
    }

    const docente = this.docentes.find(d => d.id === id);

    if (!docente) {
      return 'Cargando...';
    }

    return `${docente.nombres} ${docente.apellidos}`;
  }


obtenerEspecialidadDocente(idDocente: number | null): string {
  if (idDocente == null) {
    return '';
  }

  const docente = this.docentes.find(
    d => Number(d.id) === Number(idDocente)
  );

  return docente?.especialidad ?? 'Especialidad no registrada';
}


  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;

    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario(): void {
    this.cursoTemp = {
      id: 0,
      nombre: '',
      idDocente: null
    };

    this.idEditando = null;
  }

  editarCurso(curso: Curso): void {
    this.cursoTemp = {
      id: curso.id,
      nombre: curso.nombre,
      idDocente: curso.idDocente
    };

    this.idEditando = curso.id;
    this.mostrarFormulario = true;
  }

  guardarCurso(): void {
    if (!this.cursoTemp.nombre.trim()) {
      return;
    }

    const operacion = this.idEditando
      ? this.cursoService.actualizar(this.idEditando, this.cursoTemp)
      : this.cursoService.registrar(this.cursoTemp);

    operacion.subscribe({
      next: () => {
        this.cargarCursos();
        this.toggleFormulario();
      },
      error: (err) => {
        console.error('Error al guardar curso:', err);
      }
    });
  }


eliminarCurso(id: number): void {
  this.cursoPendienteEliminar = id;
  this.mostrarConfirmacionEliminar = true;
}

cancelarEliminacion(): void {
  this.mostrarConfirmacionEliminar = false;
  this.cursoPendienteEliminar = null;
}

confirmarEliminacion(): void {
  const id = this.cursoPendienteEliminar;

  if (id === null) {
    return;
  }

  this.cursoService.eliminar(id).subscribe({
    next: () => {
      this.mostrarConfirmacionEliminar = false;
      this.cursoPendienteEliminar = null;
      this.cargarCursos();
    },
    error: (err) => {
      console.error('Error al eliminar curso:', err);
      this.mostrarConfirmacionEliminar = false;
      this.cursoPendienteEliminar = null;
      alert('No se pudo eliminar el curso. Inténtalo nuevamente.');
    }
  });
}

}
