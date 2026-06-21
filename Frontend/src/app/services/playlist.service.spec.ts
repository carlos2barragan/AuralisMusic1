import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let httpMock: HttpTestingController;

  const mockPlaylist = { _id: 'p1', nombre: 'Mi Playlist', canciones: [] };
  const mockUser = { _id: 'u1', nombre: 'Carlos', email: 'c@test.com', rol: 'usuario' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlaylistService],
    });
    service = TestBed.inject(PlaylistService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPlaylists should return error if no user in localStorage', (done) => {
    service.getPlaylists().subscribe({
      error: (err) => {
        expect(err.message).toBe('Usuario no autenticado');
        done();
      },
    });
  });

  it('getPlaylists should make GET request with userId', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    service.getPlaylists().subscribe(pls => expect(pls).toEqual([mockPlaylist]));
    const req = httpMock.expectOne((r) => r.url.includes('userId=u1'));
    expect(req.request.method).toBe('GET');
    req.flush([mockPlaylist]);
  });

  it('getPlaylist should make GET request by id', () => {
    service.getPlaylist('p1').subscribe(p => expect(p._id).toBe('p1'));
    const req = httpMock.expectOne((r) => r.url.includes('/Playlist/p1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPlaylist);
  });

  it('addSongToPlaylist should make POST request', () => {
    const song = { _id: 's1', titulo: 'CRUZ' };
    service.addSongToPlaylist('p1', song).subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/Playlist/p1'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ canciones: ['s1'] });
    req.flush({ message: 'ok' });
  });

  it('createPlaylist should return error if no user in localStorage', (done) => {
    service.createPlaylist({ nombre: 'Test' }).subscribe({
      error: (err) => {
        expect(err.message).toBe('ID de usuario no encontrado');
        done();
      },
    });
  });

  it('createPlaylist should make POST request with creadoPor', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    service.createPlaylist({ nombre: 'Nueva' }).subscribe();
    const req = httpMock.expectOne((r) => r.url.endsWith('/Playlist'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.creadoPor).toBe('u1');
    req.flush(mockPlaylist);
  });

  it('guardarPlaylist should make POST request', () => {
    const data = { nombre: 'Test', creadoPor: 'u1', canciones: [] };
    service.guardarPlaylist(data).subscribe();
    const req = httpMock.expectOne((r) => r.url.endsWith('/Playlist'));
    expect(req.request.method).toBe('POST');
    req.flush(mockPlaylist);
  });
});
