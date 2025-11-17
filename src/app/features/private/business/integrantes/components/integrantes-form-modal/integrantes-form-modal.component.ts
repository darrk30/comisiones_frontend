import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-integrantes-form-modal',
  templateUrl: './integrantes-form-modal.component.html',
  styleUrl: './integrantes-form-modal.component.css',
  standalone: true,
  imports: [ModalModule,CommonModule],
})
export class IntegrantesFormModalComponent { }
