// TODO - add description
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'customCurrencyFormat'})
export class CustomCurrencyFormat implements PipeTransform {
  transform(value: number|string,
    currencySign: string = '€ ',
    decimalLength: number = 2,
    chunkDelimiter: string = '.',
    decimalDelimiter: string = ',',
    chunkLength: number = 3
  ): string {
    if (!value) { return '-'; }
    value = Number(value);

    const result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    const num = value.toFixed(Math.max(0, ~~decimalLength));

    const replacedDelimiter = (decimalDelimiter ? num.replace('.', decimalDelimiter) : num);

    const replacedChunk = replacedDelimiter.replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);

    return currencySign + replacedChunk;
  }
}

