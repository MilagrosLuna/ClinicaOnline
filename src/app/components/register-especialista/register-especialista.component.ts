import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register-especialista',
  templateUrl: './register-especialista.component.html',
  styleUrls: ['./register-especialista.component.css'],
})
export class RegisterEspecialistaComponent {
  selectedImage: any = null;
  imagenURL: string = '';

  form!: FormGroup;
  checkError: boolean = false;
  errorMessage: string = '';

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      especialistaNombre: new FormControl('', [Validators.required]),
      especialistaApellido: new FormControl('', [Validators.required]),
      especialistaEdad: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(110),
      ]),
      especialistaDni: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(100000000),
      ]),
      especialistaEspecialidad: new FormControl('', [Validators.required]),
      especialistaEmail: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      especialistaClave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fotoespecialista: new FormControl(''),
      fotoespecialista2: new FormControl(''),
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;

        this.imagenURL = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
  resetImageInput() {
    const inputElement = document.getElementById(
      'fotoespecialista'
    ) as HTMLInputElement;
    inputElement.value = '';
  }
  onSubmit() {
    if (this.form.valid) {
      // this.especialistaGenerado.emit(especialista);
      //this.form.reset();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error, complete los datos correctamente',
        timer: 2500,
      });
    }
  }
}
