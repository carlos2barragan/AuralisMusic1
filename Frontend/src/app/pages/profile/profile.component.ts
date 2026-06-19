import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SongService } from '../../services/song.service';
import { AlertService } from '../../services/alert.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, HeaderComponent, PlaylistComponent, SidebarComponent, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  playlist: any = null;
  defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  activeSection: 'perfil' | 'stats' | 'plan' | 'config' | 'privacidad' = 'perfil';

  stats: any = null;
  statsLoading = false;

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  savingProfile = false;
  savingPassword = false;

  config = { perfilPublico: true, mostrarHistorial: true, notificaciones: true };
  savingConfig = false;

  constructor(
    private playlistService: PlaylistService,
    private userService: UserService,
    private songService: SongService,
    private alert: AlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.fetchUserProfile();
    this.initForms();
  }

  private initForms(): void {
    this.profileForm = this.fb.group({
      nombre: [this.user?.nombre || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      avatar: [this.user?.avatar || ''],
    });
    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required],
    });
    if (this.user?.config) {
      this.config = { ...this.config, ...this.user.config };
    }
  }

  setSection(s: typeof this.activeSection): void {
    this.activeSection = s;
    if (s === 'stats' && !this.stats) this.loadStats();
  }

  esCantante(): boolean {
    return this.user?.rol === 'cantante' || this.user?.rol === 'administrador';
  }

  fetchUserProfile(): void {
    if (!this.user?._id) return;
    this.userService.fetchUserProfile(this.user._id).subscribe({
      next: (response) => {
        if (!response) return;
        this.user = response;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.profileForm?.patchValue({ nombre: this.user.nombre, email: this.user.email, avatar: this.user.avatar || '' });
        if (this.user.config) this.config = { ...this.config, ...this.user.config };
        if (Array.isArray(response.playlists)) this.cargarPlaylists(response.playlists);
      },
      error: () => {}
    });
  }

  cargarPlaylists(playlistIds: any[]): void {
    if (!playlistIds?.length) { this.playlist = []; return; }
    const validIds = playlistIds.map(p => typeof p === 'string' ? p : p?._id).filter(Boolean);
    if (!validIds.length) { this.playlist = []; return; }
    Promise.all(validIds.map(id => this.playlistService.getPlaylist(id).toPromise()))
      .then(pls => { this.playlist = pls; })
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

  loadStats(): void {
    if (!this.user?._id) return;
    this.statsLoading = true;
    this.userService.getStats(this.user._id).subscribe({
      next: (data) => { this.stats = data; this.statsLoading = false; },
      error: () => { this.stats = null; this.statsLoading = false; }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile = true;
    const data = this.profileForm.value;
    this.userService.updateProfile(this.user._id, data).subscribe({
      next: (updated) => {
        this.user = { ...this.user, ...data };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.alert.notify('success', 'Perfil actualizado');
        this.savingProfile = false;
      },
      error: () => {
        this.alert.error('Error', 'No se pudo actualizar el perfil.');
        this.savingProfile = false;
      }
    });
  }

  changePassword(): void {
    const { passwordActual, passwordNueva, passwordConfirm } = this.passwordForm.value;
    if (this.passwordForm.invalid) return;
    if (passwordNueva !== passwordConfirm) {
      this.alert.warning('Contraseñas no coinciden', 'La nueva contraseña y la confirmación deben ser iguales.');
      return;
    }
    this.savingPassword = true;
    this.userService.changePassword(this.user._id, passwordActual, passwordNueva).subscribe({
      next: () => {
        this.alert.notify('success', 'Contraseña actualizada');
        this.passwordForm.reset();
        this.savingPassword = false;
      },
      error: (err) => {
        this.alert.error('Error', err.error?.message || 'No se pudo cambiar la contraseña.');
        this.savingPassword = false;
      }
    });
  }

  saveConfig(): void {
    if (!this.user?._id) return;
    this.savingConfig = true;
    this.userService.updateConfig(this.user._id, this.config).subscribe({
      next: () => {
        this.alert.notify('success', 'Configuración guardada');
        this.savingConfig = false;
      },
      error: () => {
        this.alert.error('Error', 'No se pudo guardar la configuración.');
        this.savingConfig = false;
      }
    });
  }

  sendRequest(): void {
    if (!this.user?._id) { this.alert.error('Error', 'No se encontró el usuario.'); return; }
    this.alert.loading('Procesando solicitud...');
    this.userService.updateUserRole(this.user._id, 'cantante').subscribe({
      next: () => {
        this.user.rol = 'cantante';
        localStorage.setItem('user', JSON.stringify(this.user));
        this.alert.success('¡Felicidades!', 'Ahora eres artista en Auralis.');
      },
      error: () => { this.alert.error('Error', 'Hubo un problema al enviar la solicitud.'); }
    });
  }

  formatTime(min: number): string {
    if (!min) return '0 min';
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

  getStatPercent(count: number): number {
    if (!this.stats?.genreChart?.length) return 0;
    const max = this.stats.genreChart[0]?.count || 1;
    return Math.round((count / max) * 100);
  }
}
