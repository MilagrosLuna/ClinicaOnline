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
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css'],
})
export class MisTurnosComponent {
  user: any;
  id: string = '';
  esPaciente: boolean = false;

  constructor(private authService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    let id = localStorage.getItem('logueado');
    this.esPaciente = localStorage.getItem('esPaciente') === 'true';
    if (id) {
      this.id = id;
      let pac = await this.authService.getUserByUidAndType(id, 'pacientes');
      if (pac != null) {
        this.esPaciente = true;
        localStorage.setItem('esPaciente', 'true');
      }
    }
  }
}
