import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MusicPlayerComponent } from '../../components/music-player/music-player.component';
import { RandomSongListComponent } from '../../components/random-song-list/random-song-list.component';
import { MostPlayedSongsComponent } from '../../components/most-played-songs/most-played-songs.component';
import { RecentSongsComponent } from '../../components/recent-songs/recent-songs.component';
import { SongService } from '../../services/song.service';
import { Cancion } from '../../models/cancion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    MusicPlayerComponent,
    RandomSongListComponent,
    MostPlayedSongsComponent,
    RecentSongsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentSong: Cancion | null = null;
  isPlaying = false;
  showMusicPlayer = false;
  selectedArtist: { nombre: string; avatar: string } | null = null;
  mostPlayedSongs: Cancion[] = [];
  recentSongs: Cancion[] = [];

  constructor(private songService: SongService) {}

  ngOnInit() {
    this.songService.getMostPlayedSongs().subscribe(songs => this.mostPlayedSongs = songs);
    this.songService.getRecentSongs().subscribe(songs => this.recentSongs = songs);
  }

  playSong(song: Cancion) {
    if (!song) return;
    this.currentSong = song;
    this.isPlaying = true;
    this.showMusicPlayer = true;
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);

    this.selectedArtist = {
      nombre: song.cantante?.cantante || 'Artista desconocido',
      avatar: song.cantante?.avatar || 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp',
    };
  }

  playRandomSong() {
    const all = [...this.mostPlayedSongs, ...this.recentSongs];
    if (all.length === 0) return;
    let song: Cancion;
    do {
      song = all[Math.floor(Math.random() * all.length)];
    } while (song === this.currentSong && all.length > 1);
    this.playSong(song);
  }

  onSongSelected(song: Cancion) {
    this.playSong(song);
  }

  get avatarUrl(): string {
    return this.selectedArtist?.avatar || 'https://res.cloudinary.com/dbt58u6ag/image/upload/v1740604204/uploads/afo3nyrvyhmn330lq0np.webp';
  }
}
