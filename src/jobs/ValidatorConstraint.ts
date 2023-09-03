import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsEndDateGreaterThanStartDate', async: false })
export class IsEndDateGreaterThanStartDate implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const startDate = (args.object as any).startDate;
    if (!startDate || !endDate) {
      return false;
    }
    return endDate > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'endDate must be greater than startDate';
  }
}