import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({timestamps: true})
export class Company {
  @Prop()
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  createBy: {
    _id: string;
    email: string;
  };

  @Prop()
  updateBy: {
    _id: string;
    email: string;
  };

  @Prop()
  deleteBy: {
    _id: string;
    email: string;
  };

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;

  @Prop()
  isDelete: boolean;

  @Prop()
  deleteAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);