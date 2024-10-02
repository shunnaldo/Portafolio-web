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
  duracionesPorDia: { [key: string]: number } = {};
  diaSeleccionado: string = '';
  modalAbierto: boolean = false;

  constructor(private sectoresService: SectoresService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sectores$ = this.sectoresService.getSectores();
    this.dias.forEach(dia => {
      this.duracionesPorDia[dia] = 1;
    });
    this.resetHorarios();
  }

  // Método para agregar o actualizar un sector
  addOrUpdateSector() {
    if (this.isEditing && this.editingSectorId) {
      this.sectoresService.updateSector(this.editingSectorId, this.newSector)
        .then(() => {
          this.snackBar.open('Sector actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al actualizar el sector: ', error);
        });
    } else {
      this.sectoresService.addSector(this.newSector, this.selectedFile || undefined)
        .then(() => {
          this.snackBar.open('Sector agregado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al agregar el sector: ', error);
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

  // Método para resetear el formulario
  resetForm() {
    this.newSector = new Sectores('', '', null, []);
    this.selectedFile = null;
    this.isEditing = false;
    this.editingSectorId = null;
    this.diaSeleccionado = '';
    this.dias.forEach(dia => {
      this.duracionesPorDia[dia] = 1;
    });
    this.resetHorarios();
  }

  // Método para eliminar un sector
  deleteSector(idSector: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este sector?')) {
      this.sectoresService.deleteSector(idSector)
        .then(() => {
          this.snackBar.open('Sector eliminado exitosamente', 'Cerrar', { duration: 3000 });
        })
        .catch(error => {
          console.error('Error al eliminar el sector: ', error);
        });
    }
  }

  // Método para editar un sector
  editSector(sector: Sectores) {
    this.isEditing = true;
    this.editingSectorId = sector.idSector;
    this.newSector = { ...sector };
    this.dias.forEach(dia => {
      this.duracionesPorDia[dia] = 1;
    });
    sector.horarios.forEach(horario => {
      this.horariosSeleccionados[horario.dia] = [
        ...this.horariosSeleccionados[horario.dia],
        { inicio: horario.inicio, fin: horario.fin }
      ];
    });
  }

  // Método para verificar si un horario ya está seleccionado
  isHorarioSelected(dia: string, hora: number): boolean {
    return this.horariosSeleccionados[dia]?.some(h => h.inicio === hora) ?? false;
  }

  // Método para formatear las horas de manera legible
  formatHour(hour: number): string {
    const hours = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    return minutes > 0 ? `${hours}:${minutes === 30 ? '30' : '00'}` : `${hours}:00`;
  }

  // Otros métodos para el manejo de horarios y la lógica de abrir/cerrar modal
  abrirModal(dia: string) {
    this.diaSeleccionado = dia;
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

  generarHorariosPorDia(dia: string) {
    const horasPorDia = [];
    let horaActual = 9;
    const horaFinDia = 23;
    const duracion = this.duracionesPorDia[dia];

    while (horaActual + duracion <= horaFinDia) {
      horasPorDia.push(horaActual);
      horaActual += duracion;
    }

    this.horariosPorDia[dia] = horasPorDia;
    this.horariosSeleccionados[dia] = this.horariosSeleccionados[dia] || [];
  }

  toggleHorario(dia: string, hora: number) {
    const duracion = this.duracionesPorDia[dia];
    const horaFin = hora + duracion;

    // Validar que la hora de fin no exceda las 23:00
    if (horaFin > 23) {
      this.snackBar.open('El horario no puede superar las 23:00', 'Cerrar', { duration: 2000 });
      return; // No permitir la selección si excede las 23:00
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
