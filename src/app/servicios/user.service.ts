import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User|null = null; 

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
