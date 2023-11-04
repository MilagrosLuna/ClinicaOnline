export class Especialista {
  uid: number;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  especialidad: string;
  foto1: string;
  constructor(
    uid: number,
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    especialidad: string,
    foto1: string
  ) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.especialidad = especialidad;
    this.foto1 = foto1;
  }
}
