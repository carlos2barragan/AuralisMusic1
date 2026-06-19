import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';
import { SongService } from '../../services/song.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, HeaderComponent, PlaylistComponent, SidebarComponent, MusicPlayerComponent, RouterModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  playlist: any = null;
  defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private userService: UserService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.fetchUserProfile();
  }

  esCantante(): boolean {
    return this.user?.rol === 'cantante';
  }

  fetchUserProfile(): void {
    if (!this.user?._id) return;

    this.userService.fetchUserProfile(this.user._id).subscribe({
      next: (response) => {
        if (!response) return;
        this.user = response;
        localStorage.setItem('user', JSON.stringify(this.user));
        if (Array.isArray(response.playlists)) {
          this.cargarPlaylists(response.playlists);
        }
      },
      error: () => {}
    });
  }

  cargarPlaylists(playlistIds: any[]): void {
    if (!playlistIds?.length) { this.playlist = []; return; }
    const validIds = playlistIds
      .map(p => typeof p === 'string' ? p : p?._id)
      .filter(Boolean);
    if (!validIds.length) { this.playlist = []; return; }
    Promise.all(validIds.map(id => this.playlistService.getPlaylist(id).toPromise()))
      .then(playlists => { this.playlist = playlists; })
      .catch(() => {});
  }

  private loadUserFromLocalStorage(): void {
    const stored = localStorage.getItem('user');
    if (stored) this.user = JSON.parse(stored);
  }

  playSong(song: any): void {
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
  }

  sendRequest(): void {
    if (!this.user?._id) {
      Swal.fire('Error', 'No se encontró el usuario.', 'error');
      return;
    }
    Swal.fire({
      title: 'Procesando solicitud...',
      text: 'Esto puede tardar unos segundos.',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });
    this.userService.updateUserRole(this.user._id, 'cantante').subscribe({
      next: () => {
        this.user.rol = 'cantante';
        localStorage.setItem('user', JSON.stringify(this.user));
        Swal.fire('¡Felicidades!', 'Ahora eres cantante.', 'success');
      },
      error: () => { Swal.fire('Error', 'Hubo un error al enviar la solicitud.', 'error'); }
    });
  }
}
