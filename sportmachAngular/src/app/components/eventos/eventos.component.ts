import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from 'src/app/services/eventos.service';
import { Sectores } from 'src/app/models/sectores.models';
import { eventos } from 'src/app/models/eventos.models';
import { SectoresService } from 'src/app/services/sectores.service';
import { Observable, of } from 'rxjs'; // Asegúrate de importar 'of' para inicializar eventos$

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

}
