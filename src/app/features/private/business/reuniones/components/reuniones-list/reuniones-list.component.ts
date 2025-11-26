import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reuniones-list',
  standalone: true,
  imports: [],
  template: `<p>reuniones-list works!</p>`,
  styleUrl: './reuniones-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReunionesListComponent { }
