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

  constructor(private eventosAlumnosService: EventosAlumnosService) {}

  ngOnInit(): void {
    this.loadEventosAlumnos();
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

  toggleEspera(evento: eventosAlumnos): void {
    if (!evento.idEventosAlumnos) {
      console.error('El evento no tiene un ID válido:', evento);
      return; // No continuar si el ID no es válido
    }

    evento.espera = !evento.espera; // Cambiar el estado de espera

    this.eventosAlumnosService.updateEvento(evento.idEventosAlumnos, { espera: evento.espera })
      .then(() => {
        console.log(`Estado de espera actualizado para el evento: ${evento.idEventosAlumnos}`);
      })
      .catch((error) => {
        console.error('Error al actualizar el estado de espera:', error);
      });
  }


  editarEvento(evento: eventosAlumnos): void {
    console.log('Editar evento:', evento);
    // Implementar la lógica de edición si es necesario
  }

  eliminarEvento(id: string): void {
    this.eventosAlumnosService.deleteEvento(id).then(() => {
      console.log(`Evento eliminado: ${id}`);
      this.loadEventosAlumnos(); // Recargar los eventos
    }).catch((error) => {
      console.error('Error al eliminar el evento:', error);
    });
  }
}
