import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Añadir MatDatepickerModule
import { MatInputModule } from '@angular/material/input'; // Añadir MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Añadir MatButtonModule
import { MatNativeDateModule } from '@angular/material/core'; // Añadir MatNativeDateModule
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { EventosListComponent } from './admin/eventos-list/eventos-list.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { DeportesComponent } from './admin/deportes/deportes.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { SectoresComponent } from './admin/sectores/sectores.component';
import { EventosComponent } from './admin/eventos/eventos.component';

import { NgxApexchartsModule } from 'ngx-apexcharts';
import { DeportesChartComponent } from './graphics/deportes-chart/deportes-chart.component';
import { SectoresChartComponent } from './graphics/sectores-chart/sectores-chart.component';
import { UserGrowthChartComponent } from './graphics/user-growth-chart/user-growth-chart.component';
import { ClubMembersChartComponent } from './graphics/club-members-chart/club-members-chart.component';
import { RankingManagementComponent } from './admin/ranking-management/ranking-management.component';
import { RankingChartComponent } from './graphics/ranking-chart/ranking-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SectoresComponent,
    EventosComponent,
    EventosListComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RecuperarContrasenaComponent,
    DeportesComponent,
    UsuariosComponent,
    DeportesChartComponent,
    SectoresChartComponent,
    UserGrowthChartComponent,
    ClubMembersChartComponent,
    RankingManagementComponent,
    RankingChartComponent,
  ],
  imports: [
    NgxApexchartsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    BsDatepickerModule.forRoot(),
    // Angular Material Modules
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    //
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
