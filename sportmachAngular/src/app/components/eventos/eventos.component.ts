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
  availableDays: Set<string> = new Set();
  minDate: string;
  maxDate: string;
  currentStep: number = 1;

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
    } else {
      this.selectedSectorImage = null;
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
  getSectorNombre(sectorId: string): string {
    console.log(this.sectores);  // Verifica si la lista de sectores está cargada correctamente
    const sector = this.sectores.find(s => s.idSector === sectorId);
    return sector ? sector.nombre : 'Sector no encontrado';
  }


  resetForm(): void {
    this.newEvento = new eventos('', '', '', '', '', false);
    this.selectedHorario = null;
    this.horariosDisponibles = [];
    this.selectedDate = null;
    this.selectedSectorId = null;
    this.selectedSectorImage = null;
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        // Validar que el sector y la fecha estén seleccionados
        return !!this.newEvento.idSector && !!this.selectedDate && !!this.selectedHorario;
      case 2:
        // Validar que el título, descripción y creador estén completos
        return !!this.newEvento.titulo && !!this.newEvento.descripcion && !!this.newEvento.creator;
      case 3:
        // No se aplica ya que es el paso final
        return true;
      default:
        return false;
    }
  }



}
