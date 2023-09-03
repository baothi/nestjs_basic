import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({timestamps: true})
export class Job {
  @Prop()
  name: string;

  @Prop()
  skills: string[];

  @Prop()
  location: string;

  @Prop()
  salary: number;

  @Prop()
  quantity: string;

  @Prop()
  level: string;

  @Prop({type: Object})
  company: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({type: Object})
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({type: Object})
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({type: Object})
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDelete: boolean;

  @Prop()
  deletedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);