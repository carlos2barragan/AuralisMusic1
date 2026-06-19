import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = `${environment.apiUrl}/Api/Playlist`;
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('user_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
  }

  getPlaylists(): Observable<any[]> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user || !user._id) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<any[]>(`${this.apiUrl}?userId=${user._id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  getPlaylist(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  addSongToPlaylist(playlistId: string, song: any): Observable<any> {
    const body = { canciones: [song._id] };
    return this.http.post<any>(`${this.apiUrl}/${playlistId}`, body, { headers: this.getHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  createPlaylist(playlist: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user?._id) {
      return throwError(() => new Error('ID de usuario no encontrado'));
    }

    const playlistWithUser = { ...playlist, creadoPor: user._id };
    return this.http.post(`${this.apiUrl}`, playlistWithUser, { headers: this.getHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  guardarPlaylist(playlistData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, playlistData, { headers: this.getHeaders() }).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
