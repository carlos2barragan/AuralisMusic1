import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';

const pageAnim = trigger('pageAnim', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(14px)' }),
      animate('320ms cubic-bezier(0.22,1,0.36,1)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  animations: [pageAnim],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';

  getRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRoute?.snapshot?.routeConfig?.path ?? '';
  }
}
