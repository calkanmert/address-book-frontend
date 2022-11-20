import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class ErrorService {
  constructor() {}
  
  editValidationMessage(message: string): string {
    switch(message) {
      case 'empty_field':
        return 'This field cannot be empty!';
        break;
      case 'invalid_email':
        return 'Invalid email!';
        break;
      case 'required_field':
        return 'This field cannot be empty!';
        break;
      case 'one_phone_required':
          return 'At least one phone required!';
          break;
      default:
        return 'Hata!';
    }
  }
  
  async validationError(error: any) {
    let validation_error: any = {};
    await error.error.errors.map((err: any) => {
      validation_error[err.field] = this.editValidationMessage(err.message);
    });
    return validation_error;
  }

  objectToValidationError(form: FormGroup) {
    let validation_error: any = {};
    for (const [field, formControl] of Object.entries(form.controls)) {
      if (formControl.errors) {
        for (const [errName, value] of Object.entries(formControl.errors)) {
          let errMsg;
          switch(errName) {
            case 'required':
              errMsg = 'required_field';
              break;
            case 'email':
              errMsg = 'invalid_email';
              break;
            default:
              errMsg = '';
          }
          validation_error[field] = this.editValidationMessage(errMsg);
        }
      }
    }
    return validation_error;
  }
}