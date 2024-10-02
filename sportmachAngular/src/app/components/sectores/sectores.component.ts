import { Component, OnInit } from '@angular/core';
import { SectoresService } from 'src/app/services/sectores.service';
import { Sectores } from 'src/app/models/sectores.models';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent implements OnInit {
  sectores$: Observable<Sectores[]> = new Observable();
  newSector: Sectores = new Sectores('', '', null, []);
  selectedFile: File | null = null;
  isEditing: boolean = false;
  editingSectorId: string | null = null;
  dias: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  horariosPorDia: { [key: string]: number[] } = {};
  horariosSeleccionados: { [key: string]: { inicio: number; fin: number }[] } = {};
  duracionesPorDia: { [key: string]: { horas: number, minutos: number } } = {};
  diaSeleccionado: string = '';
  modalAbierto: boolean = false;

  // Nueva propiedad para controlar visibilidad de horarios
  showHorarios: { [key: string]: boolean } = {};

  constructor(private sectoresService: SectoresService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sectores$ = this.sectoresService.getSectores();
    this.dias.forEach(dia => {
      this.duracionesPorDia[dia] = { horas: 1, minutos: 0 };
    });
    this.resetHorarios();
  }

  toggleHorarios(sectorId: string) {
    this.showHorarios[sectorId] = !this.showHorarios[sectorId];
  }

  // Método para agregar o actualizar un sector
  addOrUpdateSector() {
    if (!this.newSector.nombre || !this.newSector.capacidad || this.newSector.horarios.length === 0) {
      this.snackBar.open('Por favor, completa todos los campos requeridos y selecciona los horarios', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.isEditing && this.editingSectorId) {
      this.sectoresService.updateSector(this.editingSectorId, this.newSector)
        .then(() => {
          this.snackBar.open('Sector actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al actualizar el sector: ', error);
          this.snackBar.open('Error al actualizar el sector', 'Cerrar', { duration: 3000 });
        });
    } else {
      this.sectoresService.addSector(this.newSector, this.selectedFile || undefined)
        .then(() => {
          this.snackBar.open('Sector agregado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al agregar el sector: ', error);
          this.snackBar.open('Error al agregar el sector', 'Cerrar', { duration: 3000 });
        });
    }
  }

  // Método para manejar la carga de archivos
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  resetForm() {
    this.newSector = new Sectores('', '', null, []);
    this.selectedFile = null;
    this.isEditing = false;
    this.editingSectorId = null;
    this.diaSeleccionado = '';
    this.dias.forEach(dia => {
      this.duracionesPorDia[dia] = { horas: 1, minutos: 0 };
    });
    this.resetHorarios();
  }

  deleteSector(idSector: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este sector?')) {
      this.sectoresService.deleteSector(idSector)
        .then(() => {
          this.snackBar.open('Sector eliminado exitosamente', 'Cerrar', { duration: 3000 });
        })
        .catch(error => {
          console.error('Error al eliminar el sector: ', error);
          this.snackBar.open('Error al eliminar el sector', 'Cerrar', { duration: 3000 });
        });
    }
  }

  editSector(sector: Sectores) {
    this.isEditing = true;
    this.editingSectorId = sector.idSector;
    this.newSector = { ...sector };
  
    this.horariosSeleccionados = {};
  
    sector.horarios.forEach(horario => {
      const dia = horario.dia;
  
      const horasInicio = Math.floor(horario.inicio / 60);
      const minutosInicio = horario.inicio % 60;
      const horasFin = Math.floor(horario.fin / 60);
      const minutosFin = horario.fin % 60;
  
      const duracionHoras = horasFin - horasInicio;
      const duracionMinutos = minutosFin - minutosInicio;
  
      this.duracionesPorDia[dia] = { horas: duracionHoras, minutos: duracionMinutos };
  
      this.horariosSeleccionados[dia] = [
        ...this.horariosSeleccionados[dia] || [],
        { inicio: horario.inicio, fin: horario.fin }
      ];
    });
  
    this.dias.forEach(dia => this.generarHorariosPorDia(dia));
  }
  
  isHorarioSelected(dia: string, hora: number): boolean {
    return this.horariosSeleccionados[dia]?.some(h => h.inicio === hora) ?? false;
  }

  formatHour(hourInMinutes: number): string {
    const hours = Math.floor(hourInMinutes / 60);
    const minutes = hourInMinutes % 60;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  }

  abrirModal(dia: string) {
    this.diaSeleccionado = dia;
    if (!this.duracionesPorDia[dia]) {
      this.duracionesPorDia[dia] = { horas: 1, minutos: 0 };
    }
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  resetHorarios(dia?: string) {
    if (dia) {
      this.generarHorariosPorDia(dia);
    } else {
      this.dias.forEach(dia => this.generarHorariosPorDia(dia));
    }
  }

  duracionTotalEnMinutos(dia: string): number {
    return (this.duracionesPorDia[dia].horas * 60) + this.duracionesPorDia[dia].minutos;
  }

  generarHorariosPorDia(dia: string) {
    const horasPorDia = [];
    let horaActual = 9 * 60;
    const horaFinDia = 23 * 60;
    const duracionTotalEnMinutos = this.duracionTotalEnMinutos(dia);

    while (horaActual + duracionTotalEnMinutos <= horaFinDia) {
      horasPorDia.push(horaActual);
      horaActual += duracionTotalEnMinutos;
    }

    this.horariosPorDia[dia] = horasPorDia;
    this.horariosSeleccionados[dia] = this.horariosSeleccionados[dia] || [];
  }

  toggleHorario(dia: string, hora: number) {
    const duracionTotalEnMinutos = this.duracionTotalEnMinutos(dia);
    const horaFin = hora + duracionTotalEnMinutos;

    if (horaFin > 23 * 60) {
      this.snackBar.open('El horario no puede superar las 23:00', 'Cerrar', { duration: 2000 });
      return;
    }

    const index = this.horariosSeleccionados[dia].findIndex(h => h.inicio === hora);

    if (index === -1) {
      this.horariosSeleccionados[dia].push({ inicio: hora, fin: horaFin });
    } else {
      this.horariosSeleccionados[dia].splice(index, 1);
    }
  }

  guardarHorariosPorDia() {
    const horariosDiaSeleccionado = this.horariosSeleccionados[this.diaSeleccionado].map(h => ({
      dia: this.diaSeleccionado,
      inicio: h.inicio,
      fin: h.fin
    }));

    this.newSector.horarios = this.newSector.horarios.filter(h => h.dia !== this.diaSeleccionado);
    this.newSector.horarios.push(...horariosDiaSeleccionado);

    this.snackBar.open(`Horarios para ${this.diaSeleccionado} guardados`, 'Cerrar', { duration: 2000 });
    this.cerrarModal();
  }
}
