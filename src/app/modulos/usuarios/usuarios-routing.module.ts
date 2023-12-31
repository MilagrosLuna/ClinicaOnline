import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAdministradorComponent } from 'src/app/modulos/register/register-administrador/register-administrador.component';
import { AdmistradorComponent } from './admistrador/admistrador.component';
import { AdmistrarEspecialistassComponent } from './admistrar-especialistass/admistrar-especialistass.component';
import { AdmistrarTurnosComponent } from './admistrar-turnos/admistrar-turnos.component';
import { SolicitarTurnoComponent } from 'src/app/components/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from 'src/app/components/mi-perfil/mi-perfil.component';
import { ListadoHistoriasClinicasComponent } from 'src/app/components/listado-historias-clinicas/listado-historias-clinicas.component';
import { PresentacionComponent } from 'src/app/components/presentacion/presentacion.component';
import { GraficosComponent } from './graficos/graficos.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdmistradorComponent,
    children: [
      { path: 'registerAdmin', component: RegisterAdministradorComponent },
      {
        path: 'administrar-especialistas',
        component: AdmistrarEspecialistassComponent,
      },
      { path: 'administrar-turnos', component: AdmistrarTurnosComponent },
      { path: 'solicitar-turno', component: SolicitarTurnoComponent },
      { path: 'perfil', component: MiPerfilComponent },
      { path: 'usuarios', component: ListadoHistoriasClinicasComponent },      
      { path: 'presentacion', component: PresentacionComponent },
      { path: 'graficos', component: GraficosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
