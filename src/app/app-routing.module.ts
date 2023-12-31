import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { HomeComponent } from './components/home/home.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { ListadoHistoriasClinicasComponent } from './components/listado-historias-clinicas/listado-historias-clinicas.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';

const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'turnos',
        loadChildren: () =>
          import('./modulos/turnos/turnos.module').then((m) => m.TurnosModule),
      },
      { path: 'perfil', component: MiPerfilComponent },
      { path: 'pacientes', component: ListadoHistoriasClinicasComponent },
      { path: 'historias', component: ListadoHistoriasClinicasComponent },
      { path: 'presentacion', component: PresentacionComponent },
    ],
  },
  {
    path: 'homeAdmin',
    loadChildren: () =>
      import('./modulos/usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modulos/register/register.module').then(
        (m) => m.RegisterModule
      ),
  },
  { path: '', redirectTo: '/bienvenida', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
