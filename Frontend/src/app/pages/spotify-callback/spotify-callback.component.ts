import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spotify-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css'],
})
export class SpotifyCallbackComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const success = this.route.snapshot.queryParamMap.get('success');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (success === 'true') {
      this.status = 'success';
      this.message = '¡Cuenta de Spotify conectada correctamente!';
      setTimeout(() => this.router.navigate(['/spotify-import']), 2000);
    } else {
      this.status = 'error';
      this.message = error === 'access_denied'
        ? 'Cancelaste la conexión con Spotify.'
        : 'No se pudo conectar con Spotify. Intenta de nuevo.';
    }
  }

  retry(): void {
    this.router.navigate(['/spotify-import']);
  }
}
