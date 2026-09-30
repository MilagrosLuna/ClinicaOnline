import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { FirebaseService } from '../servicios/firebase.service';

// Requiere sesión iniciada en Firebase Auth.
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const user = await firstValueFrom(authState(inject(Auth)));
  return user ? true : router.parseUrl('/login');
};

// Requiere sesión iniciada y que el usuario exista en la colección 'admins'.
export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const firebase = inject(FirebaseService);
  const user = await firstValueFrom(authState(inject(Auth)));
  if (!user) return router.parseUrl('/login');

  const admin = await firebase.getUserByUidAndType(user.uid, 'admins');
  return admin ? true : router.parseUrl('/home/presentacion');
};
