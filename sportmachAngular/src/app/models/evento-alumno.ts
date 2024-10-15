export class eventosAlumnos {
  idEventosAlumnos: string;
  idSector: string;
  titulo: string;
  descripcion: string;
  espera: boolean;
  image: string;
  fechaReservada: string;
  hora?: string;
  sectorNombre?: string;
  capacidadAlumnos?: number;

  constructor(
    idEventosAlumnos: string = '',
    idSector: string = '',
    titulo: string = '',
    descripcion: string = '',
    espera: boolean = false,
    image: string = '',
    fechaReservada: string = '',
    hora?: string,
    sectorNombre?: string,
    capacidadAlumnos?: number
  ) {
    this.idEventosAlumnos = idEventosAlumnos;
    this.idSector = idSector;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.espera = espera;
    this.image = image;
    this.fechaReservada = fechaReservada;
    this.hora = hora;
    this.sectorNombre = sectorNombre;
    this.capacidadAlumnos = capacidadAlumnos;
  }
}
