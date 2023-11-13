import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/clases/especialidad';
import { Especialista } from 'src/app/clases/especialista';
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
  especialidadSeleccionada: string = '';

  especialista: Especialista|undefined = undefined;

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      especialista: new FormControl('', [Validators.required]),
      fecha: new FormControl('', [Validators.required]),
    });
    this.cargarEspecialidades();
  }
  onEspecialidadChange(event: any) {
    this.especialidadSeleccionada = this.form.controls['especialidad'].value;
    this.filtrarEspecialistas();
    this.especialista = undefined;
  }
  
  onEspecialistaChange(event: any) {
    this.especialista = this.form.controls['especialista'].value;
  }

  onTurnoSeleccionado(turno: { dia: Date; hora: string }) {
    console.log('Turno seleccionado:', turno);
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

      return new Especialista(
        especialistaData.uid,
        especialistaData.nombre,
        especialistaData.apellido,
        especialistaData.edad,
        especialistaData.dni,
        especialidadesDelEspecialista,
        especialistaData.foto1,
        especialistaData.verificado
      );
    });
    console.log(this.especialistas);
  }
  filtrarEspecialistas() {
    this.especialistasFiltrados = this.especialistas.filter(
      (especialista: any) =>
        especialista.especialidades.includes(this.especialidadSeleccionada)
    );
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
      // let turno = new Turno(
      //   '',
      //   this.form.controls['especialista'].value,
      //   this.form.controls['especialidad'].value,
      //   this.form.controls['paciente'].value,
      //   'espera',
      //  'fecha'
      // );

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
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
