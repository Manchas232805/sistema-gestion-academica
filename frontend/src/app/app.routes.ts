import { Routes } from '@angular/router';
import { Dashboard } from './layout/dashboard';
import { Inicio } from './pages/inicio/inicio';
import { Alumnos } from './pages/alumnos/alumnos';
import { Docentes } from './pages/docentes/docentes';
import { CursosComponent } from './pages/admin/cursos/cursos';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: Inicio
      },
      {
        path: 'alumnos',
        component: Alumnos
      },
      {
        path: 'docentes',
        component: Docentes
      },
      {
        path: 'cursos',
        component: CursosComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
