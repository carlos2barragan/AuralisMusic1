import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ArtistService } from '../../services/artist.service';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';

@Component({
  selector: 'app-artist-info',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.css'],
})
export class ArtistInfoComponent implements OnInit {
  artist: any = null;
  songs: Cancion[] = [];
  currentSong: Cancion | null = null;
  isPlaying = false;
  showPlayer = false;
  loading = true;

  readonly defaultAvatar = 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadArtist(id);
    });

    this.songService.currentSong$.subscribe(s => this.currentSong = s);
    this.songService.isPlaying$.subscribe(p => this.isPlaying = p);
  }

  loadArtist(id: string): void {
    this.loading = true;
    this.artistService.getArtist(id).subscribe({
      next: (data) => {
        this.artist = data;
        this.songs = Array.isArray(data.canciones) ? data.canciones : [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get totalPlays(): number {
    return this.songs.reduce((sum, s: any) => sum + (s.plays || 0), 0);
  }

  get generos(): string[] {
    const g = new Set(this.songs.map((s: any) => s.genero).filter(Boolean));
    return [...g].slice(0, 4);
  }

  playRandom(): void {
    if (!this.songs.length) return;
    const idx = Math.floor(Math.random() * this.songs.length);
    this.playSong(this.songs[idx]);
  }

  playSong(song: Cancion): void {
    this.currentSong = song;
    this.isPlaying = true;
    this.showPlayer = true;
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
  }

  formatPlays(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }

  isCurrentSong(song: Cancion): boolean {
    return this.currentSong?._id === (song as any)._id;
  }
}
