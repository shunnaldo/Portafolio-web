export class eventos {
  idEventosAdmin: string;
  idSector: string;
  titulo: string;
  descripcion: string;
  creator: string;
  status: boolean;
  image: string;
  fechaReservada: string;
  sectorNombre?:string;
  capacidadAlumnos?: number;


  constructor(
    idEventosAdmin: string,
    idSector: string,
    titulo: string,
    descripcion: string,
    creator: string,
    status: boolean,
    image: string ,
    fechaReservada: string
  ) {
    this.idEventosAdmin = idEventosAdmin;
    this.idSector = idSector;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.creator = creator;
    this.status = status;
    this.image = image;
    this.fechaReservada = fechaReservada;
  }
}
