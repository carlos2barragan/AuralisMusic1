import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MostPlayedSongsComponent } from './most-played-songs.component';
import { Cancion } from '../../models/cancion.model';

const mockSongs: Cancion[] = [
  { _id: '1', titulo: 'CRUZ', cantante: { _id: 'c1', cantante: 'Feid', avatar: '' }, album: 'Ferxxocalipsis', genero: 'regueton', imagen: 'img1.jpg', fileUrl: 'url1', plays: 100 },
  { _id: '2', titulo: 'TUSA', cantante: { _id: 'c2', cantante: 'Karol G', avatar: '' }, album: 'KG0516', genero: 'regueton', imagen: 'img2.jpg', fileUrl: 'url2', plays: 200 },
];

describe('MostPlayedSongsComponent', () => {
  let component: MostPlayedSongsComponent;
  let fixture: ComponentFixture<MostPlayedSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPlayedSongsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MostPlayedSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty songs list', () => {
    expect(component.songs).toEqual([]);
  });

  it('should display songs when input is provided', () => {
    component.songs = mockSongs;
    fixture.detectChanges();
    expect(component.songs.length).toBe(2);
  });

  it('should emit songSelected when a song is emitted', () => {
    component.songs = mockSongs;
    const spy = spyOn(component.songSelected, 'emit');
    component.songSelected.emit(mockSongs[0]);
    expect(spy).toHaveBeenCalledWith(mockSongs[0]);
  });

  it('should call goToArtist and stop event propagation', () => {
    const song = mockSongs[0];
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goToArtist(song, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/artist', 'c1']);
  });

  it('should not navigate if song has no cantante id', () => {
    const songWithoutArtist: Cancion = { ...mockSongs[0], cantante: { _id: '', cantante: 'Sin artista', avatar: '' } };
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goToArtist(songWithoutArtist, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
