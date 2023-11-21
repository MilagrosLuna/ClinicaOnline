import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { AdmistradorComponent } from './admistrador/admistrador.component';
import { AdmistrarEspecialistassComponent } from './admistrar-especialistass/admistrar-especialistass.component';
import { NavbarAdmComponent } from './navbar-adm/navbar-adm.component';
import { AdmistrarTurnosComponent } from './admistrar-turnos/admistrar-turnos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdmistradorComponent,
    AdmistrarEspecialistassComponent,
    NavbarAdmComponent,
    AdmistrarTurnosComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
