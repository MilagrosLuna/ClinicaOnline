import { Component } from '@angular/core';
import { Especialista } from 'src/app/clases/especialista';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-administrar-especialistas',
  templateUrl: './administrar-especialistas.component.html',
  styleUrls: ['./administrar-especialistas.component.css']
})
export class AdministrarEspecialistasComponent {
  especialistas: Especialista[] = [];

  constructor(private authService: FirebaseService) { }

  ngOnInit(): void {
    this.cargarEspecialistas();
  }

  async cargarEspecialistas() {
    const especialistasData = await this.authService.obtenerEspecialistas();
    this.especialistas = especialistasData.map((especialistaData: any) => {
      return new Especialista(
        especialistaData.uid,
        especialistaData.nombre,
        especialistaData.apellido,
        especialistaData.edad,
        especialistaData.dni,
        especialistaData.especialidad,
        especialistaData.foto1,
        especialistaData.verificado
      );
    });
  }

  aceptarEspecialista(especialista: Especialista) {
    // Agregar lógica para aceptar al especialista
    // Puedes enviar una solicitud al servidor o realizar alguna acción específica aquí.
  }

  rechazarEspecialista(especialista: Especialista) {
    // Agregar lógica para rechazar al especialista
    // Puedes enviar una solicitud al servidor o realizar alguna acción específica aquí.
  }
}
