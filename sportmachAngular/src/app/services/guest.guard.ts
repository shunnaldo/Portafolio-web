import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          // Si el usuario está autenticado, lo redirigimos al dashboard o home
          this.router.navigate(['/dashboard']);
          return false; // Bloquea el acceso a las páginas de login, registro, etc.
        } else {
          return true; // Permite el acceso si no está autenticado
        }
      })
    );
  }
}
