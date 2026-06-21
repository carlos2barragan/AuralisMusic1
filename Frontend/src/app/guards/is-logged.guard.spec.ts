import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { isLoggedGuard } from './is-logged.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('isLoggedGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      isLoggedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  it('should return true if token exists', () => {
    localStorage.setItem('user_token', 'valid_token');
    expect(runGuard()).toBeTrue();
  });

  it('should return false and navigate to login if no token', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const result = runGuard();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
