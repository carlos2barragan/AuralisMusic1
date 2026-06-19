import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UIStateService } from '../../services/ui-state.service';
import { SongService } from '../../services/song.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  sidebarOpen = false;

  searchQuery = '';
  songs: any[] = [];
  filteredSongs: any[] = [];
  isSearchOpen = false;

  private sub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private uiState: UIStateService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.sub = this.uiState.sidebarOpen$.subscribe(v => this.sidebarOpen = v);
    this.songService.getCanciones().subscribe({ next: d => this.songs = d, error: () => {} });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleSidebar() { this.uiState.toggle(); }

  openSearch(): void { this.isSearchOpen = true; this.filterSongs(); }

  filterSongs(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredSongs = q
      ? this.songs.filter(s =>
          s.titulo?.toLowerCase().includes(q) ||
          s.cantante?.cantante?.toLowerCase().includes(q) ||
          s.album?.toLowerCase().includes(q)
        )
      : [];
  }

  playSong(song: any): void {
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredSongs = [];
    this.isSearchOpen = false;
  }

  logout() {
    this.menuOpen = false;
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    const el = document.querySelector('.header-search');
    if (el && !el.contains(e.target as Node)) {
      this.isSearchOpen = false;
    }
    const menu = document.querySelector('.dropdown');
    if (menu && !menu.contains(e.target as Node)) {
      this.menuOpen = false;
    }
  }
}
