import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UIStateService {
  private _open = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this._open.asObservable();

  toggle(): void { this._open.next(!this._open.value); }
  close(): void  { this._open.next(false); }
  open(): void   { this._open.next(true); }
}
