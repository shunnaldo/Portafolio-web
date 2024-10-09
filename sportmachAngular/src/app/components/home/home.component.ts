import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData } from '@angular/fire/firestore'; // Importamos Firestore
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user$: Observable<any | null>;  // Observable para rastrear el estado del usuario
  usersCount$: Observable<number>;  // Observable para el conteo de usuarios
  eventsCount$: Observable<number>; // Observable para el conteo de eventos

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.user$ = authState(this.auth);  // Observamos el estado de autenticación

    // Obtenemos la colección de usuarios desde Firestore
    const usersCollection = collection(this.firestore, 'Users');
    this.usersCount$ = collectionData(usersCollection).pipe(
      map(users => users.length)  // Obtenemos la longitud de los usuarios
    );

    // Obtenemos la colección de eventos desde Firestore
    const eventsCollection = collection(this.firestore, 'events');
    this.eventsCount$ = collectionData(eventsCollection).pipe(
      map(events => events.length)  // Obtenemos la longitud de los eventos
    );
  }

  ngOnInit(): void {
    // Lógica adicional si es necesario
  }

  logout(): void {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  }
}
