import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventosService } from 'src/app/services/eventos.service';
import { sectores } from 'src/app/models/sectores.models';
import { eventos } from 'src/app/models/eventos.models';
import { SectoresService } from 'src/app/services/sectores.service';
import { Observable, of } from 'rxjs'; // Asegúrate de importar 'of' para inicializar eventos$

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventoForm: FormGroup; // Formulario reactivo para el evento
  sectores$: Observable<sectores[]>; // Lista de sectores para seleccionar
  selectedFile: File | null = null; // Imagen seleccionada
  isLoading: boolean = false; // Bandera para manejar el estado de carga

  eventos$: Observable<eventos[]> = of([]); // Inicialización con un observable vacío

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private sectoresService: SectoresService
  ) {
    // Inicializamos el formulario con los campos necesarios
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      creator: ['', Validators.required],
      status: [false, Validators.required],
      date: ['', Validators.required],
      idSector: ['', Validators.required] // Sector relacionado con el evento
    });

    // Inicializamos el observable para sectores
    this.sectores$ = this.sectoresService.getSectores();
  }

  ngOnInit(): void {
    // Cargar los sectores cuando el componente se inicialice
    this.sectores$ = this.sectoresService.getSectores();

    // Cargar los eventos al inicializar
    this.eventos$ = this.eventosService.getEventos();
  }

  // Método para manejar la selección de archivos
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Método para crear un nuevo evento
  createEvento() {
    if (this.eventoForm.valid && this.selectedFile) {
      this.isLoading = true; // Activar el estado de carga
      const newEvento: eventos = {
        ...this.eventoForm.value,
        idEventosAdmin: '', // Se asignará en el servicio
        date: new Date(this.eventoForm.value.date)
      };

      // Crear el evento en Firestore
      this.eventosService.createEvento(newEvento)
        .then(() => {
          console.log('Evento creado exitosamente');
          this.resetForm(); // Reiniciar el formulario
        })
        .catch(error => {
          console.error('Error al crear el evento:', error);
        })
        .finally(() => {
          this.isLoading = false; // Desactivar el estado de carga
        });
    } else {
      console.error('El formulario no es válido o no se ha seleccionado ninguna imagen');
    }
  }

  // Reiniciar el formulario después de crear el evento
  resetForm() {
    this.eventoForm.reset();
    this.selectedFile = null;
  }
}
