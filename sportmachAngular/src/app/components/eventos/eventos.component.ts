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

  // Cargar los sectores disponibles para mostrar en el formulario
  loadSectores(): void {
    this.sectoresService.getSectores().subscribe(sectores => {
      this.sectores = sectores;
    });
  }

  // Manejar cambio de sector para cargar los horarios
  onSectorChange(event: any): void {
    const selectedSectorId = event.target.value;
    const sectorSeleccionado = this.sectores.find(sector => sector.idSector === selectedSectorId);

    if (sectorSeleccionado) {
      this.horariosDisponibles = sectorSeleccionado.horarios
        .slice() // Para no modificar directamente el array original
        .sort((a, b) => this.compareDayAndTime(a, b));
    }
  }

  // Mapa para asignar un valor numérico a los días de la semana
  daysOrder = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Domingo': 7
  };

  // Comparar días y tiempos
  compareDayAndTime(horario1: Horario, horario2: Horario): number {
    const day1 = this.daysOrder[horario1.dia as keyof typeof this.daysOrder];
    const day2 = this.daysOrder[horario2.dia as keyof typeof this.daysOrder];

    const dayComparison = day1 - day2;

    if (dayComparison !== 0) {
      return dayComparison;
    }

    return this.compareTime(horario1.inicio, horario2.inicio);
  }

  // Comparar dos tiempos en formato HH:mm
  compareTime(time1: string, time2: string): number {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
      return hours1 - hours2;
    } else {
      return minutes1 - minutes2;
    }
  }

  // Crear un nuevo evento cuando se envía el formulario
  onSubmit(): void {
    if (this.selectedHorario) {
      // Puedes incluir la lógica para asociar el horario seleccionado con el evento aquí
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

  // Resetear el formulario después de crear el evento
  resetForm(): void {
    this.newEvento = new eventos('', '', '', '', '', false);
    this.selectedHorario = null;
    this.horariosDisponibles = [];
  }
}
