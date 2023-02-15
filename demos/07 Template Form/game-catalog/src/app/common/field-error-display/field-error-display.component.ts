import { Component, Input } from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.css'],
})
export class FieldErrorDisplayComponent {
  @Input() fieldNgModel: AbstractControlDirective | null;

  constructor() {
    this.fieldNgModel = null;
  }
}
