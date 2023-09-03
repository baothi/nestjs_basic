import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ){}

  async create(createJobDto: CreateJobDto, user: IUser) {
    return await this.jobModel.create({...createJobDto, 
      createdBy: {
        _id: user._id,
        email: user.email
      }});
  }

  async findAll(currentPage: number = 1, limit: number = 10, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
  
    const offset = (currentPage - 1) * limit;
    const totalItems = await this.jobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
  
    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .exec();
  
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return `not found job with ${id}`;
    }
    const job = await this.jobModel.findById(id).exec();
    // if (!job) {
    //   throw new NotFoundException(`Job with id ${id} not found`);
    // }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return  await this.jobModel.updateOne(
      {_id: id },
      { ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }}
    )
    // console.log(JSON.stringify(job));
    // return job;
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne(
      {_id: id },
      {
        // isDelete: true, 
        // deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          email: user.email
        } 
      
      })
      return this.jobModel.softDelete({_id: id})
  }
}
