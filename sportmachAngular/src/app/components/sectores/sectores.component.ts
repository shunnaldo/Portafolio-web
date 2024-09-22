import { Component } from '@angular/core';
import { SectoresService } from 'src/app/services/sectores.service';
import { sectores } from 'src/app/models/sectores.models';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent {
  newSector: sectores = new sectores('', '', null, '', '', 0);

  constructor(private sectoresService: SectoresService) { }

  addSector() {
    this.sectoresService.addSector(this.newSector)
      .then(() => {
        console.log('Sector agregado exitosamente');
        this.resetForm();
      })
      .catch(error => {
        console.error('Error al agregar el sector: ', error);
      });
  }

  resetForm() {
    this.newSector = new sectores('', '', null, '', '', 0);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newSector.image = file;
    }
  }
}
asas
