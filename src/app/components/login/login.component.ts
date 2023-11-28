import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/servicios/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { slideInAnimation2 } from 'src/app/animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [slideInAnimation2],
})
export class LoginComponent {
  form!: FormGroup;
  checkError: boolean = false;
  errorMessage: string = '';
  admins: any[] = [];
  pacientes: any[] = [];
  especialistas: any[] = [];
  loadingImages: boolean = false;

  constructor(
    private authService: FirebaseService,
    private router: Router,
    private userservice: UserService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.spinner.show();
    await this.CargarAccesos();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  async guardarLogueos(id: any) {
    const now = new Date();
    const dia = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const log = {
      dia: dia,
      hora: hora,
      usuario: id,
    };
    await this.authService.guardarLog(log);
  }

  async verificarMails(user: any) {
    try {
      const admin = await this.authService.getUserByUidAndType(
        user.user.uid,
        'admins'
      );
      const especialista = await this.authService.getUserByUidAndType(
        user.user.uid,
        'especialistas'
      );
      if (admin !== null) {
        await this.guardarLogueos(user.user.email);
        this.userservice.showSuccessMessageAndNavigate([
          '/homeAdmin/admin/presentacion',
        ]);
        return;
      }
      if (especialista !== null) {
        if (especialista.verificado === 'true' && user.user.emailVerified) {
          await this.guardarLogueos(user.user.email);
          this.userservice.showSuccessMessageAndNavigate([
            '/home/presentacion',
          ]);
          return;
        }
        if (especialista.verificado === 'null') {
          this.userservice.showRejectedMessage();
        } else if (especialista.verificado === 'false') {
          await this.authService.logout();
          this.userservice.showNotApprovedMessage();
        } else {
          this.userservice.showVerifyEmailMessage();
        }
      } else if (user.user.emailVerified) {
        await this.guardarLogueos(user.user.email);
        this.userservice.showSuccessMessageAndNavigate(['/home/presentacion']);
      } else {
        await this.authService.logout();
        this.userservice.showVerifyEmailMessage();
      }
    } catch (error: any) {
      this.userservice.showErrorMessage(error.text);
    }
  }
  onButtonClick(event: any): void {
    this.form.controls['email'].setValue(event.email);
    this.form.controls['password'].setValue(event.password);
  }
  async CargarAccesos() {
    let adminSnapshot = await this.authService.getWhere(
      'users',
      'tipo',
      'admins'
    );
    this.admins = adminSnapshot.docs.map((doc) => doc.data());
    let pacientesSnapshot = await this.authService.getWhere(
      'users',
      'tipo',
      'pacientes'
    );
    this.pacientes = pacientesSnapshot.docs.map((doc) => doc.data());
    let especialistasSnapshot = await this.authService.getWhere(
      'users',
      'tipo',
      'especialistas'
    );
    this.especialistas = especialistasSnapshot.docs.map((doc) => doc.data());
  }
  async onSubmit() {
    if (this.form.valid) {
      try {
        let user = await this.authService.login(this.form.value);
        localStorage.setItem('logueado', user.user.uid);
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
