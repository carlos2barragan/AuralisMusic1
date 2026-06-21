import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { PlaylistService } from '../../services/playlist.service';
import { SongService } from '../../services/song.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UIStateService } from '../../services/ui-state.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let playlistServiceSpy: jasmine.SpyObj<PlaylistService>;
  let songServiceSpy: jasmine.SpyObj<SongService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  const mockUser = { _id: 'u1', nombre: 'Carlos', email: 'carlos@test.com', rol: 'usuario', playlists: [] };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['fetchUserProfile', 'getStats', 'updateProfile', 'changePassword', 'updateConfig', 'updateUserRole']);
    playlistServiceSpy = jasmine.createSpyObj('PlaylistService', ['getPlaylist', 'getPlaylists']);
    songServiceSpy = jasmine.createSpyObj('SongService', ['setCurrentSong', 'setIsPlaying', 'getCanciones'], {
      currentSong$: of(null),
      isPlaying$: of(false),
    });
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['notify', 'success', 'error', 'warning', 'loading', 'confirm']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogged', 'getToken', 'getUserId'], {
      isLogged$: of(false),
    });
    const uiStateSpy = jasmine.createSpyObj('UIStateService', ['toggle'], { sidebarOpen$: of(false) });

    playlistServiceSpy.getPlaylists.and.returnValue(of([]));
    userServiceSpy.fetchUserProfile.and.returnValue(of(mockUser));
    userServiceSpy.getStats.and.returnValue(of({ total: 5, favGenero: 'regueton', favArtista: 'Feid', artTopCount: 3, tiempoMinutos: 18, artistasUnicos: 2, numPlaylists: 0, recientes: [], genreChart: [] }));
    userServiceSpy.updateProfile.and.returnValue(of(mockUser));
    userServiceSpy.changePassword.and.returnValue(of({ message: 'ok' }));
    userServiceSpy.updateConfig.and.returnValue(of(mockUser));
    userServiceSpy.updateUserRole.and.returnValue(of({ message: 'Rol actualizado' }));
    alertServiceSpy.confirm.and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    songServiceSpy.getCanciones.and.returnValue(of([]));

    localStorage.setItem('user', JSON.stringify(mockUser));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: PlaylistService, useValue: playlistServiceSpy },
        { provide: SongService, useValue: songServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UIStateService, useValue: uiStateSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from localStorage on init', () => {
    expect(component.user._id).toBe('u1');
  });

  it('should initialize profileForm with user data', () => {
    expect(component.profileForm.value.nombre).toBe('Carlos');
    expect(component.profileForm.value.email).toBe('carlos@test.com');
  });

  it('should change active section', () => {
    component.setSection('stats');
    expect(component.activeSection).toBe('stats');
  });

  it('should load stats when section is stats', () => {
    component.stats = null;
    component.setSection('stats');
    expect(userServiceSpy.getStats).toHaveBeenCalledWith('u1');
  });

  it('should not load stats if already loaded', () => {
    component.stats = { total: 1 };
    userServiceSpy.getStats.calls.reset();
    component.setSection('stats');
    expect(userServiceSpy.getStats).not.toHaveBeenCalled();
  });

  it('esCantante should return false for usuario role', () => {
    component.user = { ...mockUser, rol: 'usuario' };
    expect(component.esCantante()).toBeFalse();
  });

  it('esCantante should return true for cantante role', () => {
    component.user = { ...mockUser, rol: 'cantante' };
    expect(component.esCantante()).toBeTrue();
  });

  it('esCantante should return true for administrador role', () => {
    component.user = { ...mockUser, rol: 'administrador' };
    expect(component.esCantante()).toBeTrue();
  });

  it('should call updateProfile on saveProfile when form is valid', () => {
    component.profileForm.setValue({ nombre: 'Carlos', email: 'carlos@test.com', avatar: '' });
    component.saveProfile();
    expect(userServiceSpy.updateProfile).toHaveBeenCalled();
  });

  it('should not call updateProfile if form is invalid', () => {
    component.profileForm.setValue({ nombre: '', email: 'bad-email', avatar: '' });
    userServiceSpy.updateProfile.calls.reset();
    component.saveProfile();
    expect(userServiceSpy.updateProfile).not.toHaveBeenCalled();
  });

  it('should call updateConfig on saveConfig', () => {
    component.saveConfig();
    expect(userServiceSpy.updateConfig).toHaveBeenCalledWith('u1', component.config);
  });

  it('formatTime should return min for values < 60', () => {
    expect(component.formatTime(45)).toBe('45 min');
  });

  it('formatTime should return hours for values >= 60', () => {
    expect(component.formatTime(90)).toBe('1h 30min');
    expect(component.formatTime(120)).toBe('2h');
  });

  it('formatTime should return 0 min for falsy value', () => {
    expect(component.formatTime(0)).toBe('0 min');
  });

  it('getStatPercent should return 0 if no genreChart', () => {
    component.stats = null;
    expect(component.getStatPercent(5)).toBe(0);
  });

  it('getStatPercent should calculate percentage correctly', () => {
    component.stats = { genreChart: [{ nombre: 'regueton', count: 10 }] };
    expect(component.getStatPercent(5)).toBe(50);
  });

  it('should call playSong on songService', () => {
    const song = { _id: 's1', titulo: 'CRUZ' };
    component.playSong(song);
    expect(songServiceSpy.setCurrentSong).toHaveBeenCalledWith(song as any);
    expect(songServiceSpy.setIsPlaying).toHaveBeenCalledWith(true);
  });
});
