import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { RegisterAdministradorComponent } from './components/register-administrador/register-administrador.component';
import { HomeComponent } from './components/home/home.component';
import { AdministrarEspecialistasComponent } from './components/administrar-especialistas/administrar-especialistas.component';

const routes: Routes = [
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'registerAdmin', component: RegisterAdministradorComponent },
      {
        path: 'administrarEspec',
        component: AdministrarEspecialistasComponent,
      },
    ],
  },
  { path: '', redirectTo: '/bienvenida', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
