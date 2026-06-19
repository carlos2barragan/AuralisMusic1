import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../../services/song.service';
import { HeaderComponent } from "../../components/header/header.component";
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subir-cancion',
  standalone: true,
  templateUrl: './subir-cancion.component.html',
  styleUrls: ['./subir-cancion.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent]
})
export class SubirCancionComponent implements OnInit {
  cancionForm: FormGroup;
  cargando: boolean = false;
  mensaje: string = '';
  archivoCancion: File | null = null;
  archivoImagen: File | null = null;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router,
    private alert: AlertService
  ) {
    this.cancionForm = this.fb.group({
      cantante: ['', Validators.required],
      cancion: ['', Validators.required],
      album: ['', Validators.required],
      genero: ['', Validators.required]
    });
  }

  ngOnInit() {}

  seleccionarArchivo(event: any, tipo: 'song' | 'image') {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.mensaje = `El archivo ${file.name} es demasiado grande.`;
      return;
    }

    if (tipo === 'song' && !file.type.startsWith('audio/')) {
      this.mensaje = 'El archivo seleccionado no es un audio válido.';
      return;
    }

    if (tipo === 'image' && !file.type.startsWith('image/')) {
      this.mensaje = 'El archivo seleccionado no es una imagen válida.';
      return;
    }

    if (tipo === 'song') {
      this.archivoCancion = file;
    } else {
      this.archivoImagen = file;
    }
  }

  subirCancion() {
    if (this.cancionForm.invalid || !this.archivoCancion) {
      this.alert.warning('Campos incompletos', 'Por favor, completa todos los campos y selecciona una canción.');
      return;
    }

    const formData = new FormData();
    formData.append('cantante', this.cancionForm.get('cantante')?.value);
    formData.append('cancion', this.cancionForm.get('cancion')?.value);
    formData.append('album', this.cancionForm.get('album')?.value);
    formData.append('genero', this.cancionForm.get('genero')?.value);
    formData.append('song', this.archivoCancion!);

    if (this.archivoImagen) {
      formData.append('imageCover', this.archivoImagen);
    }

    this.cargando = true;

    this.songService.subirCancion(formData).subscribe({
      next: () => {
        this.alert.success('¡Canción subida!', 'La canción se publicó correctamente.')
          .then(() => this.router.navigate(['/home']));
        this.cancionForm.reset();
        this.archivoCancion = null;
        this.archivoImagen = null;
        this.cargando = false;
      },
      error: () => {
        this.alert.error('Error al subir', 'Hubo un problema al subir la canción. Intenta nuevamente.');
        this.cargando = false;
      },
    });
  }
}
