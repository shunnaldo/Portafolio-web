import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './services/auth.guard';
import { GuestGuard } from './services/guest.guard';
import { DeportesComponent } from './components/deportes/deportes.component';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EventosListComponent } from './components/eventos-list/eventos-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [GuestGuard] },
  { path: 'deportes', component: DeportesComponent, canActivate: [GuestGuard]},
  { path: 'sectores', component: SectoresComponent, canActivate: [GuestGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [GuestGuard] },
  { path: 'evento/:id', component: EventosComponent, canActivate: [GuestGuard] },
  { path: 'evento-list', component: EventosListComponent, canActivate: [GuestGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
