// import { PartialType } from '@nestjs/mapped-types';
// import { CreateJobDto } from './create-job.dto';

// export class UpdateJobDto extends PartialType(CreateJobDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  // @IsNotEmpty({ message: "_id không được để trống",})
  // _id: string
}