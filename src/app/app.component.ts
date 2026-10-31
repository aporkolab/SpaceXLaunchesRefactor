import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LaunchesComponent } from './components/launches-component/launches-component.component';

@Component({
  selector: 'app-root',
  imports: [LaunchesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
