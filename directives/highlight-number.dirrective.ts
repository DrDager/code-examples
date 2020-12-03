// Description:
// This directive is designed to highlight any components depending on the passed types and value.
// Usually used for columns in a table with currency/date type.
// There can be several types of highlighting, for example: [POSITIVE_TO_RED, NEGATIVE_TO_GREEN]
// Value can be number or string with Date.

import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighlightColorsEnum, HighlightTypeEnum, HighlightInfo } from 'common/src/modules/ui-components/table-summary-bar/table-summary-bar.model';
import { TrackInputChanges } from 'projects/workspace/src/app/shared/decorators/track-input-changes';
import { ChangesStrategy } from 'projects/workspace/src/app/shared/enums/change-strategy.enum';

@Directive({
  selector: '[highlightColor]',
})
export class HighlightColorDirective implements OnChanges {
  protected _elementClass: string[] = [];

  @Input('highlightColorValue') value: number | string;

  @Input('highlightColorInfo') colorInfo: HighlightInfo[];

  @HostBinding('class')
  get elementClass(): string {
    return this._elementClass.join(' ');
  }

  @TrackInputChanges<number>('value', 'updateClasses', ChangesStrategy.Each)
  ngOnChanges(changes: SimpleChanges): void {}

  public updateClasses(): void {
    if (!this.colorInfo || !this.value) {
      console.warn(`Missing arguments for [highlightColor], highlightColorValue: ${this.value}, highlightColorInfo: ${this.colorInfo}`);
      return;
    }

    const selectedClasses = [];

    const factory = new HighlightFactory();

    this.colorInfo.forEach((info: HighlightInfo) => {
      if (factory.create(info.type, this.value).isValueValid()) {
        this.addUniqClass(selectedClasses, info.color);
      }
    });

    this._elementClass = selectedClasses;
  }

  public addUniqClass(selectedClasses: string[], classToInsert: HighlightColorsEnum): void {
    if (!selectedClasses.find((cls) => cls === classToInsert)) {
      selectedClasses.push(classToInsert);
    }
  }
}
abstract class Validator<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  abstract isValueValid(): boolean;
}

class ValidatorPositive extends Validator<number> {

  constructor(value: number) {
    super(value);
  }

  public isValueValid(): boolean {
    return Number(this.value) > 0;
  }
}

class ValidatorNegative extends Validator<number> {

  constructor(value: number) {
    super(value);
  }

  public isValueValid(): boolean {
    return Number(this.value) < 0;
  }
}

class ValidatorFutureDate extends Validator<string> {

  constructor(value: string) {
    super(value);
  }

  public isValueValid(): boolean {
    return new Date(this.value).getTime() > Date.now();
  }
}

class ValidatorPastDate extends Validator<string> {

  constructor(value: string) {
    super(value);
  }

  public isValueValid(): boolean {
    return new Date(this.value).getTime() < Date.now();
  }
}

class HighlightFactory {
  static list = {
    [HighlightTypeEnum.POSITIVE_TO]: ValidatorPositive,
    [HighlightTypeEnum.NEGATIVE_TO]: ValidatorNegative,
    [HighlightTypeEnum.DATE_IN_FUTURE_TO]: ValidatorFutureDate,
    [HighlightTypeEnum.DATE_IN_PAST_TO]: ValidatorPastDate,
  };

  create(type: HighlightTypeEnum, value: any) {
    const ValidatorClass = HighlightFactory.list[type] || HighlightFactory.list[HighlightTypeEnum.POSITIVE_TO];
    return new ValidatorClass(value);
  }
}