import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asistencia {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  cursoId: number;
  cursoNombre: string;
  fecha: string;
  estado: 'ASISTIO' | 'FALTA' | 'TARDANZA';
}

export interface RegistrarAsistencia {
  alumnoId: number;
  cursoId: number;
  fecha: string;
  estado: 'ASISTIO' | 'FALTA' | 'TARDANZA';
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'http://localhost:8080/api/asistencias';

  constructor(private http: HttpClient) {}

  obtenerMiAsistencia(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(
      `${this.apiUrl}/mi-asistencia`
    );
  }

  obtenerAsistenciaAlumno(alumnoId: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(
      `${this.apiUrl}/alumno/${alumnoId}`
    );
  }

  registrar(data: RegistrarAsistencia): Observable<Asistencia> {
    return this.http.post<Asistencia>(
      `${this.apiUrl}/registrar`,
      data
    );
  }

  obtenerMisCursos() {
  return this.http.get<any[]>(
    'http://localhost:8080/api/docente/asistencia/mis-cursos'
  );
}

  obtenerAlumnosDelCurso(cursoId: number) {
  return this.http.get<any[]>(
    `http://localhost:8080/api/docente/asistencia/curso/${cursoId}/alumnos`
  );
}

  obtenerTodasLasAsistencias(): Observable<Asistencia[]> {
  return this.http.get<Asistencia[]>(`${this.apiUrl}/admin/todas`);
}
}
