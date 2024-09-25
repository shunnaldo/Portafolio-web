import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';

const routes: Routes = [

  { path: 'sectores', component: SectoresComponent },
  { path: 'evento', component: EventosComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
