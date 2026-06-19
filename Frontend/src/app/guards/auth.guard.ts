import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('user_token');

    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }

    let userRole: string | null = null;
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userRole = user.rol;
      } catch {
        this.router.navigateByUrl('/login');
        return false;
      }
    }

    const rolesPermitidos = ['administrador', 'usuario', 'cantante'];

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      this.router.navigateByUrl('/login');
      return false;
    }

    return true;
  }
}
