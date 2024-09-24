export class sectores {
  idSector: string;
  nombre: string;
  image: File | null;
  description?: string;
  horarios: string[]; // Asegúrate de que esta propiedad sea un array
  capacidad?: number;

  constructor(idSector: string, nombre: string, image: File | null, horarios: string[], description?: string, capacidad?: number) {
    this.idSector = idSector;
    this.nombre = nombre;
    this.image = image;
    this.horarios = horarios; // Cambia 'horario' por 'horarios'
    this.description = description;
    this.capacidad = capacidad;
  }
}
