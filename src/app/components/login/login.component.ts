import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/servicios/user.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;
  checkError: boolean = false;
  errorMessage: string = '';
  fotoAdmin: string | undefined = '';
  foto1: string | undefined = '';
  foto2: string | undefined = '';
  foto3: string | undefined = '';
  fotoE1: string | undefined = '';
  fotoE2: string | undefined = '';
  loadingImages: boolean = false;

  constructor(
    private authService: FirebaseService,
    private router: Router,
    private userservice: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.loadingImages = true;
    await this.cargarFotos(1);
    await this.cargarFotos(2);
    await this.cargarFotos(3);
    await this.cargarFotos(4);
    await this.cargarFotos(5);
    await this.cargarFotos(6);
    this.loadingImages = false;
  }

  async verificarMails(user: any) {
    try {
      const admin = await this.authService.getAdminByUid(user.user.uid);
      const especialista = await this.authService.getEspecialistasByUid(
        user.user.uid
      );

      if (admin !== null) {
        this.userservice.showSuccessMessageAndNavigate(['/homeAdmin']);
        return;
      }

      if (especialista !== null) {
        if (especialista.verificado === 'true' && user.user.emailVerified) {
          this.userservice.showSuccessMessageAndNavigate(['/home']);
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
        this.userservice.showSuccessMessageAndNavigate(['/home']);
      } else {
        await this.authService.logout();
        this.userservice.showVerifyEmailMessage();
      }
    } catch (error: any) {
      this.userservice.showErrorMessage(error.text);
    }
  }
  async cargarFotos(number: Number) {
    let email = 'milivictoria2004@gmail.com';
    let password = '123456';
    switch (number) {
      case 1:
        email = 'milivictoria2004@gmail.com';
        password = '123456';
        let user = await this.authService.login({ email, password });
        let admidBd = await this.authService.getAdminByUid(user.user.uid);       
        this.fotoAdmin = admidBd?.foto1;
        await this.authService.logout();
        break;
      //pac
      case 2:
        email = 'mililuna3197@gmail.com';
        password = '123456';
        let paceinte1 = await this.authService.login({ email, password });
        let paceinte1bd = await this.authService.getPacientesByUid(
          paceinte1.user.uid
        );       
        this.foto1 = paceinte1bd?.foto1;
        await this.authService.logout();
        break;
      case 3:
        email = 'nammiroppocre-8711@yopmail.com';
        password = '123456';
        let paceinte2 = await this.authService.login({ email, password });
        let paceinte2bd = await this.authService.getPacientesByUid(
          paceinte2.user.uid
        );      
        this.foto2 = paceinte2bd?.foto1;
        await this.authService.logout();
        break;
      case 4:
        email = 'prefreufrissigoi-3375@yopmail.com';
        password = '123456';
        let paceinte3 = await this.authService.login({ email, password });
        let paceinte3bd = await this.authService.getPacientesByUid(
          paceinte3.user.uid
        );      
        this.foto3 = paceinte3bd?.foto1;
        await this.authService.logout();
        break;
      //esp
      case 5:
        email = 'xiffoddoxetro-1126@yopmail.com';
        password = '123456';
        let esp1 = await this.authService.login({ email, password });
        let esp1bd = await this.authService.getEspecialistasByUid(
          esp1.user.uid
        );      
        this.fotoE1 = esp1bd?.foto1;
        await this.authService.logout();
        break;
      case 6:
        email = 'hocrelouhiru-9335@yopmail.com';
        password = '123456';
        let esp2 = await this.authService.login({ email, password });
        let esp2bd = await this.authService.getEspecialistasByUid(
          esp2.user.uid
        );      
        this.fotoE2 = esp2bd?.foto1;
        await this.authService.logout();
        break;
    }
  }
  async accesoRapido(number: number) {
    switch (number) {
      case 1:
        this.form.controls['email'].setValue('milivictoria2004@gmail.com');
        this.form.controls['password'].setValue('123456');
        await this.authService.login(this.form.value);
        break;
      //pac
      case 2:
        this.form.controls['email'].setValue('mililuna3197@gmail.com');
        this.form.controls['password'].setValue('123456');
        await this.authService.login(this.form.value);
        break;

      case 3:
        this.form.controls['email'].setValue('nammiroppocre-8711@yopmail.com');
        this.form.controls['password'].setValue('123456');
        await this.authService.login(this.form.value);
        break;

      case 4:
        this.form.controls['email'].setValue(
          'prefreufrissigoi-3375@yopmail.com'
        );
        this.form.controls['password'].setValue('123456');
        await this.authService.login(this.form.value);
        break;
      //esp
      case 5:
        this.form.controls['email'].setValue('xiffoddoxetro-1126@yopmail.com');
        this.form.controls['password'].setValue('123456');
        break;
      case 6:
        this.form.controls['email'].setValue('hocrelouhiru-9335@yopmail.com');
        this.form.controls['password'].setValue('123456');
        break;
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
