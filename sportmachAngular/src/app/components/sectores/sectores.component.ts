import { Component } from '@angular/core';
import { SectoresService } from 'src/app/services/sectores.service';
import { sectores } from 'src/app/models/sectores.models';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent {
  sectores$: Observable<sectores[]> = new Observable();
  newSector: sectores = new sectores('', '', null, [], '', 0);
  selectedFile: File | null = null;
  horarioInput: string = '';
  isEditing: boolean = false; // Variable para saber si estamos en modo edición

  constructor(private sectoresService: SectoresService) {}

  ngOnInit(): void {
    this.sectores$ = this.sectoresService.getSectores();
  }

  addSector() {
    if (this.isEditing) {
      // Actualizar sector existente
      this.updateSector();
    } else {
      // Agregar nuevo sector
      if (this.selectedFile) {
        this.newSector.image = this.selectedFile;
        this.sectoresService.addSector(this.newSector)
          .then(() => {
            console.log('Sector agregado exitosamente');
            this.resetForm();
          })
          .catch(error => {
            console.error('Error al agregar el sector: ', error);
          });
      } else {
        console.error('No se ha seleccionado ninguna imagen');
      }
    }
  }

  // Nueva función para editar un sector existente
  editSector(sector: sectores) {
    this.newSector = { ...sector }; // Copiamos los datos del sector seleccionado
    this.isEditing = true; // Cambiar a modo edición
  }

  // Actualizar un sector
  updateSector() {
    this.sectoresService.updateSector(this.newSector.idSector, this.newSector)
      .then(() => {
        console.log('Sector actualizado exitosamente');
        this.resetForm(); // Reiniciar el formulario después de actualizar
        this.isEditing = false; // Salir del modo edición
      })
      .catch(error => {
        console.error('Error al actualizar el sector: ', error);
      });
  }

  resetForm() {
    this.newSector = new sectores('', '', null, [], '', 0);
    this.selectedFile = null;
    this.horarioInput = '';
    this.isEditing = false; // Asegurarse de que se salga del modo edición al reiniciar el formulario
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addHorarios() {
    if (this.horarioInput) {
      const horariosArray = this.horarioInput.split(',').map(h => h.trim());
      this.newSector.horarios.push(...horariosArray);
      this.horarioInput = '';
    }
  }

  removeHorario(index: number) {
    this.newSector.horarios.splice(index, 1);
  }

  deleteSector(idSector: string) {
    this.sectoresService.deleteSector(idSector).then(() => {
      console.log('Sector eliminado');
    }).catch(error => {
      console.error('Error al eliminar el sector: ', error);
    });
  }

}
