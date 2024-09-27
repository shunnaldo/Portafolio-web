import { Horario } from './horario.models';

export class Sectores {
  idSector: string;
  nombre: string;
  image: string | null;
  description?: string;
  horarios: Horario[];
  capacidad?: number;

  constructor(
    idSector: string,
    nombre: string,
    image: string | null,
    horarios: Horario[],
    description?: string,
    capacidad?: number
  ) {
    this.idSector = idSector;
    this.nombre = nombre;
    this.image = image;
    this.horarios = horarios;
    this.description = description;
    this.capacidad = capacidad;
  }
}
