import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { CommonModule } from '@angular/common';
import { PlaylistSongsComponent } from '../../components/playlist-songs/playlist-songs.component';

@Component({
  selector: 'app-playlist-user',
  templateUrl: './playlist-user.component.html',
  styleUrls: ['./playlist-user.component.css'],
  standalone: true,
  imports: [CommonModule, PlaylistSongsComponent]
})
export class PlaylistUserComponent implements OnInit {
  @Input() playlist: any = null;
  canciones: any[] = [];
  currentSong: any = null;
  showMusicPlayer = false;

  constructor(
    private route: ActivatedRoute,
    private songService: SongService,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistId = this.route.snapshot.paramMap.get('id');
    if (playlistId) {
      this.cargarPlaylist(playlistId);
    }
  }

  cargarPlaylist(id: string) {
    this.playlistService.getPlaylist(id).subscribe({
      next: (data) => {
        if (!data || typeof data !== 'object') return;
        this.playlist = data;
        this.canciones = Array.isArray(data.canciones) ? data.canciones : [];
      },
      error: () => {}
    });
  }

  playSong(song: any) {
    if (!song?.fileUrl) return;
    this.currentSong = song;
    this.showMusicPlayer = true;
    this.songService.setCurrentSong(song);
  }
}
