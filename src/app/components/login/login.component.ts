import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  checkError: boolean = false;
  errorMessage: string = '';

  constructor(private authService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async verificarMails(user: any) {
    try {
      const admin = await this.authService.getAdminByUid(user.user.uid);

      if (admin !== null) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/home']);
      } else {
        const especialista = await this.authService.getEspecialistasByUid(
          user.user.uid
        );
        if (especialista != null) {
          if (especialista.verificado) {
            if (user.user.emailVerified) {
              Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: '¡Bienvenido!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.router.navigate(['/home']);
            }
          }
          Swal.fire({
            icon: 'warning',
            title: 'Su cuenta aun no fue aprobada',
            text: 'Por favor, espere que la aprueben.',
            timer: 4000,
          });
        } else {
          if (user.user.emailVerified) {
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: '¡Bienvenido!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/home']);
          } else {
            await this.authService.logout();
            Swal.fire({
              icon: 'warning',
              title: 'Verifique su email',
              text: 'Por favor, verifique su correo electrónico para continuar.',
              timer: 4000,
            });
          }
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Hubo un problema',
        text: error.text,
        timer: 4000,
      });
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        let user = await this.authService.login(this.form.value);
        await this.verificarMails(user);
      } catch (error: any) {
        this.checkError = true;
        switch (error.code) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/internal-error':
          case 'auth/too-many-requests':
          case 'auth/invalid-login-credentials':
            this.errorMessage = `Credenciales inválidas`;
            break;
          default:
            this.errorMessage = error.message;
            break;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: this.errorMessage,
          timer: 4000,
        });
      }
    }
  }
}
