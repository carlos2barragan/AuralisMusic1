import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-random-song-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './random-song-list.component.html',
  styleUrls: ['./random-song-list.component.css']
})
export class RandomSongListComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  songs: any[] = [];
  playlists: any[] = [];
  showModal = false;
  newPlaylistName = '';
  selectedPlaylistSong: any = null;
  user: any = null;  // ✅ Guarda el usuario en memoria

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit() {
    this.fetchSongs();
    this.fetchPlaylists();
    this.user = JSON.parse(localStorage.getItem('user') || 'null'); // ✅ Carga solo una vez
  }

  fetchSongs() {
    this.songService.getCanciones().subscribe({
      next: (data) => {
        this.songs = data.filter(song => song.fileUrl);
      },
      error: () => {}
    });
  }
  
  fetchPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data || [];
      },
      error: () => {}
    });
  }

  selectSong(song: any) {
    this.songSelected.emit(song);
  }

  addToPlaylist(song: any) {
    if (!this.user || !this.user._id) {
      return this.showAlert('warning', 'Inicia sesión', 'Debes iniciar sesión para agregar canciones.');
    }
    this.selectedPlaylistSong = song;
    this.showModal = true;
  }

  confirmAddToPlaylist(playlistId: string) {
    if (!playlistId || !this.selectedPlaylistSong) return;

    this.playlistService.addSongToPlaylist(playlistId, this.selectedPlaylistSong).subscribe({
      next: () => {
        this.showAlert('success', '✅ Canción agregada', 'La canción se añadió a la playlist.');
        this.closeModal();
      },
      error: () => {}
    });
  }

  createNewPlaylist() {
    if (!this.newPlaylistName.trim()) {
      return this.showAlert('warning', '⚠️ Nombre vacío', 'Debes escribir un nombre para la playlist.');
    }
    if (!this.user || !this.user._id) {
      return this.showAlert('error', '⚠️ No autorizado', 'Debes iniciar sesión para crear una playlist.');
    }

    const newPlaylist = {
      nombre: this.newPlaylistName.trim(),
      creadoPor: this.user._id,
      canciones: [this.selectedPlaylistSong._id]
    };

    this.playlistService.createPlaylist(newPlaylist).subscribe({
      next: () => {
        this.showAlert('success', '🎵 Playlist creada', 'La playlist se creó y la canción fue añadida.');
        this.fetchPlaylists();
        this.closeModal();
      },
      error: () => {}
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedPlaylistSong = null;
    this.newPlaylistName = '';
  }

  private showAlert(icon: any, title: string, text: string) {
    Swal.fire({ icon, title, text, confirmButtonColor: '#3085d6' });
  }
}

