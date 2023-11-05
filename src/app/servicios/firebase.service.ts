import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
  sendEmailVerification,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Admin } from '../clases/admin';
import { Paciente } from '../clases/paciente';
import { Especialista } from '../clases/especialista';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: Firestore;
  user: User | null = null;
  constructor(public auth: Auth) {
    this.db = getFirestore();
    initializeApp(environment.firebase);
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }
  getCurrentUser(): User | null {
    return this.user;
  }
  async registerAdmin({ email, password, nick }: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: nick });    
      return user;
    } catch (error) {
      throw error;
    }
  }

  async register({ email, password, nick }: any) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: nick });
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Bienvenido!',
        showConfirmButton: false,
        timer: 1500,
      });
      await sendEmailVerification(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  public async guardarAdminBD(admin: Admin) {
    try {
      const docRef = await addDoc(collection(this.db, 'admins'), {
        uid: admin.uid,
        nombre: admin.nombre,
        apellido: admin.apellido,
        edad: admin.edad,
        dni: admin.dni,
        foto1: admin.foto1,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }

  public async guardarPacienteBD(paciente: Paciente) {
    try {
      const docRef = await addDoc(collection(this.db, 'pacientes'), {
        uid: paciente.uid,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        edad: paciente.edad,
        dni: paciente.dni,
        obraSocial: paciente.obraSocial,
        foto1: paciente.foto1,
        foto2: paciente.foto2,
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }

  public async guardarEspecialistaBD(especialista: Especialista) {
    try {
      const docRef = await addDoc(collection(this.db, 'especialistas'), {
        uid: especialista.uid,
        nombre: especialista.nombre,
        apellido: especialista.apellido,
        edad: especialista.edad,
        dni: especialista.dni,
        especialidad: especialista.especialidad,
        foto1: especialista.foto1,
        verificado:'false'
      });
      console.log('Document written with ID: ', docRef.id);
      return true;
    } catch (e) {
      console.error('Error adding document: ', e);
      return false;
    }
  }



  async getAdminByUid(uid: string): Promise<Admin | null> {
    try {
      const q = query(collection(this.db, 'admins'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        console.log('No se encontró ningún administrador con el UID proporcionado');
        return null;
      }
      const adminData = querySnapshot.docs[0].data();
      const admin = new Admin(
        adminData['uid'],
        adminData['nombre'],
        adminData['apellido'],
        adminData['edad'],
        adminData['dni'],
        adminData['foto1']
      );
      return admin;
    } catch (error) {
      console.error('Error al buscar el administrador por UID: ', error);
      return null;
    }
  }

  async getEspecialistasByUid(uid: string): Promise<Especialista | null> {
    try {
      const q = query(collection(this.db, 'especialistas'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        console.log('No se encontró ningún especialista con el UID proporcionado');
        return null;
      }
      const especialistaData = querySnapshot.docs[0].data();
      const admin = new Especialista(
        especialistaData['uid'],
        especialistaData['nombre'],
        especialistaData['apellido'],
        especialistaData['edad'],
        especialistaData['dni'],
        especialistaData['especialidad'],
        especialistaData['foto1'],
        especialistaData['verificado'],
      );
      return admin;
    } catch (error) {
      console.error('Error al buscar el especialista por UID: ', error);
      return null;
    }
  }

  async obtenerEspecialidades(): Promise<any[]> {
    try {
      const especialidadesRef = collection(this.db, 'especialidades');
      const querySnapshot = await getDocs(especialidadesRef);
  
      const especialidades = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
  
      return especialidades;
    } catch (error) {
      console.error('Error al obtener las especialidades: ', error);
      return [];
    }
  }

  async obtenerEspecialistas(): Promise<any[]> {
    try {
      const especialistasRef = collection(this.db, 'especialistas');
      const querySnapshot = await getDocs(especialistasRef);
  
      const especialistas = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
  
      return especialistas;
    } catch (error) {
      console.error('Error al obtener los especialistas: ', error);
      return [];
    }
  }

  async actualizarVerificadoEspecialista(uid: string, valor: string): Promise<void> {
    try {
      const especialistasCollection = collection(this.db, 'especialistas');
      const querys = query(especialistasCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(querys);
  
      if (querySnapshot.size === 0) {
        console.log('No se encontró ningún especialista con el UID interno proporcionado');
        return;
      }

      querySnapshot.forEach((docSnapshot) => {
        const especialistaRef = doc(this.db, 'especialistas', docSnapshot.id);
        updateDoc(especialistaRef, { verificado: valor });
      });
  
    } catch (error) {
      console.error('Error al actualizar el campo verificado del especialista: ', error);
      throw error;
    }
  }

  async guardarEspecialidad(especialidadNombre: string): Promise<void> {
    const especialidades = await this.obtenerEspecialidades();
    const especialidadExistente = especialidades.find((especialidad) => especialidad.nombre === especialidadNombre);  
    if (!especialidadExistente) {
      try {
        const docRef = await addDoc(collection(this.db, 'especialidades'), {
          nombre: especialidadNombre
        });
        console.log('Nueva especialidad guardada con ID: ', docRef.id);
      } catch (error) {
        console.error('Error al guardar la especialidad: ', error);
      }
    }
  }  

}
