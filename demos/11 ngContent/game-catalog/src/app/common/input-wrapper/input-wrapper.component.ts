import {
  Component,
  Input,
  forwardRef,
  Inject,
  INJECTOR,
  Injector,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-input-wrapper',
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWrapperComponent),
      multi: true,
    },
  ],
})
export class InputWrapperComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type: string;
  name: string;
  fieldValue: string;
  _formControl!: FormControl;

  constructor(@Inject(INJECTOR) private injector: Injector) {
    this.label = '';
    this.type = 'text';
    this.fieldValue = '';
    this.name = '';
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
      // hack?
      this.fieldValue = ngControl.value;
      setTimeout(() => {
        this._formControl = ngControl.control as FormControl;
      });
    }
  }

  onChange: any = () => {};
  onTouch: any = () => {};
  set value(val: string) {
    this.fieldValue = val;
    this.onChange(val);
    this.onTouch(val);
  }

  writeValue(obj: any): void {
    this.fieldValue = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
