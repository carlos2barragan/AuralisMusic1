import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CantanteGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('user_token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);
      const rol = parsedUser.rol?.trim().toLowerCase();

      if (rol !== 'cantante' && rol !== 'administrador') {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
