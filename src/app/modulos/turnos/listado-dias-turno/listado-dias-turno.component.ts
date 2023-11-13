import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';

@Component({
  selector: 'app-listado-dias-turno',
  templateUrl: './listado-dias-turno.component.html',
  styleUrls: ['./listado-dias-turno.component.css'],
})
export class ListadoDiasTurnoComponent {
  @Input() especialista: Especialista | undefined;
  @Output() turnoSeleccionado = new EventEmitter<{ dia: Date; hora: string }>();

  diasDisponibles: Date[] = [];
  selectedDay: Date | undefined;
  selectedHour: string | undefined;
  periodos = ['mañana', 'tarde'];

  constructor() {
    this.diasDisponibles = this.obtenerDiasDisponibles();
  }

  seleccionarTurno() {
    if (this.selectedDay && this.selectedHour) {
      this.turnoSeleccionado.emit({
        dia: this.selectedDay,
        hora: this.selectedHour,
      });
    }
  }

  obtenerFechaFormateada(fecha: Date): string {
    const opcionesFecha = {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    } as any;
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
  }

  // Método para seleccionar la hora
  seleccionarHora(dia: Date, hora: string): void {
    this.selectedDay = dia;
    this.selectedHour = hora;
  }

  obtenerDiasDisponibles(): Date[] {
    const today = new Date();
    const diasDisponibles = [];
    for (let i = 0; i < 15; i++) {
      const dia = new Date(today);
      dia.setDate(today.getDate() + i);
      diasDisponibles.push(dia);
    }
    return diasDisponibles;
  }
  obtenerHorariosDisponibles(periodo: string): string[] {
    let horariosDisponibles: string[] = [];
    if (periodo === 'manana') {
      horariosDisponibles = Array.from({ length: 5 }, (_, index) => {
        const hora = 9 + index;
        return `${hora}:00`;
      });
    } else if (periodo === 'tarde') {
      horariosDisponibles = Array.from({ length: 5 }, (_, index) => {
        const hora = 14 + index;
        return `${hora}:00`;
      });
    }
    return horariosDisponibles;
  }
}
