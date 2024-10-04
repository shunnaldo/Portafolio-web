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
  selectedSectorId: string | null = null;  // Añadimos una variable para almacenar el sector seleccionado

  // Definir el mapeo de días a números
  daysOrder = {
    'lunes': 1,
    'martes': 2,
    'miércoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sábado': 6,
    'domingo': 7
  };

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
    this.selectedSectorId = event.target.value;  // Almacenar el ID del sector seleccionado
    this.filterHorarios();
  }

  onDateChange(): void {
    if (this.selectedDate) {
      // Convertimos la fecha seleccionada a un formato ISO correcto (ya sin ajustes de zona horaria)
      const formattedDate = new Date(this.selectedDate + 'T00:00:00'); // Forzamos la hora a la medianoche local
      this.selectedDate = formattedDate.toISOString().split('T')[0]; // Obtenemos el formato YYYY-MM-DD
      this.filterHorarios();
    }
  }



  filterHorarios(): void {
    if (this.selectedSectorId && this.selectedDate) {
      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);
      const dayOfWeek = this.getDayOfWeek(this.selectedDate).toLowerCase();  // Convertimos a minúsculas para evitar problemas de capitalización
      console.log("Selected Date: ", this.selectedDate);
      console.log("Day of Week: ", dayOfWeek);

      if (selectedSector) {
        console.log("Horarios del sector: ", selectedSector.horarios);
        // Comparamos ambos en minúsculas para asegurar la coincidencia
        this.horariosDisponibles = selectedSector.horarios.filter(horario => {
          console.log("Comparando horario: ", horario.dia.toLowerCase(), " con ", dayOfWeek);
          return horario.dia.toLowerCase() === dayOfWeek;
        });
        console.log("Filtered Horarios: ", this.horariosDisponibles);
      }
    }
  }





  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');  // Forzar la fecha a medianoche en la zona horaria local
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    // Obtenemos el día de la semana basado en la zona horaria local
    const day = days[date.getDay()];
    console.log("Calculated day: ", day);  // Verificamos que este valor sea correcto
    return day;
  }



  selectHorario(horario: Horario): void {
    this.selectedHorario = horario;
  }

  onSubmit(): void {
    if (this.selectedHorario && this.selectedDate) {
      // Asignamos solo la fecha y la hora seleccionada como idSector
      this.newEvento.idSector = `${this.selectedDate} ${this.selectedHorario.inicio}-${this.selectedHorario.fin}`;

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
    this.selectedDate = null;
    this.selectedSectorId = null;
  }


}
