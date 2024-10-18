import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private afAuth: AngularFireAuth) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> {

        return this.afAuth.authState.pipe(
            take(1), // Nos suscribimos solo una vez
            map(user => {
                if (user) {
                    return true; // El usuario está autenticado
                } else {
                    console.log('Auth Guard: user is not logged in');
                    this.router.navigate(['/login']); // Redirigir a la página de login
                    return false; // Bloquear el acceso
                }
            })
        );
    }
}
