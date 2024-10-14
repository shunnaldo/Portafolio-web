import { Component, OnInit } from '@angular/core';
import { EventosAlumnosService } from 'src/app/services/eventos-alumnos.service';
import { eventosAlumnos } from 'src/app/models/evento-alumno';

@Component({
  selector: 'app-eventos-list',
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.css']
})
export class EventosListComponent implements OnInit {

  eventos: eventosAlumnos[] = [];

  constructor(private eventosAlumnosService: EventosAlumnosService) { }

  ngOnInit(): void {
    this.loadEventosAlumnos(); // Asegúrate de que este método se llame
  }

  loadEventosAlumnos(): void {
    this.eventosAlumnosService.getEventos().subscribe(
      (eventos) => {
        console.log('Eventos recibidos:', eventos);
        this.eventos = eventos;
      },
      (error) => {
        console.error('Error al cargar los eventos:', error);
      }
    );
  }

}
