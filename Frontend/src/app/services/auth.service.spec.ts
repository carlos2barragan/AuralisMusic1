import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setToken should store token and emit true', () => {
    let emitted: boolean | undefined;
    service.isLogged$.subscribe(v => (emitted = v));

    service.setToken('my_token');

    expect(localStorage.getItem('user_token')).toBe('my_token');
    expect(emitted).toBeTrue();
  });

  it('removeToken should clear storage and emit false', () => {
    localStorage.setItem('user_token', 'tok');
    localStorage.setItem('userId', 'u1');
    localStorage.setItem('user', '{}');

    let emitted: boolean | undefined;
    service.isLogged$.subscribe(v => (emitted = v));
    service.removeToken();

    expect(localStorage.getItem('user_token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(emitted).toBeFalse();
  });

  it('getToken should return stored token', () => {
    localStorage.setItem('user_token', 'abc123');
    expect(service.getToken()).toBe('abc123');
  });

  it('getToken should return null when no token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('isLogged should return true when token exists', () => {
    localStorage.setItem('user_token', 'tok');
    expect(service.isLogged()).toBeTrue();
  });

  it('isLogged should return false when no token', () => {
    expect(service.isLogged()).toBeFalse();
  });

  it('getUserId should return stored userId', () => {
    localStorage.setItem('userId', 'user_123');
    expect(service.getUserId()).toBe('user_123');
  });

  it('logout should clear token and navigate to login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    localStorage.setItem('user_token', 'tok');

    service.logout();

    expect(localStorage.getItem('user_token')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('login should store token and user on success', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const mockResponse = {
      token: 'jwt_token',
      user: { _id: 'u1', nombre: 'Carlos', email: 'c@test.com', rol: 'usuario' },
    };

    service.login('c@test.com', '123456').subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/login'));
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('user_token')).toBe('jwt_token');
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('login should throw error on failure', (done) => {
    service.login('bad@test.com', 'wrong').subscribe({
      error: (err) => {
        expect(err.message).toBeTruthy();
        done();
      },
    });

    const req = httpMock.expectOne((r) => r.url.includes('/login'));
    req.flush({ message: 'Credenciales incorrectas.' }, { status: 401, statusText: 'Unauthorized' });
  });
});
