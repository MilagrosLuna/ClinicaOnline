import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/clases/especialidad';
import { Especialista } from 'src/app/clases/especialista';
import { Paciente } from 'src/app/clases/paciente';
import { Turno } from 'src/app/clases/turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css'],
})
export class SolicitarTurnoComponent {
  selectedImage: any = null;
  imagenURL: string = '';
  user: any;
  form!: FormGroup;
  errorCheck: boolean = false;
  Message: string = '';
  especialidades: Especialidad[] = [];
  especialistas: Especialista[] = [];
  especialistasFiltrados: Especialista[] = [];
  pacientes: Paciente[] = [];
  especialidadSeleccionada: string = '';
  esAdmin: boolean = false;
  fechaObtenida: boolean = false;
  especialista: string | undefined = undefined;

  constructor(private authService: FirebaseService, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      especialista: new FormControl('', [Validators.required]),
      paciente: new FormControl('', [Validators.required]),
      hora: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
    });
    this.cargarEspecialidades();
    let id = localStorage.getItem('logueado');
    this.esAdmin = localStorage.getItem('admin') === 'true';
    if (id) {
      let admin = this.authService.getAdminByUid(id);
      if (admin != null) {
        this.esAdmin = true;
        this.cargarPacientes();
        localStorage.setItem('admin', 'true');
      }
    }
  }
  onEspecialidadChange(event: any) {
    this.especialidadSeleccionada = this.form.controls['especialidad'].value;
    this.filtrarEspecialistas();
    this.especialista = undefined;
    this.fechaObtenida = false;
  }
  onEspecialistaChange(event: any) {   
    console.log("sdafasfa"); 
    this.especialista = undefined;
    this.especialista = this.form.controls['especialista'].value;
    this.fechaObtenida = false;    
     this.cdr.detectChanges();
  }
  async cargarPacientes() {
    this.pacientes = await this.authService.getAllPacientes();
  }
  async cargarEspecialidades() {
    const especialidadesData = await this.authService.obtenerEspecialidades();
    this.especialidades = especialidadesData.map((especialidadData: any) => {
      const especialidad = new Especialidad(
        especialidadData.id,
        especialidadData.nombre
      );
      return especialidad;
    });

    this.cargarEspecialistas();
  }
  async cargarEspecialistas() {
    const especialistasData = await this.authService.obtenerEspecialistas();
    const especialidades = this.especialidades;

    this.especialistas = especialistasData.map((especialistaData: any) => {
      const especialidadesDelEspecialista = Array.isArray(
        especialistaData.especialidades
      )
        ? especialistaData.especialidades.map((especialidadId: string) => {
            const especialidad = especialidades.find(
              (esp: any) => esp.uid === especialidadId
            );
            return especialidad ? especialidad.uid : 'Especialidad Desconocida';
          })
        : [];
        let esp = new Especialista(
          especialistaData.uid,
          especialistaData.nombre,
          especialistaData.apellido,
          especialistaData.edad,
          especialistaData.dni,
          especialidadesDelEspecialista,
          especialistaData.foto1,
          especialistaData.verificado
        );
        esp.turnos = especialistaData.turnos
      return esp;
    });
  }
  filtrarEspecialistas() {
    this.especialistasFiltrados = this.especialistas.filter(
      (especialista: any) =>
        especialista.especialidades.includes(this.especialidadSeleccionada)
    );
  }
  onTurnoSeleccionado(turno: { dia: Date; hora: string }) {
    const fechaSeleccionada: Date = turno.dia;
    const horaSeleccionada: string = turno.hora;
    const fechaCompleta: Date = new Date(
      fechaSeleccionada.getFullYear(),
      fechaSeleccionada.getMonth(),
      fechaSeleccionada.getDate(),
      parseInt(horaSeleccionada.split(':')[0]),
      parseInt(horaSeleccionada.split(':')[1])
    );
    this.form.controls['fecha'].setValue(fechaCompleta);
    this.form.controls['hora'].setValue(horaSeleccionada);
    this.fechaObtenida = true;
  }

  onSubmit() {
    if (this.form.valid) {
      this.cargarTurno();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error, complete los datos correctamente',
        timer: 2500,
      });
    }
  }

  async cargarTurno() {
    try {
      let turno = new Turno(
        '',
        this.form.controls['especialista'].value,
        this.form.controls['especialidad'].value,
        this.form.controls['paciente'].value,
        'espera',
        this.form.controls['fecha'].value,
        this.form.controls['hora'].value
      );
      await this.authService.guardarTurno(turno);
      Swal.fire({
        icon: 'success',
        text: 'debera esperar que el especialista acepte!',
        title: '¡Turno solicitado!',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error al solicitar turno',
        text: this.Message,
        timer: 4000,
      });
    }
  }
}
