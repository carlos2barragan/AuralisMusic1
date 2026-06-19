import { Component, EventEmitter, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() songSelected = new EventEmitter<any>();

  searchQuery = '';
  songs: any[] = [];
  filteredSongs: any[] = [];
  playlists: any[] = [];
  user: any = null;

  isSearchOpen = false;
  isPlaylistsOpen = false;
  isProfileOpen = false;

  readonly defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSongs();
    this.loadUser();
    this.loadPlaylists();
  }

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

  getSongs(): void {
    this.songService.getCanciones().subscribe({
      next: data => {
        this.songs = data;
        this.filteredSongs = [...this.songs];
      },
      error: () => {}
    });
  }

  filterSongs(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredSongs = q
      ? this.songs.filter(s =>
          s.titulo?.toLowerCase().includes(q) ||
          s.cantante?.cantante?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q)
        )
      : [...this.songs];
  }

  playSong(song: any): void {
    this.songSelected.emit(song);
  }

  goToPlaylist(id: string): void {
    this.router.navigate(['/playlist', id]);
    this.isPlaylistsOpen = false;
  }

  togglePlaylists(): void {
    this.isPlaylistsOpen = !this.isPlaylistsOpen;
    if (this.isPlaylistsOpen) this.isProfileOpen = false;
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    if (this.isProfileOpen) this.isPlaylistsOpen = false;
  }

  openSearch(): void {
    this.isSearchOpen = true;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredSongs = [...this.songs];
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(e: Event): void {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !sidebar.contains(e.target as Node)) {
      this.isSearchOpen = false;
      this.searchQuery = '';
      this.filteredSongs = [...this.songs];
    }
  }
}
