import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'edad', 'photo', 'acciones'];
 // Las columnas a mostrar en la tabla
  usuarioForm: FormGroup;
  dataSource = new MatTableDataSource<any>();
  users: any[] = []; // Arreglo que contendrá los usuarios
  isEditMode: boolean = false;
  userIdEditando: string | null = null;

  constructor(private firestore: Firestore) {
    // Inicializamos el formulario
    this.usuarioForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'edad': new FormControl('', Validators.required),
      'photo': new FormControl('') // Campo de foto, por si deseas manejar la URL
    });

    // Obtenemos la lista de usuarios desde Firestore
    const usersCollection = collection(this.firestore, 'Users');
    collectionData(usersCollection, { idField: 'id' }).subscribe(
      (data) => {
        this.users = data; // Asignamos los datos a la variable users
        this.dataSource.data = data; // Asignar datos a dataSource
        console.log(this.users); // Verifica que los datos se carguen correctamente
      },
      (error) => {
        console.error('Error al obtener usuarios:', error); // Maneja el error
      }
    );

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = `${data.name} ${data.email}`.toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  ngOnInit(): void { }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Aplicar filtro en minúsculas
  }

  // Guardar (Agregar o Actualizar)
  guardarUsuario(): void {
    const { name, email, edad, photo } = this.usuarioForm.value;
    const usersCollection = collection(this.firestore, 'Users');

    if (this.isEditMode && this.userIdEditando) {
      // Actualizar usuario existente
      const userDoc = doc(this.firestore, `Users/${this.userIdEditando}`);
      updateDoc(userDoc, { name, email, edad, photo }).then(() => {
        this.cancelarEdicion();
      });
    } else {
      // Agregar nuevo usuario
      addDoc(usersCollection, { name, email, edad, photo }).then(() => {
        this.usuarioForm.reset();
      });
    }
  }

  // Editar usuario
  editarUsuario(usuario: any): void {
    this.isEditMode = true;
    this.userIdEditando = usuario.id;
    this.usuarioForm.patchValue({ 
      name: usuario.name, 
      email: usuario.email, 
      edad: usuario.edad, 
      photo: usuario.photo 
    });
  }

  // Eliminar usuario
  eliminarUsuario(userId: string): void {
    const userDoc = doc(this.firestore, `Users/${userId}`);
    deleteDoc(userDoc);
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.isEditMode = false;
    this.userIdEditando = null;
    this.usuarioForm.reset();
  }

  // Maneja errores de imagen para mostrar una imagen por defecto.
  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = 'assets/images/default-user.png'; // Imagen por defecto.
  }

}
