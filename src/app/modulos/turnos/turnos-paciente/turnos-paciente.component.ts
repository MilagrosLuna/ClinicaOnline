import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css'],
})
export class TurnosPacienteComponent {
  turnos: any[] = [];
  @Input() pacienteId: string = '';

  @ViewChild('filtroEspecialidad') filtroEspecialidad!: ElementRef;
  @ViewChild('filtroEspecialista') filtroEspecialista!: ElementRef;

  private _turnos = new BehaviorSubject<any[]>([]);
  turnosFiltrados = this._turnos.asObservable().pipe(
    map(turnos => 
      turnos.filter(turno => 
        turno.Especialidad.includes(this.filtroEspecialidad.nativeElement.value) &&
        turno.Especialista.includes(this.filtroEspecialista.nativeElement.value)
      )
    )
  );

  constructor(
    private firestoreService: FirebaseService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    await this.cargarTurnos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  async cargarTurnos() {
    if (this.pacienteId !== '') {
      let turnos = await this.firestoreService.obtenerTurnosDelUsuario(
        this.pacienteId,'paciente'
      );
      let especialidades = await this.firestoreService.obtenerEspecialidades();

      for (let turno of turnos) {
        let especialidad = especialidades.find(
          (especialidad) => especialidad.id === turno.idEspecialidad
        );
        turno.Especialidad = especialidad.nombre;
        turno.idEspecialidad = especialidad.id;

        let especialista = await this.firestoreService.getUserByUidAndType(
          turno.idEspecialista,
          'especialistas'
        );

        turno.Especialista = especialista.nombre + ' ' + especialista.apellido;
        turno.idEspecialista = especialista.id;
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

  async cancelarTurno(){

  }

  verResena(){

  }

  completarEncuesta(){

  }

  calificarAtencion(){

  }

}
