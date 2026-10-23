
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Docente, DocenteService } from '../../services/docentes';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css'
})
export class Docentes implements OnInit {
  private readonly docenteService = inject(DocenteService);

  docentes: Docente[] = [];
  busqueda = '';
  mostrarFormulario = false;
  editando = false;
  cargando = false;
  mensaje = '';
  error = '';

  mostrarConfirmacionEliminar = false;
  docentePendienteEliminar: Docente | null = null;

  formulario: Docente = this.nuevoDocente();

  ngOnInit(): void {
    this.listarDocentes();
  }

  nuevoDocente(): Docente {
    return {
      nombres: '',
      apellidos: '',
      correo: '',
      telefono: '',
      especialidad: ''
    };
  }

  listarDocentes(): void {
    this.cargando = true;
    this.error = '';

    this.docenteService.listar().subscribe({
      next: (datos) => {
        this.docentes = datos;
        this.cargando = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al listar docentes:', err);
        this.error = 'No se pudieron cargar los docentes.';
        this.cargando = false;
      }
    });
  }

  get docentesFiltrados(): Docente[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) return this.docentes;

    return this.docentes.filter(d =>
      `${d.nombres} ${d.apellidos} ${d.correo ?? ''} ${d.especialidad ?? ''}`
        .toLowerCase()
        .includes(termino)
    );
  }

  abrirNuevo(): void {
    this.formulario = this.nuevoDocente();
    this.editando = false;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  abrirEdicion(docente: Docente): void {
    this.formulario = { ...docente };
    this.editando = true;
    this.mostrarFormulario = true;
    this.mensaje = '';
    this.error = '';
  }

  guardar(): void {
    this.mensaje = '';
    this.error = '';

    const operacion = this.editando && this.formulario.id
      ? this.docenteService.actualizar(this.formulario.id, this.formulario)
      : this.docenteService.crear(this.formulario);

    operacion.subscribe({
      next: () => {
        this.mensaje = this.editando
          ? 'Docente actualizado correctamente.'
          : 'Docente registrado correctamente.';

        this.mostrarFormulario = false;
        this.listarDocentes();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar docente:', err);

        if (err.status === 0) {
          this.error = 'No hay conexión con el servidor. Comprueba que Spring Boot esté ejecutándose.';
        } else if (err.status === 400) {
          this.error = 'Los datos enviados no son válidos. Revisa el formulario.';
        } else if (err.status === 409) {
          this.error = 'Ese correo electrónico ya está registrado.';
        } else {
          this.error = 'No se pudo guardar el docente. Inténtalo nuevamente.';
        }
      }
    });
  }


eliminar(docente: Docente): void {
  if (!docente.id) return;

  this.mensaje = '';
  this.error = '';

  this.mostrarFormulario = false;

  this.docentePendienteEliminar = docente;
  this.mostrarConfirmacionEliminar = true;
}


  confirmarEliminacion(): void {
    const docente = this.docentePendienteEliminar;

    if (!docente?.id) return;

    this.docenteService.eliminar(docente.id).subscribe({
      next: () => {
        this.mensaje = 'Docente eliminado correctamente.';
        this.mostrarConfirmacionEliminar = false;
        this.docentePendienteEliminar = null;
        this.listarDocentes();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar docente:', err);
        this.error = 'No se pudo eliminar el docente.';
        this.mostrarConfirmacionEliminar = false;
        this.docentePendienteEliminar = null;
      }
    });
  }

  cancelarEliminacion(): void {
    this.mostrarConfirmacionEliminar = false;
    this.docentePendienteEliminar = null;
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.error = '';
  }
}
