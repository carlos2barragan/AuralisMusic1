import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private apiUrl = `${environment.apiUrl}/Api/solicitudes`;

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('user_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
  }

  enviar(userId: string, mensaje = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}`, { mensaje }, { headers: this.headers() });
  }

  miSolicitud(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`, { headers: this.headers() });
  }

  listar(estado?: string): Observable<any[]> {
    const params = estado ? `?estado=${estado}` : '';
    return this.http.get<any[]>(`${this.apiUrl}${params}`, { headers: this.headers() });
  }

  aceptar(solicitudId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${solicitudId}/aceptar`, {}, { headers: this.headers() });
  }

  rechazar(solicitudId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${solicitudId}/rechazar`, {}, { headers: this.headers() });
  }
}
