export class Admin {
  uid: number;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  foto1: string;
  constructor(
    uid: number,
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    foto1: string
  ) {
    this.uid = uid;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.foto1 = foto1;
  }
}
