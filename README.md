# Clinica Online

Proyecto elaborado para la materia laboratorio 4 en la UTN.
Utilización de Angular y Firebase

Puedes probar el funcionamiento del sistema en: https://clinicaonline-5cc5c.web.app/
## Authors

- [@MilagrosLuna](https://github.com/MilagrosLuna)

![Logo](src/assets/logoClinica.png)


## Primeros pasos en la clinica

Cuando ingresas a la pagina te encontras en la bienvenida, donde si eres un nuevo usuario puedes dirigirte al registro o de lo contrario a iniciar sesión

![Logo](readme/bienvenida.png)

## Registro

Aca podes elegir si queres registrar un paciente o especialista

![Registro](readme/registro.png)

## Paciente - Registro

Se piden los datos necesarios para integrar un paciente al sistema, este debe agregar 2 fotos

![Paciente-registro](readme/pacienteR.png)

## Especialista - Registro

Se piden los datos necesarios para integrar un especialista al sistema, este debe agregar una foto y seleccionar sus especialidades

![Especialista-registro](readme/especialistaR.png)

## Inicio sesión

Aca se ingresa el mail y contraseña, ademas contas con accesos rapidos.

![Inicio sesión](readme/accesoRapido.png)

## Mi perfil

Se ven los datos del usuario conectado.
En el caso del paciente se puede acceder a la historia clinica y en el caso de los especialistas a sus horarios.

![Mi perfil](readme/miperfil.png)

## Historia Clinica

Se ven las historias clinicas del paciente permitiendo descargar la informacion en formato pdf.
En el caso del adminsitrador podra descargar las historias clinicas en formato xlsx (excel).

![Historia Clinica](readme/HistoriaClinica.pdf)
![Historia Clinica](readme/historiaclinica.png)

## Solicitar turno

A pedido de la consigna para solicitar turno se muestran las especialidades representadas en imagenes sin el nombre, una vez elegida se ven los especialistas que te pueden atender con foto y nombre y finalmente se muestran los horarios disponibles de hoy a 15 dias, de lunes a viernes de 8 a 19 hs y los sabados de 8 a 14 hs.
En el caso del administrador se agrega el campo que muestra los pacientes para que este pueda elegir para quien es el turno.

![Solicitar turno](readme/solicitar.png)
![Solicitar turno](readme/solicitar2.png)
![Solicitar turno](readme/solicitar3.png)

## Mis turnos

Se muestran todos los turnos permitiendo buscar por todos los campos del mismo, dia, hora, especialista, especialidad, etc.
Tambien en caso de ser paciente se pueden cancelar, calificar, ver reseña/comentario y completar una encuesta, y en el
caso de ser especialista se puede aceptar o rechazar, una vez aceptado se puede cancelar, finalizar, una vez que el turno finaliza el especialista debera 
completar la historia clinica y dar una reseña.

![Mis turnos](readme/calificar.png)
![Mis turnos](readme/cancelar.png)
![Mis turnos](readme/encuesta.png)
![Mis turnos](readme/turnosFinalizados.png)

## Administrar turnos

Se muestran todos los turnos permitiendo buscar por especialidad o especialista, el administrador podra cancelar los turnos y dejar un comentario sobre eso.

## Graficos

Se muestran todos los graficos solicitados.
![Graficos](readme/turnosFinalizados.png)
![Graficos](readme/turnosxdia.png)
![Graficos](readme/turnosxespe.png)
![Graficos](readme/turnosxmedicoS.png)
![Graficos](readme/turnosxmedicoF.png)

## Directivas

Se utilizan las siguientes
![Directivas](readme/d1.png)
![Directivas](readme/d2.png)
![Directivas](readme/d3.png)

## Pipes

Se utilizan las siguientes
![Pipes](readme/async.png)
![Pipes](readme/keyvalue.png)