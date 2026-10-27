import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  cargando = false;
  error = '';

  private readonly apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  iniciarSesion(): void {
    this.error = '';

    if (!this.username.trim() || !this.password) {
      this.error = 'Ingresa tu usuario y contraseña.';
      return;
    }

    this.cargando = true;

    this.http.post<{ username: string; mensaje: string; rol: string }>(
      this.apiUrl,
      {
        username: this.username.trim(),
        password: this.password
      }
    ).subscribe({
      next: (respuesta) => {
        this.cargando = false;

        if (respuesta.rol !== 'ADMIN') {
          this.error = 'Este usuario no tiene permisos de administrador.';
          return;
        }

        sessionStorage.setItem('usuario', respuesta.username);
        sessionStorage.setItem('rol', respuesta.rol);

        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.cargando = false;

        if (err.status === 401 || err.status === 403) {
          this.error = 'Usuario o contraseña incorrectos.';
        } else {
          this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté iniciado.';
        }
      }
    });
  }
}
