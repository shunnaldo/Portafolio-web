export class Horario {
  dia: string;
  inicio: string;
  fin: string;
  disponible: boolean;
  fechasReservadas?: string[];

  constructor(dia: string, inicio: string, fin: string, disponible: boolean) {
    this.dia = dia;
    this.inicio = inicio;
    this.fin = fin;
    this.disponible = disponible;
  }
}
