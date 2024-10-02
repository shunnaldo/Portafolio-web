export class eventos{

    idEventosAdmin: string;
    idSector: string;
    titulo: string;
    descripcion: string;
    creator: string;
    status: boolean;
    date: Date;

    constructor( 
        idEventosAdmin:string,
        idSector: string,
        titulo: string,
        descripcion: string,
        creator: string,
        status: boolean,
        date: Date )
        {
        this.idEventosAdmin = idEventosAdmin
        this.idSector = idSector
        this.titulo = titulo
        this.descripcion = descripcion
        this. creator = creator
        this. status = status
        this.date = date
        }

        
}

