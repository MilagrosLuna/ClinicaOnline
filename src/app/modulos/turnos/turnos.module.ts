import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TurnosRoutingModule } from './turnos-routing.module';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosEspecialistaComponent } from 'src/app/modulos/turnos/turnos-especialista/turnos-especialista.component';
import { TurnosPacienteComponent } from 'src/app/modulos/turnos/turnos-paciente/turnos-paciente.component';
import { SolicitarTurnoComponent } from 'src/app/components/solicitar-turno/solicitar-turno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListadoDiasTurnoComponent } from './listado-dias-turno/listado-dias-turno.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EncuestaComponent } from './encuesta/encuesta.component';

@NgModule({
  declarations: [
    MisTurnosComponent,
    TurnosEspecialistaComponent,
    TurnosPacienteComponent,
    SolicitarTurnoComponent,    
    ListadoDiasTurnoComponent,
    EncuestaComponent,
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
  ],
})
export class TurnosModule {}
