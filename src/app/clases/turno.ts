import { HistoriaClinica } from './historia-clinica';

export class Turno {
  uid: string;
  idEspecialista: string;
  Especialista: string;
  idEspecialidad: string;
  Especialidad: string;
  idPaciente: string;
  Paciente: string;
  estado: string;
  fecha: string;
  hora: string;
  resena: string;
  comentario: string;
  atencion: string;
  encuesta: string;
  historiaClinica: HistoriaClinica | null;
  constructor(
    uid: string,
    idEspecialista: string,
    idEspecialidad: string,
    idPaciente: string,
    estado: string,
    fecha: string,
    hora: string
  ) {
    this.uid = uid;
    this.idEspecialista = idEspecialista;
    this.idEspecialidad = idEspecialidad;
    this.idPaciente = idPaciente;
    this.estado = estado;
    this.fecha = fecha;
    this.hora = hora;
    this.Especialidad = '';
    this.Especialista = '';
    this.Paciente = '';
    this.resena = '';
    this.comentario = '';
    this.atencion = '';
    this.encuesta = '';
    this.historiaClinica = null;
  }
}
