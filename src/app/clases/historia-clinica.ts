export class HistoriaClinica {
  altura: number;
  peso: number;
  temperatura: number;
  presion: string;
  idPaciente: string;
  Paciente: string;
  Especialista: string;
  idEspecialista: string;
  datosDinamicos: { [clave: string]: any };

  constructor() {
    this.altura = 0;
    this.peso = 0;
    this.temperatura = 0;
    this.presion = '';
    this.idPaciente = '';
    this.idEspecialista = '';
    this.Paciente = '';
    this.Especialista = '';
    this.datosDinamicos = {};
  }
}
