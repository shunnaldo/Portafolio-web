import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';  // Importamos Auth y authState
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user$: Observable<any | null>;  // Observable para rastrear el estado del usuario

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);  // Observamos el estado de autenticación
  }

  ngOnInit(): void {
    // Cualquier lógica adicional para la inicialización del componente
  }

  logout(): void {
    this.auth.signOut().then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  }
}
