import { IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested, ArrayMinSize, IsArray, Validate } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { IsEndDateGreaterThanStartDate } from '../ValidatorConstraint';

class Company {
    @IsNotEmpty({message: "Id không được để trống",})
    _id: mongoose.Schema.Types.ObjectId;;
  
    @IsNotEmpty({message: "Name không được để trống",})
    name: string;
  }

export class CreateJobDto {
    @IsNotEmpty({message: "Name không được để trống",})
    name: string;
    
    @IsNotEmpty({message: "Skills không được để trống",})
    @IsArray({message: "Skills có định dạng là array"})
    @ArrayMinSize(1, { message: "Skills phải có ít nhất một kỹ năng" })
    skills: string[] = [];
    
    @IsNotEmpty({message: "location không được để trống ",})
    location: string;
  
    @IsNotEmpty({message: "Salary không được để trống ",})
    salary: number;
  
    @IsNotEmpty({message: "quantity không được để trống ",})
    quantity: string;
  
    @IsNotEmpty({message: "description không được để trống ",})
    description: string;
  
    @IsNotEmpty({message: "level không được để trống ",})
    level: string;

    @IsNotEmpty({message: "startDate không được để trống"})
    @IsDate({message: "startDate phải là một đối tượng Date"})
    @Transform(({value})=> new Date(value))
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty({message: "endDate không được để trống"})
    @IsDate({message: "endDate phải là một đối tượng Date"})
    @Transform(({value})=> new Date(value))
    @Validate(IsEndDateGreaterThanStartDate, {
      message: 'endDate phải lớn hơn startDate',
    })
    @Type(() => Date)
    endDate: Date;
  
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
  }