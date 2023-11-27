import { Component } from '@angular/core';
import { slideInAnimation2 } from 'src/app/animation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [slideInAnimation2],
})
export class RegisterComponent {
  mostrarRegistroPacientes: boolean = false;
  mostrarRegistroEspecialistas: boolean = false;
  mostrarRegistroPaciente() {
    this.mostrarRegistroPacientes = true;
    this.mostrarRegistroEspecialistas = false;
  }
  mostrarRegistroEspecialista() {
    this.mostrarRegistroEspecialistas = true;
    this.mostrarRegistroPacientes = false;
  }
}
