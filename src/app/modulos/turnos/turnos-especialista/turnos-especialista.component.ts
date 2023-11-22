import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from 'src/app/clases/turno';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-especialista',
  templateUrl: './turnos-especialista.component.html',
  styleUrls: ['./turnos-especialista.component.css'],
})
export class TurnosEspecialistaComponent {
  turnos: any[] = [];
  turnoA: Turno | null = null;
  comentario: boolean = false;
  rechazo: boolean = false;
  resena: boolean = false;
  finalizar: boolean = false;
  motivoCancelacion: string = '';
  turnoFinalizado: string = '';
  datoResena: string = '';
  datoComentario: string = '';
  @Input() especialistaId: string = '';

  @ViewChild('filtro') filtro!: ElementRef;

  private _turnos = new BehaviorSubject<any[]>([]);
  turnosFiltrados = this._turnos
  .asObservable()
  .pipe(
    map((turnos) => {
      if (this.filtro && this.filtro.nativeElement) {
        const filtro = this.filtro.nativeElement.value.toLowerCase();
        return turnos.filter((turno) =>
          Object.values(turno).some((val: any) =>
            val.toString().toLowerCase().includes(filtro)
          )
        );
      } else {
        return turnos;
      }
    })
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
        this.especialistaId,
        'especialista'
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
        turno.idPaciente = Paciente.uid;
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

  async cancelarTurno() {
    if (this.turnoA && this.motivoCancelacion !='') {
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

  cargarComentario(turno: Turno, numero: number) {
    this.motivoCancelacion = '';
    if (numero == 1) {
      this.rechazo = true;
    } else {
      this.rechazo = false;
    }
    this.turnoA = null;
    this.comentario = true;
    this.turnoA = turno;
  }

  cargarResena(turno:Turno){
    this.turnoA = null;
    this.turnoA = turno;
    this.finalizar = true;
  }

  verResena(turno: Turno) {
    this.turnoA = null;
    this.comentario = false;
    console.log(turno);
    this.turnoA = turno;
    this.resena = true;
    this.datoResena = turno.resena;
    this.datoComentario = turno.comentario;

    console.log(this.turnoA);
  }
  ocultarResena() {
    this.resena = false;
  }
  async rechazarTurno() {
    if (this.turnoA && this.motivoCancelacion !='') {
      console.log(this.motivoCancelacion);
      this.turnoA.estado = 'rechazado';
      this.turnoA.comentario = this.motivoCancelacion;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Turno rechazado',
          text: 'el turno ha sido rechazado..',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'el turno no ha sido rechazado..',
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
        text: 'el turno no ha sido rechazado..',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.comentario = false;
    }
  }
  async aceptarTurno(turno: Turno) {
    turno.estado = 'aceptado';
    try {
      console.log(turno);
      await this.firestoreService.modificarTurno(turno);
      Swal.fire({
        icon: 'success',
        title: 'Turno aceptado',
        text: 'el turno ha sido aceptado..',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'el turno no ha sido aceptado..',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  async finalizarTurno() {
    if (this.turnoA && this.turnoFinalizado !='') {
      console.log(this.turnoFinalizado);
      this.turnoA.estado = 'finalizado';
      this.turnoA.resena = this.turnoFinalizado;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Turno finalizado',
          text: 'el turno ha sido finalizado..',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'el turno no ha sido finalizado..',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.finalizar = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'el turno no ha sido finalizado..',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.finalizar = false;
    }
  }
}
