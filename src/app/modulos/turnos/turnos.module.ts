import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRoutingModule } from './turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosEspecialistaComponent } from 'src/app/modulos/turnos/turnos-especialista/turnos-especialista.component';
import { TurnosPacienteComponent } from 'src/app/modulos/turnos/turnos-paciente/turnos-paciente.component';
import { SolicitarTurnoComponent } from 'src/app/components/solicitar-turno/solicitar-turno.component';


@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosEspecialistaComponent,
    TurnosPacienteComponent,
    SolicitarTurnoComponent,
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule
  ]
})
export class TurnosModule { }
