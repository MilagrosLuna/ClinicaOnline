import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';
import { Turno } from 'src/app/clases/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-listado-dias-turno',
  templateUrl: './listado-dias-turno.component.html',
  styleUrls: ['./listado-dias-turno.component.css'],
})
export class ListadoDiasTurnoComponent implements OnInit {
  @Input() especialista: string | undefined;
  @Output() turnoSeleccionado = new EventEmitter<{ dia: Date; hora: string }>();

  diasDisponibles: { dia: Date; horarios: string[]; }[] = [];
  
  selectedDay: Date | undefined;
  selectedHour: string | undefined;
  periodos = ['mañana', 'tarde'];

  constructor(private auth: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    this.diasDisponibles = await this.obtenerDiasDisponibles();
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

  async obtenerDiasDisponibles(): Promise<{ dia: Date, horarios: string[] }[]> {
    const today = new Date();
    const diasDisponibles = [];
  
    for (let i = 0; i < 15; i++) {
      const dia = new Date(today);
      dia.setDate(today.getDate() + i);
  
      // Obtener turnos del especialista para el día actual
      const turnosDelDia = await this.obtenerTurnosDelEspecialista(dia);
  
      // Crear una lista de todos los horarios posibles
      const horariosPosibles = this.obtenerHorariosDisponibles('manana').concat(this.obtenerHorariosDisponibles('tarde'));
  
      // Filtrar los horarios que ya están tomados
      const horariosTomados = turnosDelDia.map(turno => turno.hora);
      const horariosDisponibles = horariosPosibles.filter(horario => !horariosTomados.includes(horario));
  
      // Solo agregar el día a la lista si hay al menos un horario disponible
      if (horariosDisponibles.length > 0) {
        diasDisponibles.push({ dia, horarios: horariosDisponibles });
      }
    }
  
    return diasDisponibles;
  }
  

  mismoDia(timestamp: any, dia: Date): boolean {
    const turnoFecha = this.convertirTimestampADate(timestamp);
    return (
      turnoFecha.getDate() === dia.getDate() &&
      turnoFecha.getMonth() === dia.getMonth() &&
      turnoFecha.getFullYear() === dia.getFullYear()
    );
  }

  convertirTimestampADate(timestamp: any): Date {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }

  async obtenerTurnosDelEspecialista(dia: Date): Promise<Turno[]> {
    if (!this.especialista) {
      return [];
    }
    const turnos = await this.auth.obtenerTurnos(this.especialista);
    return turnos.filter((turno) => {
      const turnoFecha = this.convertirTimestampADate(turno.fecha);
      return (
        turnoFecha.getDate() === dia.getDate() &&
        turnoFecha.getMonth() === dia.getMonth() &&
        turnoFecha.getFullYear() === dia.getFullYear()
      );
    });
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
