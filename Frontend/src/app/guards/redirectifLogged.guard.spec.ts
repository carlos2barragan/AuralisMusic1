import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { redirectIfLogged } from './redirectifLogged.guard';

describe('redirectIfLogged guard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  const runGuard = () => TestBed.runInInjectionContext(() => redirectIfLogged());

  it('should return true if no token (allows access to login/register)', () => {
    expect(runGuard()).toBeTrue();
  });

  it('should return false and navigate to home if token exists', () => {
    localStorage.setItem('user_token', 'valid_token');
    const navigateSpy = spyOn(router, 'navigate');
    const result = runGuard();
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
