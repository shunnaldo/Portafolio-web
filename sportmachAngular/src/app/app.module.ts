import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Añadir MatDatepickerModule
import { MatInputModule } from '@angular/material/input'; // Añadir MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Añadir MatButtonModule
import { MatNativeDateModule } from '@angular/material/core'; // Añadir MatNativeDateModule
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventosListComponent } from './components/eventos-list/eventos-list.component';


@NgModule({
  declarations: [
    AppComponent,
    SectoresComponent,
    EventosComponent,
    EventosListComponent
  ],
  imports: [
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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
