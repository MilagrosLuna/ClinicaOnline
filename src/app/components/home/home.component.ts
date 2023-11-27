import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { fadeInOutAnimation } from 'src/app/animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeInOutAnimation],
})
export class HomeComponent {
  constructor(private authService: FirebaseService, private router: Router) {}
  ngOnInit(): void {
  }
}
