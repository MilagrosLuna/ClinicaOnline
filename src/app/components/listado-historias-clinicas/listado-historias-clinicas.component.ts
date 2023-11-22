import { Component } from '@angular/core';
import { HistoriaClinica } from 'src/app/clases/historia-clinica';
import { Horario } from 'src/app/clases/horario';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-listado-historias-clinicas',
  templateUrl: './listado-historias-clinicas.component.html',
  styleUrls: ['./listado-historias-clinicas.component.css'],
})
export class ListadoHistoriasClinicasComponent {
  identidad: string | null = '';
  usuario: any = null;
  historiasClinicas: HistoriaClinica[] = [];

  constructor(private authService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    await this.user();
    this.identidad = localStorage.getItem('identidad');
    await this.obtenerHistorias();
  }

  async obtenerHistorias() {
    let historias = await this.authService.obtenerTodasHistoriaClinica();
   
    switch (this.identidad) {
      case 'paciente':
        this.historiasClinicas = historias.filter(historia => historia.idPaciente === this.usuario.uid);
        break;
      case 'especialista':
        this.historiasClinicas = historias.filter(historia => historia.idEspecialista === this.usuario.uid);
        break;
      case 'admin':
        this.historiasClinicas = historias;
        break;
    }
  }

  async user() {
    let user = localStorage.getItem('logueado');
    if (user) {
      const especialista = await this.authService.getUserByUidAndType(
        user,
        'especialistas'
      );
      if (especialista) {
        this.identidad = 'especialista';
        this.usuario = especialista;
        localStorage.setItem('identidad', 'especialista');
      } else {
        const paciente = await this.authService.getUserByUidAndType(
          user,
          'pacientes'
        );
        if (paciente) {
          this.identidad = 'paciente';
          this.usuario = paciente;
          localStorage.setItem('identidad', 'paciente');
        } else {
          const admin = await this.authService.getUserByUidAndType(
            user,
            'admins'
          );
          this.identidad = 'admin';
          this.usuario = admin;
          localStorage.setItem('identidad', 'admin');
        }
      }
    }
  }
}
