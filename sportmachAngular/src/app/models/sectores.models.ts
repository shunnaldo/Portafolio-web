export class sectores{

  idSector: string;
  nombre: string;
  image: File | null;
  description?: string;
  horario: string;
  capacidad?: number;


  constructor(idSector: string, nombre: string, image: File | null, horario: string, description?: string, capacidad?:number) {
    this.idSector = idSector;
    this.nombre = nombre;
    this.image = image;
    this.horario = horario;
    this.description = description;
    this.capacidad = capacidad;
  }


}
