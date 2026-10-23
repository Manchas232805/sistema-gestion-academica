import { Routes } from '@angular/router';
import { Dashboard } from './layout/dashboard';
import { Inicio } from './pages/inicio/inicio';
import { Alumnos } from './pages/alumnos/alumnos';
import { Docentes } from './pages/docentes/docentes';

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
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
