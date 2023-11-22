import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Turno } from 'src/app/clases/turno';
import Swal from 'sweetalert2';
import { Encuesta } from 'src/app/clases/encuesta';

@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css'],
})
export class TurnosPacienteComponent {
  turnos: any[] = []; 
  turnoA: Turno | null = null;
  comentario: boolean = false;
  resena: boolean = false;
  calificar: boolean = false;
  encuesta: boolean = false;
  motivoCancelacion: string = '';
  turnoCalificado: string = '';
  datoResena: string = '';
  datoComentario: string = '';
  @Input() pacienteId: string = '';

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
    await this.cargarTurnos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  async cargarTurnos() {
    if (this.pacienteId !== '') {
      let turnos = await this.firestoreService.obtenerTurnosDelUsuario(
        this.pacienteId,
        'paciente'
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

        turno.Especialista = especialista.nombre;
        turno.idEspecialista = especialista.uid;
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

  cargarAtencion(turno: Turno) {
    this.turnoCalificado = '';
    this.calificar = true;
    this.turnoA = turno;
  }

  verResena(turno: Turno) {
    this.turnoA = null;
    this.comentario = false;
    this.turnoA = turno;
    this.resena = true;
    this.datoResena = turno.resena;
    this.datoComentario = turno.comentario;
  }
  ocultarResena() {
    this.resena = false;
  }

  async manejarEncuestaEnviada(id: string) {
    console.log('Encuesta enviada:', id);
    if (this.turnoA) {
      this.turnoA.encuesta = id;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Encuesta enviada',
          text: 'Encuesta enviada..',
          showConfirmButton: false,
          timer: 1500,
        });
        this.encuesta = false;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'no se pudo enviar la encuesta..',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  }

  completarEncuesta(turno: Turno) {
    this.encuesta = true;
    this.turnoA = turno;
  }

  async calificarAtencion() {
    if (this.turnoA && this.turnoCalificado != '') {
      console.log(this.turnoCalificado);
      this.turnoA.atencion = this.turnoCalificado;
      try {
        console.log(this.turnoA);
        await this.firestoreService.modificarTurno(this.turnoA);
        Swal.fire({
          icon: 'success',
          title: 'Calificacion guardada',
          text: 'Calificacion guardada..',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Hubo un problema',
          text: 'no se puedo calificar..',
          showConfirmButton: false,
          timer: 1500,
        });
      }
      this.turnoA = null;
      this.calificar = false;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: 'La atencion no se califico..',
        showConfirmButton: false,
        timer: 1500,
      });
      this.turnoA = null;
      this.calificar = false;
    }
  }
}
