import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateOrNull', async: false })
export class IsDateOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return value === null || value instanceof Date;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each value must be a Date, "null", or null';
  }
}
