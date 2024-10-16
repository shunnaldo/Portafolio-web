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

  selectedEvento: any = null;
  sectores: Sectores[] = [];
  horariosDisponibles: Horario[] = [];
  newEvento: eventos = new eventos('', '', '', '', '', false, '', '');
  selectedHorario: Horario | null = null;
  selectedDate: string | null = null;
  selectedSectorId: string | null = null;
  availableDays: Set<string> = new Set();
  minDate: string;
  maxDate: string;
  currentStep: number = 1;
  eventos: eventos[] = [];
  isEditing: boolean = false; // Para saber si estamos en modo edición
  eventoEditando: eventos | null = null; // Guardar el evento que se está editando

  // Nueva propiedad para la imagen del sector seleccionado
  selectedSectorImage: string | null = null;

  constructor(
    private eventosService: EventosService,
    private sectoresService: SectoresService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    this.maxDate = nextYear.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadSectores();
    this.sectoresService.getSectores().subscribe(sectores => {
      this.sectores = sectores;
    });

    this.loadEvento();
  }

  loadEvento(): void {
    this.eventosService.getEventos().subscribe(eventos => {
      this.eventos = eventos;
      this.populateAvailableDays();
    });
  }

  nextStep(): void {
    if (this.canProceedToNextStep() && this.currentStep < 3) {
      this.currentStep++;
      this.updateActiveCircle();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateActiveCircle();
    }
  }

  updateActiveCircle(): void {
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      if (index + 1 === this.currentStep) {
        circle.classList.add('active');
      } else {
        circle.classList.remove('active');
      }
    });
  }

  loadSectores(): void {
    this.sectoresService.getSectores().subscribe(sectores => {
      this.sectores = sectores;
      this.populateAvailableDays();
    });
  }

  populateAvailableDays(): void {
    this.sectores.forEach(sector => {
      sector.horarios.forEach(horario => {
        if (horario.disponible) {
          const dayWithAvailableHours = horario.fechasReservadas || [];
          dayWithAvailableHours.forEach(fecha => {
            this.availableDays.add(fecha);
          });
        }
      });
    });
  }

  isDayAvailable(date: string): boolean {
    return this.availableDays.has(date);
  }

  onSectorChange(event: any): void {
    this.selectedSectorId = event.target.value;
    this.filterHorarios();

    const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
    if (selectedSector) {
      // Ahora guardamos el nombre del sector en lugar de su ID
      this.newEvento.sectorNombre = selectedSector.nombre;

      if (selectedSector.image) {
        this.selectedSectorImage = selectedSector.image;
        this.newEvento.image = selectedSector.image;
      } else {
        this.selectedSectorImage = null;
        this.newEvento.image = '';
      }
    }
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
          if (this.selectedDate) {
            isDateReserved = horario.fechasReservadas?.includes(this.selectedDate) || false;
          }
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
      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
  
      if (selectedSector) {
        this.newEvento.sectorNombre = selectedSector.nombre;
        this.newEvento.fechaReservada = this.selectedDate;
        this.newEvento.descripcion += `\nHorario seleccionado: ${this.selectedHorario.dia} de ${this.selectedHorario.inicio} a ${this.selectedHorario.fin} en la fecha ${this.selectedDate}`;
  
        if (!this.selectedHorario.fechasReservadas) {
          this.selectedHorario.fechasReservadas = [];
        }
        this.selectedHorario.fechasReservadas.push(this.selectedDate);
  
        if (this.isEditing && this.eventoEditando) {
          const sectorNombre = this.eventoEditando.sectorNombre ?? '';
          const fechaReservada = this.eventoEditando.fechaReservada ?? '';
          this.liberarHorarioAnterior(sectorNombre, fechaReservada);
  
          this.eventosService.updateEvento(this.eventoEditando.idEventosAdmin, this.newEvento)
            .then(() => {
              this.updateSectorHorario(selectedSector);
              alert('Evento modificado exitosamente');
              this.loadEvento(); // Actualizar lista de eventos
              this.resetForm();
              this.isEditing = false;
            })
            .catch(error => {
              console.error('Error modificando el evento: ', error);
              alert('Hubo un error al modificar el evento');
            });
        } else {
          this.eventosService.createEvento(this.newEvento)
            .then(() => {
              this.updateSectorHorario(selectedSector);
              alert('Evento creado exitosamente');
              this.loadEvento(); // Actualizar lista de eventos
              this.resetForm();
            })
            .catch(error => {
              console.error('Error creando el evento: ', error);
              alert('Hubo un error al crear el evento');
            });
        }
      }
    }
  }

  liberarHorarioAnterior(nombreSector: string, fechaReservada: string): void {
    const selectedSector = this.sectores.find(sector => sector.nombre === nombreSector);
    if (selectedSector) {
      const horario = selectedSector.horarios.find(h => h.fechasReservadas?.includes(fechaReservada));
      if (horario && horario.fechasReservadas) {
        const index = horario.fechasReservadas.indexOf(fechaReservada);
        if (index !== -1) {
          horario.fechasReservadas.splice(index, 1);  // Eliminar la fecha reservada
          horario.disponible = true;  // Marcar la hora como disponible nuevamente
          this.updateSectorHorario(selectedSector)
            .then(() => {
              console.log('Hora previa liberada y sector actualizado.');
            })
            .catch(error => {
              console.error('Error al liberar la hora anterior: ', error);
            });
        }
      }
    }
  }

  showDetails(evento: any) {
    this.selectedEvento = evento; // Mostrar el evento seleccionado
  }

  closeDetails() {
    this.selectedEvento = null; // Ocultar los detalles
  }

  editEvent(evento: eventos): void {
    this.isEditing = true;
    this.eventoEditando = evento;

    // Cargar los valores del evento seleccionado en el formulario
    this.newEvento = { ...evento };
    this.selectedSectorId = evento.idSector;
    this.selectedDate = evento.fechaReservada;

    this.filterHorarios();

    this.selectedHorario = this.horariosDisponibles.find(
      horario => horario.fechasReservadas?.includes(evento.fechaReservada)
    ) || null;
  }

  
  removeReservation(evento: any): void {
    const selectedSector = this.sectores.find(sector => sector.nombre === evento.sectorNombre);
    if (selectedSector && evento.fechaReservada) {
      const horario = selectedSector.horarios.find(h => h.fechasReservadas?.includes(evento.fechaReservada));
      if (horario && horario.fechasReservadas) {
        const index = horario.fechasReservadas.indexOf(evento.fechaReservada);
        if (index !== -1) {
          horario.fechasReservadas.splice(index, 1);
          horario.disponible = true;
  
          this.updateSectorHorario(selectedSector)
            .then(() => {
              this.eventosService.deleteEvento(evento.idEventosAdmin)
                .then(() => {
                  alert('Reserva y evento eliminados exitosamente.');
                  this.loadEvento(); // Actualizar lista de eventos
                })
                .catch(error => {
                  console.error('Error al eliminar el evento:', error);
                });
            })
            .catch(error => {
              console.error('Error al actualizar el sector:', error);
            });
        } else {
          console.error('Fecha no encontrada en el horario.');
        }
      } else {
        console.error('No se encontró el horario con la fecha reservada.');
      }
    } else {
      console.error('No se encontró el sector o la fecha reservada.');
    }
  }

  updateSectorHorario(selectedSector: Sectores): Promise<void> {
    if (selectedSector.idSector) {
      return this.sectoresService.updateSector(selectedSector.idSector, selectedSector)
        .then(() => {
          console.log('Sector actualizado con horarios reservados actualizados.');
        })
        .catch(error => {
          console.error('Error actualizando el sector:', error);
          throw error;
        });
    }
    return Promise.reject('No se encontró el ID del sector.');
  }

  getSectorNombre(sectorId: string): string {
    const sector = this.sectores.find(s => s.idSector === sectorId);
    return sector ? sector.nombre : 'Sector no encontrado';
  }

  resetForm(): void {
    this.newEvento = new eventos('', '', '', '', '', false, '', '');
    this.selectedHorario = null;
    this.horariosDisponibles = [];
    this.selectedDate = null;
    this.selectedSectorId = null;
    this.selectedSectorImage = null;
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.newEvento.sectorNombre && !!this.selectedDate && !!this.selectedHorario;
      case 2:
        return !!this.newEvento.titulo && !!this.newEvento.descripcion && !!this.newEvento.creator;
      case 3:
        return true;
      default:
        return false;
    }
  }

}
