import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpotifyService, SpotifyPlaylist, SpotifyTrack } from '../../services/spotify.service';
import { PlaylistService } from '../../services/playlist.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-spotify-import',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './spotify-import.component.html',
  styleUrls: ['./spotify-import.component.css'],
})
export class SpotifyImportComponent implements OnInit {
  connected = false;
  loadingSession = true;
  playlists: SpotifyPlaylist[] = [];
  loadingPlaylists = false;

  selectedPlaylist: SpotifyPlaylist | null = null;
  tracks: SpotifyTrack[] = [];
  loadingTracks = false;
  importingId: string | null = null;

  constructor(
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService,
    private authService: AuthService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.spotifyService.checkSession().subscribe({
      next: ({ connected }) => {
        this.connected = connected;
        this.loadingSession = false;
        if (connected) this.loadPlaylists();
      },
      error: () => { this.loadingSession = false; }
    });
  }

  connectSpotify(): void {
    const userId = this.authService.getUserId() || '';
    this.spotifyService.connectSpotify(userId);
  }

  disconnect(): void {
    this.spotifyService.disconnect().subscribe(() => {
      this.connected = false;
      this.playlists = [];
      this.selectedPlaylist = null;
      this.tracks = [];
    });
  }

  loadPlaylists(): void {
    this.loadingPlaylists = true;
    this.spotifyService.getUserPlaylists().subscribe({
      next: playlists => { this.playlists = playlists; this.loadingPlaylists = false; },
      error: () => { this.loadingPlaylists = false; }
    });
  }

  selectPlaylist(playlist: SpotifyPlaylist): void {
    this.selectedPlaylist = playlist;
    this.loadingTracks = true;
    this.tracks = [];

    this.spotifyService.getPlaylistTracks(playlist.id).subscribe({
      next: tracks => { this.tracks = tracks; this.loadingTracks = false; },
      error: () => { this.loadingTracks = false; }
    });
  }

  importPlaylist(): void {
    if (!this.selectedPlaylist) return;
    const userId = this.getUserId();
    if (!userId) { this.alert.error('Error', 'No se encontró el usuario.'); return; }

    this.importingId = this.selectedPlaylist.id;
    this.alert.loading('Importando playlist...');

    const playlistData = {
      nombre: this.selectedPlaylist.nombre,
      creadoPor: userId,
      canciones: this.tracks.map(t => t.titulo),
      origenSpotify: true,
      imagenSpotify: this.selectedPlaylist.imagen,
    };

    this.playlistService.guardarPlaylist(playlistData).subscribe({
      next: () => {
        this.alert.success('¡Importada!', `La playlist "${this.selectedPlaylist!.nombre}" se importó a Auralis.`);
        this.importingId = null;
      },
      error: () => {
        this.alert.error('Error', 'No se pudo importar la playlist.');
        this.importingId = null;
      }
    });
  }

  private getUserId(): string | null {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored)._id : null;
    } catch { return null; }
  }

  formatDuration(ms: number): string {
    return this.spotifyService.formatDuration(ms);
  }

  isImporting(): boolean {
    return this.importingId === this.selectedPlaylist?.id;
  }
}
