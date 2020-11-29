// Method decorator
// Used for ngOnChanges for avoid a lot of if statement

// Example: 
// @TrackInputChanges<string>('someProp', 'someFunction', ChangesStrategy.Each)
// @TrackInputChanges<number>('anotherProp', 'anotherFunction', ChangesStrategy.First)
// ngOnChanges(changes: SimpleChanges): void {}

import { SimpleChanges } from '@angular/core';
import { ChangesStrategy } from '../enums/change-strategy.enum';

export function TrackInputChanges<Type>(
    key: string,
    methodName: string,
    strategy: ChangesStrategy = ChangesStrategy.Each
  ): Function {
  return function (targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const source = descriptor.value;
    
    descriptor.value = function (changes: SimpleChanges): Function {
      if (!targetClass[methodName]) { console.warn(`Can't find ${methodName} in ${targetClass}`); }

      if (targetClass[methodName] && changes && changes[key] && changes[key].currentValue !== undefined) {
        const isFirstChange = changes[key].firstChange;
        
        if (strategy === ChangesStrategy.Each ||
           (strategy === ChangesStrategy.First && isFirstChange) ||
           (strategy === ChangesStrategy.NonFirst && !isFirstChange)
        ) {
          targetClass[methodName].call(this, changes[key].currentValue as Type);
        }
      }
      
      return source.call(this, changes);
    };
    
    return descriptor;
  };
}
