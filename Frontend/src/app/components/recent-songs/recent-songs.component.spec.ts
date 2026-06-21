import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecentSongsComponent } from './recent-songs.component';
import { Cancion } from '../../models/cancion.model';

const mockSongs: Cancion[] = [
  { _id: '1', titulo: 'CRUZ', cantante: { _id: 'c1', cantante: 'Feid', avatar: '' }, album: 'Ferxxocalipsis', genero: 'regueton', imagen: 'img1.jpg', fileUrl: 'url1', plays: 100 },
  { _id: '2', titulo: 'Hawái', cantante: { _id: 'c2', cantante: 'Maluma', avatar: '' }, album: '7 DJ', genero: 'pop', imagen: 'img2.jpg', fileUrl: 'url2', plays: 50 },
];

describe('RecentSongsComponent', () => {
  let component: RecentSongsComponent;
  let fixture: ComponentFixture<RecentSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentSongsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an empty songs list', () => {
    expect(component.songs).toEqual([]);
  });

  it('should accept songs via Input', () => {
    component.songs = mockSongs;
    fixture.detectChanges();
    expect(component.songs.length).toBe(2);
  });

  it('should emit songSelected when called', () => {
    const spy = spyOn(component.songSelected, 'emit');
    component.songSelected.emit(mockSongs[0]);
    expect(spy).toHaveBeenCalledWith(mockSongs[0]);
  });

  it('should navigate to artist on goToArtist', () => {
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goToArtist(mockSongs[0], mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/artist', 'c1']);
  });

  it('should not navigate if artist id is missing', () => {
    const songNoId: any = { ...mockSongs[0], cantante: { cantante: 'Sin ID' } };
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;
    const routerSpy = spyOn((component as any).router, 'navigate');

    component.goToArtist(songNoId, mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
  });
});
