import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Encuesta } from 'src/app/clases/encuesta';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
})
export class EncuestaComponent {
  form!: FormGroup;
  checkError: boolean = false;
  errorMessage: string = '';
  @Output() encuestaEnviada = new EventEmitter<string>();
  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      puntajeClinica: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      comentarioClinica: new FormControl('', [Validators.required]),
      puntajeEspecialista: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ]),
      comentarioEspecialista: new FormControl('', [Validators.required]),
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      try {
        let encuesta = new Encuesta(
          this.form.controls['puntajeClinica'].value,
          this.form.controls['comentarioClinica'].value,
          this.form.controls['puntajeEspecialista'].value,
          this.form.controls['comentarioEspecialista'].value
        );
        console.log(encuesta);
        let id = await this.authService.guardarEncuesta(encuesta);
        if(id){
          this.encuestaEnviada.emit(id);
        }
        Swal.fire({
          icon: 'success',
          text: 'se cargo su encuesta!',
          title: '¡Encuesta enviada!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.form.reset();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error al enviar encuesta',
          text: 'hubo un problema al enviar la encuesta',
          timer: 4000,
        });
      }
    }
  }
}
