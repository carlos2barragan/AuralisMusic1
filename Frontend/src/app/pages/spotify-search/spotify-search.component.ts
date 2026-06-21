import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, takeUntil } from 'rxjs';
import { SpotifyService, SpotifyTrack, SpotifyArtist } from '../../services/spotify.service';
import { SongService } from '../../services/song.service';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-spotify-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './spotify-search.component.html',
  styleUrls: ['./spotify-search.component.css'],
})
export class SpotifySearchComponent implements OnDestroy {
  query = '';
  tracks: SpotifyTrack[] = [];
  artists: SpotifyArtist[] = [];
  loading = false;
  searched = false;
  activeTab: 'tracks' | 'artists' = 'tracks';
  previewAudio: HTMLAudioElement | null = null;
  playingId: string | null = null;

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private spotifyService: SpotifyService,
    private songService: SongService
  ) {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(q => {
          if (!q.trim()) { this.tracks = []; this.artists = []; this.searched = false; return of(null); }
          this.loading = true;
          return this.spotifyService.search(q).pipe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: result => {
          this.loading = false;
          if (result) {
            this.tracks = result.tracks;
            this.artists = result.artists;
            this.searched = true;
          }
        },
        error: () => { this.loading = false; }
      });
  }

  onQueryChange(): void {
    this.search$.next(this.query);
  }

  onSearch(): void {
    if (this.query.trim()) this.search$.next(this.query);
  }

  togglePreview(track: SpotifyTrack): void {
    if (!track.preview) return;

    if (this.playingId === track.spotifyId) {
      this.stopPreview();
      return;
    }

    this.stopPreview();
    this.previewAudio = new Audio(track.preview);
    this.previewAudio.play();
    this.playingId = track.spotifyId;
    this.previewAudio.onended = () => { this.playingId = null; };
  }

  stopPreview(): void {
    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio = null;
    }
    this.playingId = null;
  }

  isPlaying(id: string): boolean {
    return this.playingId === id;
  }

  formatDuration(ms: number): string {
    return this.spotifyService.formatDuration(ms);
  }

  formatFollowers(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }

  ngOnDestroy(): void {
    this.stopPreview();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
