import { Horario } from './horario.models';

export class Sectores {
  idSector: string;
  nombre: string;
  image: string | null;
  horarios: Horario[];
  selectedHorarios: Horario[] = [];
  visible: boolean;
  visibleVer:string;
  hora?: string; // Esta es la propiedad existente
  horas?: string[];
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
    capacidad?: number,
    horas?: string[]
  ) {
    this.idSector = idSector;
    this.nombre = nombre;
    this.image = image;
    this.horarios = horarios;
    this.visible = visible;
    this.visibleVer = visibleVer;
    this.description = description;
    this.capacidad = capacidad;
    this.horas = horas || [];

  }
}
