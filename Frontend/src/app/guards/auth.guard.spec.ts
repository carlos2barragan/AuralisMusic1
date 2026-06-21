import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard],
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return false and redirect to login if no token', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('should return false and redirect if token exists but user data is missing', () => {
    localStorage.setItem('user_token', 'tok');
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('should return false if user has no valid role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'unknown_role' }));
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('should return true for usuario role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'usuario' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should return true for cantante role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'cantante' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should return true for administrador role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'administrador' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should redirect to login if user JSON is malformed', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', 'NOT_VALID_JSON');
    const navigateSpy = spyOn(router, 'navigateByUrl');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});
