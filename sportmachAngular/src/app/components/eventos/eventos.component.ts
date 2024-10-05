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
  selectedDate: string | null = null;
  selectedSectorId: string | null = null;

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
    this.selectedSectorId = event.target.value;
    this.filterHorarios();
  }

  onDateChange(): void {
    if (this.selectedDate) {
      const formattedDate = new Date(this.selectedDate + 'T00:00:00');
      this.selectedDate = formattedDate.toISOString().split('T')[0];
      this.filterHorarios();
    }
  }

  filterHorarios(): void {
    if (this.selectedSectorId && this.selectedDate) {
      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
      const dayOfWeek = this.normalizeDayName(this.getDayOfWeek(this.selectedDate));

      if (selectedSector) {
        this.horariosDisponibles = selectedSector.horarios.filter(horario => {
          const isSameDayOfWeek = this.normalizeDayName(horario.dia) === dayOfWeek;

          let isDateReserved = false;
          if (this.selectedDate) {  // Aseguramos que selectedDate no es null
            isDateReserved = horario.fechasReservadas?.includes(this.selectedDate) || false;
          }

          // Marcar el horario como no disponible visualmente pero mostrarlo
          horario.disponible = !isDateReserved;
          return isSameDayOfWeek;
        });
      }
    }
  }


  normalizeDayName(day: string): string {
    return day.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[date.getDay()];
  }

  selectHorario(horario: Horario): void {
    this.selectedHorario = horario;
  }

  onSubmit(): void {
    if (this.selectedHorario && this.selectedDate) {
      this.newEvento.idSector = `${this.selectedDate} ${this.selectedHorario.inicio}-${this.selectedHorario.fin}`;
      this.newEvento.descripcion += `\nHorario seleccionado: ${this.selectedHorario.dia} de ${this.selectedHorario.inicio} a ${this.selectedHorario.fin} en la fecha ${this.selectedDate}`;

      if (!this.selectedHorario.fechasReservadas) {
        this.selectedHorario.fechasReservadas = [];
      }
      this.selectedHorario.fechasReservadas.push(this.selectedDate);

      this.eventosService.createEvento(this.newEvento)
        .then(() => {
          this.updateSectorHorario();
          alert('Evento creado exitosamente');
          this.resetForm();
          this.filterHorarios();
        })
        .catch(error => {
          console.error('Error creando el evento: ', error);
          alert('Hubo un error al crear el evento');
        });
    }
  }

  updateSectorHorario(): void {
    if (this.selectedSectorId) {
      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
      if (selectedSector) {
        this.sectoresService.updateSector(this.selectedSectorId, selectedSector).then(() => {
          console.log('Sector actualizado con horarios reservados');
        }).catch(error => {
          console.error('Error actualizando el sector:', error);
        });
      }
    }
  }

  resetForm(): void {
    this.newEvento = new eventos('', '', '', '', '', false);
    this.selectedHorario = null;
    this.horariosDisponibles = [];
    this.selectedDate = null;
    this.selectedSectorId = null;
  }
}
