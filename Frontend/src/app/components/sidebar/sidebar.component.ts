import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { UIStateService } from '../../services/ui-state.service';
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() songSelected = new EventEmitter<any>();

  playlists: any[] = [];
  user: any = null;

  isPlaylistsOpen = false;
  isProfileOpen = false;
  isOpen = false;

  private subs = new Subscription();

  readonly defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private uiState: UIStateService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadPlaylists();
    this.subs.add(this.uiState.sidebarOpen$.subscribe(v => this.isOpen = v));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  close(): void { this.uiState.close(); }

  loadUser(): void {
    const stored = localStorage.getItem('user');
    this.user = stored ? JSON.parse(stored) : null;
  }

  get esCantante(): boolean {
    return this.user?.rol === 'cantante' || this.user?.rol === 'administrador';
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().pipe(
      catchError(() => of([]))
    ).subscribe(data => {
      this.playlists = Array.isArray(data) ? data : [];
    });
  }

  goToPlaylist(id: string): void {
    this.router.navigate(['/playlist', id]);
    this.isPlaylistsOpen = false;
    this.close();
  }

  togglePlaylists(): void {
    this.isPlaylistsOpen = !this.isPlaylistsOpen;
    if (this.isPlaylistsOpen) this.isProfileOpen = false;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) this.isPlaylistsOpen = false;
  }
}
