// TODO - add description
import { Injectable } from '@angular/core';

import { ToasterService } from 'common/src/modules/ui-components/toaster';
import { FormGroup, AbstractControl } from '@angular/forms';
import { get } from 'lodash';
import { Validation } from '../models/response';

@Injectable()
export class ValidationService {
  constructor(private readonly toasterService: ToasterService) {}

  public renderServerErrors(form: FormGroup, validations: Validation[]) {
    if (!get(validations,'length')) {
        return;
    }

    validations.forEach((validationElement: Validation) => {
      // field errors are handled here, different errors should be handled globally
      const {fieldName, fieldValue} = validationElement;
      if (form == null || !this.hasFieldName(form, fieldName)) {
        // disable error displaying
        // this.showMsg('error', `${fieldValue}`);
        console.error(`Unexpected error, can't find related input`);
      } else {
        this.setFieldError(form, fieldName, fieldValue);
      }
    });
  }

  public hasWrongValue(form: FormGroup, fieldName: string): boolean {
    const isFieldsErrors = this.getFieldErrors(form, fieldName).length > 0;
    return isFieldsErrors;
  }

  // a field is correct only if it is filled and have no errors
  public hasCorrectValue(form: FormGroup, fieldName: string): boolean {
    const control = this.findFieldControl(form, fieldName);
    // field found && user changed it && it doesn't hold a wrong value
    const isCorrect = control && !control.pristine && !this.hasWrongValue(form, fieldName);

    return isCorrect;
  }

  public getFieldErrors(form: FormGroup, fieldName: string): string[] {
    const control = this.findFieldControl(form, fieldName);
    if (control && control.touched && control.errors) {
      return this.getReadableErrors(fieldName, this.getErrors(control));
    } else {
      return [];
    }
  }

  public getErrors(control: AbstractControl): string[] {
    return Object.keys(control.errors).filter((error: string) => control.errors[error]);
  }

  public getReadableErrors(fieldName: string, errors: string[]): string[] {
    fieldName = fieldName.replace('_', ' ');
    return errors.map(error => {
      switch (error) {
        case 'required':
          return `${fieldName} must be filled`;
        case 'email':
          return `${fieldName} has an invalid format`;
        case 'minlength':
          return `${fieldName} is too short`;
        case 'maxlength':
          return `${fieldName} is too long`;
        case 'pattern':
          return `${fieldName} contains unacceptable symbol`;
        default:
          return error;
      }
    });
  }

  private hasFieldName(form: FormGroup, fieldName: string): boolean {
    const control = this.findFieldControl(form, fieldName);
    return control != null;
  }

  private setFieldError(form: FormGroup, fieldName: string, fieldValue: string) {
    const control = this.findFieldControl(form, fieldName);
    // const errors = { ...control.errors, [fieldValue]: true }; // Display server and UI validations
    const errors = { [fieldValue]: true };
    control.setErrors(errors);
  }

  private findFieldControl(form: FormGroup, fieldName: string): AbstractControl {
    return form.get(fieldName);
  }

  private showMsg(type: string, message: string | string[]): void {
    this.toasterService.notify({type, message});
  }
}
