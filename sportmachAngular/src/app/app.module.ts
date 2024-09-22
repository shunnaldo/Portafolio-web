import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule } from '@angular/forms';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';



@NgModule({
  declarations: [
    AppComponent,
    SectoresComponent,
    EventosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
