import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from 'src/app/clases/turno';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admistrar-turnos',
  templateUrl: './admistrar-turnos.component.html',
  styleUrls: ['./admistrar-turnos.component.css'],
})
export class AdmistrarTurnosComponent {
  turnos: any[] = [];
  turnoA: Turno | null = null;
  comentario: boolean = false;

  motivoCancelacion: string = '';

  @ViewChild('filtroEspecialidad') filtroEspecialidad!: ElementRef;
  @ViewChild('filtroEspecialista') filtroEspecialista!: ElementRef;

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
            turno.Paciente.includes(this.filtroEspecialista.nativeElement.value)
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
    let turnos = await this.firestoreService.obtenerTodosLosTurnos();
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
      turno.idEspecialista = especialista.uid;

      let paciente = await this.firestoreService.getUserByUidAndType(
        turno.idPaciente,
        'pacientes'
      );

      turno.Paciente = paciente.nombre + ' ' + paciente.apellido;
      turno.idPaciente = paciente.uid;


    }
    this._turnos.next(turnos);
  }

  filtrarTurnos() {
    this._turnos.next(this._turnos.value);
  }

  obtenerFechaHoraFormateada(fecha: any, hora: string): string {
    const fechaFormateada = fecha.toDate().toLocaleDateString('es-AR');
    return `${fechaFormateada} ${hora}`;
  }

  async cancelarTurno() {
    if (this.turnoA && this.motivoCancelacion != '') {
      console.log(this.motivoCancelacion);
      this.turnoA.estado = 'cancelado';
      this.turnoA.comentario = this.motivoCancelacion;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Turno cancelado',
          text: 'el turno ha sido cancelado..',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'el turno no ha sido cancelado..',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.comentario = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'el turno no ha sido cancelado..',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.comentario = false;
    }
  }

  cargarComentario(turno: Turno) {
    this.motivoCancelacion = '';
    this.comentario = true;
    this.turnoA = turno;
  }
}
