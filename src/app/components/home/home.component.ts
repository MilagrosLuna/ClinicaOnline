import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/clases/admin';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  usuarioAdmin: Admin | null = null;
  constructor(private authService: FirebaseService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    console.log(user);
    if (user) {
      this.usuarioAdmin = await this.authService.getAdminByUid(user.uid);
    }
  }
}
