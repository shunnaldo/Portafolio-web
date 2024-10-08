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
  newEvento: eventos = new eventos('', '', '', '', '', false, '', '');
  selectedHorario: Horario | null = null;
  selectedDate: string | null = null;
  selectedSectorId: string | null = null;
  availableDays: Set<string> = new Set();
  minDate: string;
  maxDate: string;
  currentStep: number = 1;
  eventos: eventos[] = [];

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

    // Buscar el sector seleccionado para obtener la imagen
    const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
    if (selectedSector && selectedSector.image) {
      this.selectedSectorImage = selectedSector.image;
      this.newEvento.image = selectedSector.image; // Asigna la imagen del sector al evento
    } else {
      this.selectedSectorImage = null;
      this.newEvento.image = ''; // Si no hay imagen, asigna una cadena vacía
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
      // Asegurarte de que selectedSectorId no es null antes de asignar
      if (this.selectedSectorId) {
        this.newEvento.idSector = this.selectedSectorId;
      } else {
        console.error('El ID del sector no está definido.');
        return;  // Detener el envío si no hay un sector seleccionado
      }

      // Asignar la fecha reservada y la información del horario a otros campos
      this.newEvento.fechaReservada = this.selectedDate;
      this.newEvento.descripcion += `\nHorario seleccionado: ${this.selectedHorario.dia} de ${this.selectedHorario.inicio} a ${this.selectedHorario.fin} en la fecha ${this.selectedDate}`;

      if (!this.selectedHorario.fechasReservadas) {
        this.selectedHorario.fechasReservadas = [];
      }
      this.selectedHorario.fechasReservadas.push(this.selectedDate);

      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);

      if (selectedSector) {
        this.eventosService.createEvento(this.newEvento)
          .then(() => {
            this.updateSectorHorario(selectedSector); // Pasar el sector actualizado
            alert('Evento creado exitosamente');
            this.resetForm();
            this.filterHorarios();
          })
          .catch(error => {
            console.error('Error creando el evento: ', error);
            alert('Hubo un error al crear el evento');
          });
      } else {
        console.error('No se encontró el sector seleccionado.');
      }
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
          throw error; // Propagar el error si ocurre
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
        return !!this.newEvento.idSector && !!this.selectedDate && !!this.selectedHorario;
      case 2:
        return !!this.newEvento.titulo && !!this.newEvento.descripcion && !!this.newEvento.creator;
      case 3:
        return true;
      default:
        return false;
    }
  }
  removeReservation(evento: any): void {
    console.log('Evento recibido:', evento); // Imprimir el evento para verificar los datos

    // Encontrar el sector seleccionado por su ID
    const selectedSector = this.sectores.find(sector => sector.idSector === evento.idSector);
    console.log('Sector encontrado:', selectedSector); // Imprimir el sector encontrado

    if (selectedSector && evento.fechaReservada) {
      console.log('Fecha reservada en el evento:', evento.fechaReservada); // Imprimir la fecha reservada

      // Buscar el horario que contiene la fecha reservada
      const horario = selectedSector.horarios.find(h => h.fechasReservadas?.includes(evento.fechaReservada));
      console.log('Horario encontrado:', horario); // Imprimir el horario encontrado

      if (horario && horario.fechasReservadas) {
        // Encontrar el índice de la fecha que se quiere eliminar
        const index = horario.fechasReservadas.indexOf(evento.fechaReservada);
        console.log('Índice de la fecha reservada:', index); // Imprimir el índice de la fecha

        if (index !== -1) {
          // Eliminar la fecha reservada del array
          horario.fechasReservadas.splice(index, 1);

          // Si ya no quedan fechas reservadas, marcar el horario como disponible
          if (horario.fechasReservadas.length === 0) {
            horario.disponible = true;
          }

          // Actualizar el sector en Firestore pasando el sector actualizado
          this.updateSectorHorario(selectedSector)
            .then(() => {
              // Una vez que el horario ha sido actualizado, eliminar el evento
              this.eventosService.deleteEvento(evento.idEventosAdmin)
                .then(() => {
                  alert('Reserva y evento eliminados exitosamente.');
                  // Aquí puedes actualizar la lista de eventos si es necesario
                  this.loadEvento();  // Volver a cargar los eventos
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



  hasReservedHorario(evento: any): boolean {
    const selectedSector = this.sectores.find(sector => sector.idSector === evento.idSector);
    if (selectedSector && evento.fechaReservada) {
      return selectedSector.horarios.some(h => h.fechasReservadas?.includes(evento.fechaReservada));
    }
    return false;
  }

}
