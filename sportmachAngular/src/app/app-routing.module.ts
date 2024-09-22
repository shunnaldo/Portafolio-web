import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectoresComponent } from './components/sectores/sectores.component';

const routes: Routes = [

  { path: 'sectores', component: SectoresComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
