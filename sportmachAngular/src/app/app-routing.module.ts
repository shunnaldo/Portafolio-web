import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { VerificarEmailComponent } from './components/verificar-email/verificar-email.component';
import { AuthGuard } from './services/auth.guard';
import { GuestGuard } from './services/guest.guard';
import { DeportesComponent } from './components/deportes/deportes.component';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EventosListComponent } from './components/eventos-list/eventos-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [GuestGuard] },
  { path: 'verificarEmail', component: VerificarEmailComponent },
  { path: 'deportes', component: DeportesComponent},
  { path: 'sectores', component: SectoresComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'evento/:id', component: EventosComponent },
  { path: 'evento-list', component: EventosListComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
