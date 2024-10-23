import { Component, OnInit } from '@angular/core';
import { eventos } from 'src/app/models/eventos.models';
import { EventosService } from 'src/app/services/eventos.service';
import { SectoresService } from 'src/app/services/sectores.service';
import { Sectores } from 'src/app/models/sectores.models';
import { Horario } from 'src/app/models/horario.models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EventosAlumnosService } from 'src/app/services/eventos-alumnos.service';
import { eventosAlumnos } from 'src/app/models/evento-alumno';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosAlumnos: eventosAlumnos[] = [];

  selectedEvento: any = null;
  sectores: Sectores[] = [];
  horariosDisponibles: Horario[] = [];
  newEvento: eventos = new eventos('', '', '', '', '', false, '', '','');
  selectedHorario: Horario | null = null;
  selectedDate: string | null = null;
  selectedSectorId: string | null = null;
  availableDays: Set<string> = new Set();
  minDate: string;
  maxDate: string;
  selectedHorarios: Horario[] = [];
  currentStep: number = 1;
  eventos: eventos[] = [];
  isEditing: boolean = false; // Para saber si estamos en modo edición
  eventoEditando: eventos | null = null; // Guardar el evento que se está editando


  // Nueva propiedad para la imagen del sector seleccionado
  selectedSectorImage: string | null = null;

  constructor(
    private eventosService: EventosService,
    private sectoresService: SectoresService,
    private afAuth: AngularFireAuth,
    private eventoAlumnoService:EventosAlumnosService
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
    this.loadEventosAlumnos();
  }


  loadEventosAlumnos(): void {
    this.eventoAlumnoService.getEventos().subscribe(eventosAlumnos => {
      this.eventosAlumnos = eventosAlumnos;
      console.log('Eventos de alumnos cargados:', this.eventosAlumnos);
      this.filterHorarios(); // Filtrar los horarios después de cargar los eventos de alumnos
    });
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
      const sectorId = this.selectedSectorId || ''; // Usa un valor por defecto si es null
      const fecha = this.selectedDate || ''; // Usa un valor por defecto si es null
      const selectedSector = this.sectores.find(s => s.idSector === sectorId);

      if (selectedSector) {
        const dayOfWeek = this.normalizeDayName(this.getDayOfWeek(fecha));

        this.horariosDisponibles = selectedSector.horarios.map(horario => {
          const isSameDayOfWeek = this.normalizeDayName(horario.dia) === dayOfWeek;

          // Verificar si el horario está ocupado en 'eventos' o 'eventosAlumnos'
          const eventoBloqueado = this.eventos.some(evento => {
            const coincideSector = evento.idSector === sectorId;
            const coincideFecha = this.compararFechas(evento.fechaReservada, fecha);
            const coincideHora = evento.hora === `${horario.inicio} - ${horario.fin}`;
            return coincideSector && coincideFecha && coincideHora;
          });

          // Verificar si el horario está ocupado en 'eventosAlumnos'
          const alumnoEventoBloqueado = this.eventosAlumnos?.some(eventoAlumno => {
            const coincideSector = eventoAlumno.idSector === sectorId;
            const coincideFecha = this.compararFechas(eventoAlumno.fechaReservada, fecha);
            const coincideHora = eventoAlumno.hora === `${horario.inicio} - ${horario.fin}`;
            return coincideSector && coincideFecha && coincideHora;
          });

          // Determinar si el horario está disponible
          const disponible = isSameDayOfWeek && !eventoBloqueado && !alumnoEventoBloqueado;

          // Log para depurar
          console.log(`Horario: ${horario.inicio} - ${horario.fin}, Disponible: ${disponible}`);

          return { ...horario, disponible };
        }).filter(horario => this.normalizeDayName(horario.dia) === dayOfWeek);
      }
    }
  }



  compararFechas(fecha1: string, fecha2: string): boolean {
    // Convertimos ambas fechas a formato YYYY-MM-DD para compararlas
    const date1 = new Date(fecha1).toISOString().split('T')[0];
    const date2 = new Date(fecha2).toISOString().split('T')[0];
    return date1 === date2;
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
    const index = this.selectedHorarios.findIndex((h: Horario) => h.inicio === horario.inicio && h.fin === horario.fin);

    if (index === -1) {
      // Si el horario no está seleccionado, lo agregamos
      this.selectedHorarios.push(horario);
    } else {
      // Si ya está seleccionado, lo eliminamos
      this.selectedHorarios.splice(index, 1);
    }
  }


  onSubmit(): void {
    if (this.selectedHorarios.length > 0 && this.selectedDate) {
      const selectedSector = this.sectores.find(sector => sector.idSector === this.selectedSectorId);

      if (selectedSector) {
        this.newEvento.sectorNombre = selectedSector.nombre;
        this.newEvento.fechaReservada = this.selectedDate;

        // Concatenar las horas seleccionadas en un solo string
        this.newEvento.hora = this.selectedHorarios.map(horario => `${horario.inicio} - ${horario.fin}`).join(', ');

        this.afAuth.currentUser.then(user => {
          if (user) {
            this.newEvento.creator = user.email ?? 'Correo no disponible';

            if (!this.newEvento.capacidadAlumnos || this.newEvento.capacidadAlumnos < 1) {
              alert('Debe ingresar una capacidad válida para los participantes.');
              return;
            }

            if (this.isEditing && this.eventoEditando) {
              const sectorNombre = this.eventoEditando.sectorNombre ?? '';
              const fechaReservada = this.eventoEditando.fechaReservada ?? '';
              this.liberarHorarioAnterior(sectorNombre, fechaReservada);

              this.eventosService.updateEvento(this.eventoEditando.idEventosAdmin, this.newEvento)
                .then(() => {
                  this.updateSectorHorario(selectedSector);
                  alert('Evento modificado exitosamente');
                  location.reload();
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
                  location.reload();
                })
                .catch(error => {
                  console.error('Error creando el evento: ', error);
                  alert('Hubo un error al crear el evento');
                });
            }
          } else {
            alert('Usuario no autenticado.');
          }
        }).catch(error => {
          console.error('Error obteniendo el usuario actual: ', error);
        });
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

    // Filtrar los horarios disponibles en base al sector y la fecha seleccionada
    this.filterHorarios();

    // Reiniciar el array de selectedHorarios
    this.selectedHorarios = [];

    // Dividir las horas almacenadas en 'hora' y mapearlas a objetos Horario
    if (this.newEvento.hora) {
      const horariosStrings = this.newEvento.hora.split(', '); // Dividimos el string en base a la coma y el espacio

      horariosStrings.forEach(horaStr => {
        const [inicio, fin] = horaStr.split(' - '); // Dividimos cada hora en 'inicio' y 'fin'
        const horarioEncontrado = this.horariosDisponibles.find(
          horario => horario.inicio === inicio && horario.fin === fin
        );

        if (horarioEncontrado) {
          this.selectedHorarios.push(horarioEncontrado);
        }
      });
    }
  }


  removeReservation(evento: any): void {
    // Mostrar una confirmación antes de proceder con la eliminación
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el evento "${evento.titulo}"? Esta acción no se puede deshacer.`);

    if (confirmDelete) {
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
    } else {
      // El usuario canceló la eliminación
      console.log('Eliminación cancelada por el usuario.');
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
    this.newEvento = new eventos('', '', '', '', '', false, '', '','');
    this.selectedHorario = null;
    this.horariosDisponibles = [];
    this.selectedDate = null;
    this.selectedSectorId = null;
    this.selectedSectorImage = null;
  }



  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        // Verificar si se ha seleccionado al menos un horario en lugar de uno solo
        return !!this.newEvento.sectorNombre && !!this.selectedDate && this.selectedHorarios.length > 0;
      case 2:
        return !!this.newEvento.titulo && !!this.newEvento.descripcion && !!this.newEvento.creator;
      case 3:
        return true;
      default:
        return false;
    }
  }




}
