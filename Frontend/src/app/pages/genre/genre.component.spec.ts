import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GenreComponent } from './genre.component';
import { SongService } from '../../services/song.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { UIStateService } from '../../services/ui-state.service';

const mockSongs = [
  { _id: 's1', titulo: 'CRUZ', genero: 'reggaeton', imagen: 'img.jpg', cantante: { _id: 'c1', cantante: 'Feid' } },
  { _id: 's2', titulo: 'Tusa', genero: 'pop', imagen: 'img2.jpg', cantante: { _id: 'c2', cantante: 'Karol G' } },
  { _id: 's3', titulo: 'Yandel 150', genero: 'reggaeton', imagen: 'img3.jpg', cantante: { _id: 'c3', cantante: 'Yandel' } },
];

describe('GenreComponent', () => {
  let component: GenreComponent;
  let fixture: ComponentFixture<GenreComponent>;
  let songServiceSpy: jasmine.SpyObj<SongService>;

  beforeEach(async () => {
    songServiceSpy = jasmine.createSpyObj('SongService', ['getCanciones', 'setCurrentSong', 'setIsPlaying'], {
      currentSong$: of(null),
    });
    songServiceSpy.getCanciones.and.returnValue(of(mockSongs as any));

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogged', 'getToken'], { isLogged$: of(false) });
    const uiStateSpy = jasmine.createSpyObj('UIStateService', ['toggle'], { sidebarOpen$: of(false) });

    await TestBed.configureTestingModule({
      imports: [GenreComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: SongService, useValue: songServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UIStateService, useValue: uiStateSpy },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: (key: string) => (key === 'name' ? 'reggaeton' : null) }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set genreSlug and genreName from route params', () => {
    expect(component.genreSlug).toBe('reggaeton');
    expect(component.genreName).toBe('Reggaeton');
  });

  it('should filter songs by genre', () => {
    expect(component.songs.length).toBe(2);
    expect(component.songs.every((s: any) => s.genero === 'reggaeton')).toBeTrue();
  });

  it('should set loading to false after songs load', () => {
    expect(component.loading).toBeFalse();
  });

  it('should return genre metadata for known genres', () => {
    expect(component.meta.icon).toBe('🎤');
    expect(component.meta.accent).toBe('#7C3AED');
  });

  it('should return default metadata for unknown genres', () => {
    component.genreSlug = 'jazz';
    expect(component.meta.icon).toBe('🎶');
  });

  it('should call setCurrentSong and setIsPlaying on playSong', () => {
    const song = mockSongs[0];
    component.playSong(song);
    expect(songServiceSpy.setCurrentSong).toHaveBeenCalledWith(song as any);
    expect(songServiceSpy.setIsPlaying).toHaveBeenCalledWith(true);
  });

  it('should identify current song', () => {
    component.currentSong = { _id: 's1' };
    expect(component.isCurrentSong({ _id: 's1' })).toBeTrue();
    expect(component.isCurrentSong({ _id: 's2' })).toBeFalse();
  });

  it('should return image URL for songs with http', () => {
    const song = { imagen: 'https://example.com/image.jpg' };
    expect(component.getImageUrl(song)).toBe('https://example.com/image.jpg');
  });

  it('should prefix cloudinary URL for non-http images', () => {
    const song = { imagen: 'myfolder/image.jpg' };
    expect(component.getImageUrl(song)).toContain('cloudinary');
  });

  it('should return empty string for songs without image', () => {
    expect(component.getImageUrl({})).toBe('');
  });

  it('should navigate to artist on goToArtist', () => {
    const song = { cantante: { _id: 'c1' } };
    const mockEvent = { stopPropagation: jasmine.createSpy() } as any;
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goToArtist(song, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/artist', 'c1']);
  });

  it('should unsubscribe on destroy', () => {
    const unsubSpy = spyOn((component as any).subs, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });
});
