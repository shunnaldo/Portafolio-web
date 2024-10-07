export class eventos {
  idEventosAdmin: string;
  idSector: string;
  titulo: string;
  descripcion: string;
  creator: string;
  status: boolean;
  image: string;  // Campo para la URL de la imagen

  constructor(
    idEventosAdmin: string,
    idSector: string,
    titulo: string,
    descripcion: string,
    creator: string,
    status: boolean,
    image: string  // Incluir la imagen en el constructor
  ) {
    this.idEventosAdmin = idEventosAdmin;
    this.idSector = idSector;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.creator = creator;
    this.status = status;
    this.image = image;
  }
}
