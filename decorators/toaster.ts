// Method decorator
// Display error or success toast.
// Usually used for ApiService methods for displaying error, success message. 
// Class should have ToasterService DI.

// Example:
// @DisplayToaster({ showErrorMessage: true })
// getOutgoingInvoiceById(invoiceId: number): Observable<OutgoingInvoiceModel> {

import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { get } from 'lodash';
import { ToasterService } from 'common/src/modules/ui-components/toaster';

export function DisplayToaster(params: DisplayToasterParams): Function {
  return function (targetClass: Object, functionName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value as Function;

    descriptor.value = function (...args: any[]): Observable<any> {
      if (!this.toasterService || !(this.toasterService instanceof ToasterService)) {
        console.error('There is no ToasterService DI, ToasterService are required.');
        return originalMethod.apply(this, args);
      }

      return originalMethod.apply(this, args).pipe(
        tap(() => {
          if (params.showSuccessMessage) {
            this.toasterService.notify({type: ToasterService.MESSAGE_TYPE_SUCCESS, message: get(params, 'successMsg') || 'Response completed successfully.'});
          }
        }),
        catchError((err) => {
          if (params.showErrorMessage) {
            this.toasterService.notify({type: ToasterService.MESSAGE_TYPE_ERROR, message: get(params, 'errorMsg') || err.error.message || err.error.errors || 'Some error occurred.'});
          }
          return throwError(err);
        })
      );
    };

    return descriptor;
  };
}

export interface DisplayToasterParams {
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
  errorMsg?: string;
  successMsg?: string;
}
