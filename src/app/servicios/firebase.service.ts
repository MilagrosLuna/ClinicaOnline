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
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Admin } from '../clases/admin';
import { Paciente } from '../clases/paciente';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: Firestore;
  constructor(public auth: Auth) {
    this.db = getFirestore();
    initializeApp(environment.firebase);
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
      console.log(user);
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
      console.log(user);
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
      console.log("paso aca");
      return admin;
    } catch (error) {
      console.error('Error al buscar el administrador por UID: ', error);
      return null;
    }
  }

}
