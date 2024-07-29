import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function Validatorfechaliberacion(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const today = new Date();
    const inputDate = new Date(control.value);

    if (isNaN(inputDate.getTime())) {
      return { invalidDate: true }; // O un error adecuado para la fecha inválida
    }

    if (inputDate < today) {
      return { dateInvalid: true };
    }

    return null;
  };
}