import {
  Component,
  ElementRef,
  HostListener,
  forwardRef,
  AfterViewInit,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: '[text-editable]',
  template: '<ng-content></ng-content>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditableComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        padding: 2px 4px;
      }
      :host[disabled='true'] {
        pointer-events: none;
        background: #f9f9f9;
      }
      :host:empty::before {
        content: attr(placeholder);
        color: #9d9d9d;
      }
    `,
  ],
})
export class TextEditableComponent
  implements ControlValueAccessor, AfterViewInit
{
  @HostListener('input') callOnChange() {
    this.onChange(this.el.nativeElement.textContent);
  }
  @HostListener('blur') callOnTouched() {
    this.onTouched();
  }
  constructor(private el: ElementRef) {}

  onChange!: (value: string) => void; 
  onTouched!: () => void; 

  ngAfterViewInit() {
    this.el.nativeElement.setAttribute('contenteditable', 'true');
  }

  writeValue(value: string) {
    this.el.nativeElement.textContent = value || '';
  }

  registerOnChange(fn: (value: string) => void) {
    console.log(fn);
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.el.nativeElement.setAttribute('disabled', String(val));
    this.el.nativeElement.setAttribute('contenteditable', String(!val));
  }
}
