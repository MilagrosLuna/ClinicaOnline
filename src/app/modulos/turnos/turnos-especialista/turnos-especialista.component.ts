import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css'],
})
export class TurnosEspecialistaComponent {
  turnos: any[] = [];
  @Input() especialistaId: string = '';

  @ViewChild('filtroEspecialidad') filtroEspecialidad!: ElementRef;
  @ViewChild('filtroPaciente') filtroPaciente!: ElementRef;

  private _turnos = new BehaviorSubject<any[]>([]);
  turnosFiltrados = this._turnos
    .asObservable()
    .pipe(
      map((turnos) =>
        turnos.filter(
          (turno) =>
            turno.Especialidad.includes(
              this.filtroEspecialidad.nativeElement.value
            ) &&
            turno.Paciente.includes(
              this.filtroPaciente.nativeElement.value
            )
        )
      )
    );

  constructor(
    private firestoreService: FirebaseService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    console.log(this.especialistaId);
    await this.cargarTurnos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  async cargarTurnos() {
    if (this.especialistaId !== '') {
      let turnos = await this.firestoreService.obtenerTurnosDelUsuario(
        this.especialistaId,'especialista'
      );
      let especialidades = await this.firestoreService.obtenerEspecialidades();

      for (let turno of turnos) {
        let especialidad = especialidades.find(
          (especialidad) => especialidad.id === turno.idEspecialidad
        );
        turno.Especialidad = especialidad.nombre;
        turno.idEspecialidad = especialidad.id;

        let Paciente = await this.firestoreService.getUserByUidAndType(
          turno.idPaciente,
          'pacientes'
        );

        turno.Paciente = Paciente.nombre + ' ' + Paciente.apellido;
        turno.idPaciente = Paciente.id;
      }

      this._turnos.next(turnos);
    }
  }

  filtrarTurnos() {
    this._turnos.next(this._turnos.value);
  }

  obtenerFechaHoraFormateada(fecha: any, hora: string): string {
    const fechaFormateada = fecha.toDate().toLocaleDateString('es-AR');
    return `${fechaFormateada} ${hora}`;
  }

  async cancelarTurno() {}

  verResena() {}

  completarEncuesta() {}

  calificarAtencion() {}
}
