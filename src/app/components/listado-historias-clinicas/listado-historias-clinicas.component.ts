import { Component } from '@angular/core';
import { HistoriaClinica } from 'src/app/clases/historia-clinica';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Turno } from 'src/app/clases/turno';

@Component({
  selector: 'app-listado-historias-clinicas',
  templateUrl: './listado-historias-clinicas.component.html',
  styleUrls: ['./listado-historias-clinicas.component.css'],
})
export class ListadoHistoriasClinicasComponent {
  identidad: string | null = '';
  usuario: any = null;
  historiasClinicas: Turno[] = [];
  historiasClinicasPorPaciente: Turno[] = [];
  turno: Turno | null = null;
  historiaVer: boolean = false;
  mostrar: boolean = false;
  historiapruebaPdf: HistoriaClinica = new HistoriaClinica();
  constructor(
    private authService: FirebaseService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    await this.user();
    this.identidad = localStorage.getItem('identidad');
    await this.obtenerHistorias();
    console.log(this.historiasClinicas);
  }

  mostrarHistoria(turno: Turno) {
    this.historiaVer = true;
    this.turno = turno;
  }

  convertImageToBase64(imagen: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(imagen, { responseType: 'blob' }).subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data as string);
        };
        reader.onerror = () => {
          reject('Error al leer la imagen');
        };
        reader.readAsDataURL(blob);
      }, reject);
    });
  }
  descargarHistoriaClinica(historiaClinica: HistoriaClinica | null) {
    if (historiaClinica !== null) {
      // Crear una copia de historiaClinica para no modificar el objeto original
      let historiaClinicaCopia: Partial<HistoriaClinica> = {
        ...historiaClinica,
      };

      // Eliminar los campos que no quieres incluir

      // Desglosar el objeto datosDinamicos en propiedades individuales
      let datosDinamicosDesglosados: { [clave: string]: any } = {};
      for (let clave in historiaClinica.datosDinamicos) {
        datosDinamicosDesglosados[clave] =
          historiaClinica.datosDinamicos[clave];
      }

      // Combinar historiaClinicaCopia y datosDinamicosDesglosados
      let historiaClinicaFinal: HistoriaClinica = {
        ...historiaClinicaCopia,
        ...datosDinamicosDesglosados,
      } as HistoriaClinica;

      // Convertir el objeto modificado en un array que contiene un solo objeto
      const historiaClinicaArray = [historiaClinicaFinal];

      const worksheet = XLSX.utils.json_to_sheet(historiaClinicaArray);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      saveAs(
        new Blob([excelBuffer]),
        `${historiaClinica.Paciente}_historia_clinica.xlsx`
      );
    }
  }
  async createPDF(historiapruebaPdf: HistoriaClinica | null) {
    if (historiapruebaPdf !== null) {
      let imagen = await this.convertImageToBase64('../assets/logoClinica.png');
      let now = new Date();
      let fechaEmision = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()} a las ${now.getHours()}:${now.getMinutes()} hs`;
      const pdfDefinition: any = {
        watermark: {
          text: 'Clinica online Milagros Luna',
          color: 'blue',
          opacity: 0.1,
          bold: true,
          italics: false,
        },
        content: [
          {
            image: imagen,
            width: 300,
            alignment: 'center',
          },
          {
            text: 'Historia Clínica',
            fontSize: 30,
            color: 'blue',
            bold: true,
            margin: [0, 20, 0, 20],
          },
          { text: `Fecha de emisión: ${fechaEmision}`, fontSize: 20 },
          {
            text: `Especialista: ${historiapruebaPdf.Especialista}`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Paciente: ${historiapruebaPdf.Paciente}`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Altura: ${historiapruebaPdf.altura} cm`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Peso: ${historiapruebaPdf.peso} kg`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Presión: ${historiapruebaPdf.presion}`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          {
            text: `Temperatura: ${historiapruebaPdf.temperatura} °C`,
            fontSize: 20,
            margin: [0, 10, 0, 0],
          },
          ...Object.entries(historiapruebaPdf.datosDinamicos).map(
            ([key, value]) => ({
              text: `${key}: ${value}`,
              fontSize: 20,
              margin: [0, 10, 0, 0],
            })
          ),
        ],
      };
      const pdf = pdfMake.createPdf(pdfDefinition);
      pdf.download('HistoriaClinica');
    }
  }

  async obtenerHistorias() {
    let historiasClinicasA: Turno[] = [];
    let pacientes = await this.authService.getAllPacientes();
    let especialidades = await this.authService.obtenerEspecialidades();
    let especialistas = await this.authService.obtenerEspecialistas();
    switch (this.identidad) {
      case 'paciente':
        historiasClinicasA = await this.authService.obtenerTurnosDelUsuario(
          this.usuario.uid,
          'paciente'
        );
        break;
      case 'especialista':
        historiasClinicasA = await this.authService.obtenerTurnosDelUsuario(
          this.usuario.uid,
          'especialista'
        );
        break;
      case 'admin':
        historiasClinicasA = await this.authService.obtenerTodosLosTurnos();
        break;
    }
    const nombresMostrados: string[] = [];
    for (const historia of historiasClinicasA) {
      const pacienteEncontrado = pacientes.find(
        (p) => p.uid === historia.idPaciente
      );

      if (pacienteEncontrado) {
        const nombrePaciente = pacienteEncontrado.nombre;
        const fotoPaciente = pacienteEncontrado.foto1;

        if (!nombresMostrados.includes(nombrePaciente)) {
          historia.Paciente = nombrePaciente;
          historia.fotoPaciente = fotoPaciente;
          nombresMostrados.push(nombrePaciente);
        } else {
          historia.Paciente = 'Repetido';
        }
      } else {
        historia.Paciente = 'Desconocido';
      }
      historia.Especialista =
        especialistas.find((e) => e.uid === historia.idEspecialista)?.nombre ||
        'Desconocido';
      historia.Especialidad =
        especialidades.find((e) => e.id === historia.idEspecialidad)?.nombre ||
        'Desconocido';
    }

    this.historiasClinicas = historiasClinicasA.filter(
      (historia) => historia.historiaClinica !== null
    );
  }

  mostrarHistoriasClinicasDePaciente(idPaciente: string) {
    this.historiasClinicasPorPaciente = this.historiasClinicas.filter(
      (historia) => historia.idPaciente === idPaciente
    );
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
