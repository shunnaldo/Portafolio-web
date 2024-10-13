import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './services/auth.guard';
import { GuestGuard } from './services/guest.guard';
import { DeportesComponent } from './admin/deportes/deportes.component';
import { SectoresComponent } from './admin/sectores/sectores.component';
import { EventosComponent } from './admin/eventos/eventos.component';
import { EventosListComponent } from './admin/eventos-list/eventos-list.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [GuestGuard] },
  { path: 'deportes', component: DeportesComponent},
  { path: 'sectores', component: SectoresComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'evento/:id', component: EventosComponent },
  { path: 'evento-list', component: EventosListComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
