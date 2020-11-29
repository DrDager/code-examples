// Method decorator
// Increasing application loading counter at the start.
// Decreasing application loading counter when Observable is completed.
// Usually used for ApiService methods.
// Class should have Store DI.

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export function LoadingRequestCount(): Function {
  return function (targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value as Function;

    descriptor.value = function (...args: any[]): Observable<any> {
      if (!this.store && !(this.store instanceof Store)) {
        console.error('There is no Store DI, Store are required.');
        return originalMethod.apply(this, args);
      }

      this.store.dispatch(IncrementLoadingRequestsCount());

      return originalMethod.apply(this, args).pipe(finalize(() => this.store.dispatch(DecrementLoadingRequestsCount())));
    };

    return descriptor;
  };
}