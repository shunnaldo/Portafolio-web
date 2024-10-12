import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';  // Reemplazamos AngularFireAuth por Auth
import { Firestore, doc, docData } from '@angular/fire/firestore';  // Reemplazamos AngularFirestore por Firestore
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';  // Necesitamos 'of' para manejar el caso cuando no hay usuario

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user$: Observable<any | null>;  // Observamos los datos del usuario

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const emailLower = user.email!.toLowerCase();
          const userDocRef = doc(this.firestore, `users/${emailLower}`);
          return docData(userDocRef);  // Obtiene los datos del documento del usuario desde Firestore
        } else {
          return of(null);  // Si no hay usuario autenticado, devolvemos null
        }
      })
    );
  }

  ngOnInit(): void {
    // Puedes manejar cualquier otra lógica de inicialización aquí
  }
}
