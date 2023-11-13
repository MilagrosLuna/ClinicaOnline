import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/clases/admin';
import { Especialista } from 'src/app/clases/especialista';
import { Paciente } from 'src/app/clases/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css'],
})
export class MiPerfilComponent implements OnInit {
  identidad: string | null = '';
  usuario: any = null;

  constructor(private authService: FirebaseService) {}

  ngOnInit(): void {
    this.user();
    this.identidad = localStorage.getItem('identidad');
    console.log(localStorage.getItem('logueado'));
    console.log(this.usuario);
  }

  async user() {
    let user = localStorage.getItem('logueado');
    if (user) {
      console.log('27n obtuvo ususraio');
      const especialista = await this.authService.getEspecialistasByUid(user);
      if (especialista) {
        const especialidades = await this.authService.obtenerEspecialidades();
        this.identidad = 'especialista';
        this.usuario = {
          ...especialista,
          especialidades: especialista.especialidades.map((especialidadId: string) => {
            const especialidad = especialidades.find((esp: any) => esp.id === especialidadId);
            return especialidad ? especialidad.nombre : 'Especialidad Desconocida';
          }),
        };
        localStorage.setItem('identidad', 'especialista');
      } else {
        const paciente = await this.authService.getPacientesByUid(user);
        if (paciente) {
          this.identidad = 'paciente';
          this.usuario = paciente;
          localStorage.setItem('identidad', 'paciente');
        } else {
          const admin = await this.authService.getAdminByUid(user);
          this.identidad = 'admin';
          this.usuario = admin;
          localStorage.setItem('identidad', 'admin');
        }
      }
    }
  }
}
