import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectoresComponent } from './components/sectores/sectores.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { EventosListComponent } from './components/eventos-list/eventos-list.component';

const routes: Routes = [

  { path: 'sectores', component: SectoresComponent },
  { path: 'evento', component: EventosComponent },
  { path: 'evento/:id', component: EventosComponent },
  { path: 'evento-list', component: EventosListComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
