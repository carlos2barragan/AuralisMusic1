import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/Api/Usuario`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('user_token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  editProfilePhoto(userId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/avatar`, formData, { headers: this.getHeaders() });
  }
}
