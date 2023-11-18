import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-access-button',
  templateUrl: './access-button.component.html',
  styleUrls: ['./access-button.component.css'],
})
export class AccessButtonComponent implements OnInit {
  @Input() email: string = '';
  @Input() tipo: string = ''; 
  @Output() buttonClick: EventEmitter<{ email: string; password: string }> =
    new EventEmitter<{ email: string; password: string }>();
  foto: any;
  nombre: any;
  constructor(private authService: FirebaseService) {}
  async ngOnInit(): Promise<void> {
    await this.cargar();
  }
  onButtonClick(): void {
    this.buttonClick.emit({ email: this.email, password: '123456' });
  }

  async cargar() {
    let email = this.email;
    let password = '123456';
    let usuario = await this.authService.login({ email, password });
    let usuarioBD = await this.authService.getUserByUidAndType(
      usuario.user.uid,
      this.tipo
    );
    this.foto = usuarioBD?.foto1;
    this.nombre = usuarioBD?.nombre + ' - ' + this.tipo;

    await this.authService.logout();
  }
}
