import { Component, OnInit } from '@angular/core';
import { EventosService } from 'src/app/services/eventos.service';

@Component({
  selector: 'app-eventos-list',
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.css']
})
export class EventosListComponent implements OnInit {

  eventos: any[] = [];

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos() {
    this.eventosService.getEventos().subscribe(data => {
      this.eventos = data;
    });
  }


}
