import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('user_token');
    const user = localStorage.getItem('user');
    if (!token || !user) { this.router.navigate(['/login']); return false; }
    try {
      const parsed = JSON.parse(user);
      if (parsed.rol?.trim().toLowerCase() !== 'administrador') {
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
