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
  diaSeleccionado: string = '';
  modalAbierto: boolean = false;
  duration: number = 1; // Duración por defecto

  constructor(private sectoresService: SectoresService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sectores$ = this.sectoresService.getSectores();
    this.resetHorarios();
  }

  // Convertir la duración a horas y minutos
  formatHour(hour: number): string {
    const hours = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    return minutes > 0 ? `${hours}:${minutes === 30 ? '30' : '00'}` : `${hours}:00`;
  }

  // Inicializar horarios de acuerdo a la duración seleccionada
  resetHorarios() {
    this.horariosPorDia = {};
    this.horariosSeleccionados = {};

    this.dias.forEach(dia => {
      const horasPorDia = [];
      let horaActual = 9; // Comenzar a las 9:00
      const horaFinDia = 21; // Terminar a las 21:00
      
      while (horaActual + this.duration <= horaFinDia) {
        horasPorDia.push(horaActual); // Guardar la hora de inicio
        horaActual += this.duration; // Incrementar según la duración
      }

      this.horariosPorDia[dia] = horasPorDia; // Asignar horarios generados para el día
      this.horariosSeleccionados[dia] = []; // Inicialmente, sin horarios seleccionados
    });
  }

  // Verificar si un horario ya está seleccionado
  isHorarioSelected(dia: string, hora: number): boolean {
    return this.horariosSeleccionados[dia]?.some(h => h.inicio === hora) ?? false;
  }

  // Seleccionar o deseleccionar un horario con duración personalizada
  toggleHorario(dia: string, hora: number) {
    const index = this.horariosSeleccionados[dia].findIndex(h => h.inicio === hora);
    
    if (index === -1) {
      const horaFin = hora + this.duration;
      this.horariosSeleccionados[dia].push({ inicio: hora, fin: horaFin });
    } else {
      this.horariosSeleccionados[dia].splice(index, 1);
    }
  }

  // Guardar horarios seleccionados
  guardarHorariosPorDia() {
    const horariosDiaSeleccionado = this.horariosSeleccionados[this.diaSeleccionado].map(h => ({
      dia: this.diaSeleccionado,
      inicio: h.inicio,
      fin: h.fin
    }));

    // Eliminar horarios existentes del día seleccionado
    this.newSector.horarios = this.newSector.horarios.filter(h => h.dia !== this.diaSeleccionado);

    // Agregar nuevos horarios seleccionados
    this.newSector.horarios.push(...horariosDiaSeleccionado);

    this.snackBar.open(`Horarios para ${this.diaSeleccionado} guardados`, 'Cerrar', { duration: 2000 });
    this.cerrarModal();
  }

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

  resetForm() {
    this.newSector = new Sectores('', '', null, []);
    this.selectedFile = null;
    this.isEditing = false;
    this.editingSectorId = null;
    this.diaSeleccionado = '';
    this.duration = 1;  // Resetear duración a 1 hora por defecto
    this.resetHorarios();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  abrirModal(dia: string) {
    this.diaSeleccionado = dia;
    this.modalAbierto = true;
  }
}
