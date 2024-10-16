import { Horario } from './horario.models';

export class Sectores {
  idSector: string;
  nombre: string;
  image: string | null;
  horarios: Horario[];
  visible: boolean;
  visibleVer:string;
  description?: string;
  capacidad?: number;

  constructor(
    idSector: string,
    nombre: string,
    image: string | null,
    horarios: Horario[],
    visible: boolean,
    visibleVer: string = 'privado',
    description?: string,
    capacidad?: number
  ) {
    this.idSector = idSector;
    this.nombre = nombre;
    this.image = image;
    this.horarios = horarios;
    this.visible = visible;
    this.visibleVer = visibleVer;
    this.description = description;
    this.capacidad = capacidad;
  }
}
