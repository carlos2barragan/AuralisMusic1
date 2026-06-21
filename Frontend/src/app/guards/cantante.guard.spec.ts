import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CantanteGuard } from './cantante.guard';

describe('CantanteGuard', () => {
  let guard: CantanteGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [CantanteGuard],
    });
    guard = TestBed.inject(CantanteGuard);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if no token', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login if no user data', () => {
    localStorage.setItem('user_token', 'tok');
    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to home if user is usuario', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'usuario' }));
    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should allow access for cantante role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'cantante' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should allow access for administrador role', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: 'administrador' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should redirect to login if user JSON is malformed', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', 'BAD_JSON');
    const navigateSpy = spyOn(router, 'navigate');
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle role with extra spaces', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('user', JSON.stringify({ rol: ' cantante ' }));
    const result = guard.canActivate();
    expect(result).toBeTrue();
  });
});
