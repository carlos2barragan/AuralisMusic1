import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PlaylistComponent } from '../../components/playlist/playlist.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-playlst',
  standalone: true,
  templateUrl: './playlst.component.html',
  styleUrls: ['./playlst.component.css'],
  imports: [CommonModule, HeaderComponent, PlaylistComponent, SidebarComponent]
})
export class Playlst {
  constructor(private songService: SongService) {}

  playSong(song: any): void {
    this.songService.setCurrentSong(song);
    this.songService.setIsPlaying(true);
  }
}
