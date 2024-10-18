import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
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
  { path: 'deportes', component: DeportesComponent, canActivate: [AuthGuard] },
  { path: 'sectores', component: SectoresComponent, canActivate: [AuthGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'evento/:id', component: EventosComponent, canActivate: [AuthGuard] },
  { path: 'evento-list', component: EventosListComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
