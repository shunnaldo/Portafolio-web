import { Component } from '@angular/core';
import { SectoresService } from 'src/app/services/sectores.service';
import { sectores } from 'src/app/models/sectores.models';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent {
  newSector: sectores = new sectores('', '', null, [], '', 0);
  selectedFile: File | null = null;
  horarioInput: string = '';

  constructor(private sectoresService: SectoresService) { }

  addSector() {
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

  resetForm() {
    this.newSector = new sectores('', '', null, [], '', 0);
    this.selectedFile = null;
    this.horarioInput = '';
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

  // Método para eliminar un horario
  removeHorario(index: number) {
    this.newSector.horarios.splice(index, 1); // Elimina el horario en el índice dado
  }
}
