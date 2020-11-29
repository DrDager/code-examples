// Description:
// This directive is designed to highlight any components depending on the passed types and value.
// Usually used for columns in a table with currency/date type.
// There can be several types of highlighting, for example: [POSITIVE_TO_RED, NEGATIVE_TO_GREEN]
// Value can be number or string with Date.

import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HighlightColorsEnum, HighlightTypeEnum } from 'common/src/modules/ui-components/table-summary-bar/table-summary-bar.model';
import { TrackInputChanges } from 'projects/workspace/src/app/shared/decorators/track-input-changes';
import { ChangesStrategy } from 'projects/workspace/src/app/shared/enums/change-strategy.enum';

@Directive({
  selector: '[highlightColor]',
})
export class HighlightColorDirective implements OnChanges {
  protected _elementClass: string[] = [];

  @Input('highlightColorValue') value: number | string;

  @Input('highlightColorTypes') types: HighlightTypeEnum[];

  @HostBinding('class')
  get elementClass(): string {
    return this._elementClass.join(' ');
  }

  @TrackInputChanges<number>('value', 'setOrUpdateHighlightClasses', ChangesStrategy.Each)
  ngOnChanges(changes: SimpleChanges): void {}

  public setOrUpdateHighlightClasses(): void {
    if (!this.types || !this.value) {
      console.warn(`Missing arguments for [highlightColor], highlightColorValue: ${this.value}, highlightColorTypes: ${this.types}`);
      return;
    }

    const selectedClasses = [];

    this.types.map((highlightType: HighlightTypeEnum) => {
      switch (highlightType) {
        case HighlightTypeEnum.POSITIVE_TO_GREEN:
          if (this.value > 0) { this.addUniqClass(selectedClasses, HighlightColorsEnum.GREEN); }
          break;
        case HighlightTypeEnum.POSITIVE_TO_RED:
          if (this.value > 0) { this.addUniqClass(selectedClasses, HighlightColorsEnum.RED); }
          break;
        case HighlightTypeEnum.NEGATIVE_TO_GREEN:
          if (this.value < 0) { this.addUniqClass(selectedClasses, HighlightColorsEnum.GREEN); }
          break;
        case HighlightTypeEnum.NEGATIVE_TO_RED:
          if (this.value < 0) { this.addUniqClass(selectedClasses, HighlightColorsEnum.RED); }
          break;
        case HighlightTypeEnum.DATE_IN_FUTURE_TO_GREEN:
          if (new Date(this.value).getTime() > Date.now()) { this.addUniqClass(selectedClasses, HighlightColorsEnum.GREEN); }
          break;
        case HighlightTypeEnum.DATE_IN_PAST_TO_RED:
          if (new Date(this.value).getTime() < Date.now()) { this.addUniqClass(selectedClasses, HighlightColorsEnum.RED); }
          break;
        default:
          break;
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
