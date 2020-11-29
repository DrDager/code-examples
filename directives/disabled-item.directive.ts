// Description:
// This directive is designed to to block a click on a some element.
// Usually used for some buttons or custom input like app-date-picker, app-ng-select.

import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { SoundService } from 'common/src/services/sound.service';


@Directive({
  selector: '[disabledItem]'
})
export class DisabledItemDirective {

  @Input('disabledItem')
  @HostBinding('class.disabled')
  disabled: boolean = true;

  constructor(private soundService: SoundService) {
  }

  @HostListener('click', ['$event'])
  clicked(event: Event): void {
    if (!this.disabled) {
      return;
    }

    event.preventDefault();
    this.soundService.playSound('disabled_button');
  }
}
