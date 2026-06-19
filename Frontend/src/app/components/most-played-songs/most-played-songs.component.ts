import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cancion } from '../../models/cancion.model';

@Component({
  selector: 'app-most-played-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './most-played-songs.component.html',
  styleUrls: ['./most-played-songs.component.css']
})
export class MostPlayedSongsComponent {
  @Input() songs: Cancion[] = [];
  @Output() songSelected = new EventEmitter<Cancion>();
}
