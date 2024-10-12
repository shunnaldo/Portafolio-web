import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user$: Observable<any | null>;  // Observable para rastrear el estado del usuario


  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.user$ = authState(this.auth);  // Observamos el estado de autenticación
    }

  logout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  }
}
