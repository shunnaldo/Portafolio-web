import { Component, OnInit } from '@angular/core';
import { eventos } from 'src/app/models/eventos.models';
import { EventosService } from 'src/app/services/eventos.service';
import { SectoresService } from 'src/app/services/sectores.service';
import { Sectores } from 'src/app/models/sectores.models';
import { Horario } from 'src/app/models/horario.models';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  sectores: Sectores[] = [];
  horariosDisponibles: Horario[] = [];
  newEvento: eventos = new eventos('', '', '', '', '', false);
  selectedHorario: Horario | null = null;

  constructor(
    private eventosService: EventosService,
    private sectoresService: SectoresService
  ) {}

  ngOnInit(): void {
    this.loadSectores();
  }

  loadSectores(): void {
    this.sectoresService.getSectores().subscribe(sectores => {
      this.sectores = sectores;
    });
  }

  onSectorChange(event: any): void {
    const selectedSectorId = event.target.value;
    const sectorSeleccionado = this.sectores.find(sector => sector.idSector === selectedSectorId);

    if (sectorSeleccionado) {
      this.horariosDisponibles = sectorSeleccionado.horarios
        .slice()
        .sort((a, b) => this.compareDayAndTime(a, b));
    }
  }

  daysOrder = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Domingo': 7
  };

  compareDayAndTime(horario1: Horario, horario2: Horario): number {
    const day1 = this.daysOrder[horario1.dia as keyof typeof this.daysOrder];
    const day2 = this.daysOrder[horario2.dia as keyof typeof this.daysOrder];
    const dayComparison = day1 - day2;

    if (dayComparison !== 0) {
      return dayComparison;
    }

    return this.compareTime(horario1.inicio, horario2.inicio);
  }

  compareTime(time1: string, time2: string): number {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
      return hours1 - hours2;
    } else {
      return minutes1 - minutes2;
    }
  }

  selectHorario(horario: Horario): void {
    this.selectedHorario = horario;
  }

  onSubmit(): void {
    if (this.selectedHorario) {
      // Asignamos solo el día y la hora seleccionada como idSector
      this.newEvento.idSector = `${this.selectedHorario.dia} ${this.selectedHorario.inicio}-${this.selectedHorario.fin}`;

      // Añadir la hora seleccionada a la descripción
      this.newEvento.descripcion += `\nHorario seleccionado: ${this.selectedHorario.dia} de ${this.selectedHorario.inicio} a ${this.selectedHorario.fin}`;
    }

    this.eventosService.createEvento(this.newEvento)
      .then(() => {
        alert('Evento creado exitosamente');
        this.resetForm();
      })
      .catch(error => {
        console.error('Error creando el evento: ', error);
        alert('Hubo un error al crear el evento');
      });
  }



  resetForm(): void {
    this.newEvento = new eventos('', '', '', '', '', false);
    this.selectedHorario = null;
    this.horariosDisponibles = [];
  }
}
