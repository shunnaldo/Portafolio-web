import { Component, OnInit } from '@angular/core';
import { SectoresService } from 'src/app/services/sectores.service';
import { Sectores } from 'src/app/models/sectores.models';
import { Horario } from 'src/app/models/horario.models';
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
  dias: string[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']; // Días de la semana
  horariosPorDia: { [key: string]: number[] } = {}; // Horarios disponibles por día
  horariosSeleccionados: { [key: string]: number[] } = {}; // Horarios seleccionados por día
  diaSeleccionado: string = ''; // Día seleccionado en el botón
  modalAbierto: boolean = false; // Controla si el modal está abierto

  constructor(private sectoresService: SectoresService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sectores$ = this.sectoresService.getSectores();
    this.resetHorarios(); // Inicializar los horarios
  }

  // Inicializar horarios de 9:00 a 20:00 para todos los días
  resetHorarios() {
    this.horariosPorDia = {};
    this.horariosSeleccionados = {};
    this.dias.forEach(dia => {
      this.horariosPorDia[dia] = Array.from({ length: 11 }, (_, i) => i + 9); // Horarios de 9 a 20
      this.horariosSeleccionados[dia] = []; // Inicialmente, sin horarios seleccionados
    });
  }

  // Abre el modal para seleccionar horarios para el día seleccionado
  abrirModal(dia: string) {
    this.diaSeleccionado = dia;
    this.modalAbierto = true;
  }

  // Cierra el modal
  cerrarModal() {
    this.modalAbierto = false;
  }

  // Seleccionar o deseleccionar un horario
  toggleHorario(dia: string, hora: number) {
    const index = this.horariosSeleccionados[dia].indexOf(hora);
    if (index === -1) {
      this.horariosSeleccionados[dia].push(hora); // Agregar hora
    } else {
      this.horariosSeleccionados[dia].splice(index, 1); // Eliminar hora
    }
  }

  // Guardar los horarios seleccionados para el día en el sector
  guardarHorariosPorDia() {
    const horariosDiaSeleccionado = this.horariosSeleccionados[this.diaSeleccionado].map(hora => ({
      dia: this.diaSeleccionado,
      inicio: hora,
      fin: hora + 1
    }));

    // Eliminar horarios existentes del día seleccionado
    this.newSector.horarios = this.newSector.horarios.filter(h => h.dia !== this.diaSeleccionado);

    // Agregar los nuevos horarios seleccionados
    this.newSector.horarios.push(...horariosDiaSeleccionado);

    this.snackBar.open(`Horarios para ${this.diaSeleccionado} guardados`, 'Cerrar', { duration: 2000 });
    this.cerrarModal(); // Cerrar el modal después de guardar
  }

  addOrUpdateSector() {
    if (this.isEditing && this.editingSectorId) {
      // Actualizar sector existente
      this.sectoresService.updateSector(this.editingSectorId, this.newSector)
        .then(() => {
          this.snackBar.open('Sector actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm(); // Resetear el formulario después de actualizar
        })
        .catch(error => {
          console.error('Error al actualizar el sector: ', error);
        });
    } else {
      // Agregar nuevo sector
      this.sectoresService.addSector(this.newSector, this.selectedFile || undefined)
        .then(() => {
          this.snackBar.open('Sector agregado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm(); // Resetear el formulario después de agregar
        })
        .catch(error => {
          console.error('Error al agregar el sector: ', error);
        });
    }
  }

  // Resetear el formulario completamente, incluyendo la imagen
  resetForm() {
    this.newSector = new Sectores('', '', null, []);  // Resetear los valores del sector
    this.selectedFile = null;                        // Resetear el campo de archivo (imagen)
    this.isEditing = false;
    this.editingSectorId = null;
    this.diaSeleccionado = '';                       // Resetear día seleccionado
    this.resetHorarios();                            // Reiniciar los horarios disponibles
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';                          // Resetear el campo de archivo visualmente
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
