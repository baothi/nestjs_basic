import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schemas/role.schemas';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private RoleModel: SoftDeleteModel<RoleDocument>
  ){}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, isActive, permissions } = createRoleDto;
    const isExist = await this.RoleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`Role với name="${name}" is already`);
    }
    const newRole = await this.RoleModel.create({
      name, description, isActive, permissions,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })
    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter,  sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.RoleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    
    const result = await this.RoleModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .populate(population)
    .select(projection as any)
    .exec();
    
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
      }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException('Invalid resume id')
    }
    return (await this.RoleModel.findById(id))
    .populate({
      path: "permissions", 
      select: {_id: 1, apiPath: 1, name: 1, method: 1, module: 1}
    });
  }

  async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(_id)){
      throw new BadRequestException('Invalid resume id')
    }

    const { name, description, isActive, permissions } = updateRoleDto;
    // const isExist = await this.RoleModel.findOne({ name });
    // if (isExist) {
    //   throw new BadRequestException(`Role với name="${name}" is already`);
    // }

    const updated = await this.RoleModel.updateOne(
      { _id },
      {
        name, description, isActive, permissions,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    )
    return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException('Invalid resume id')
    }
    const foundRole = await this.RoleModel.findById(id);
    if (foundRole.name === "ADMIN") {
      throw new BadRequestException('kHÔNG THỂ XÓA ROLE ADMIN');
    }
    await this.RoleModel.updateOne(
      {_id: id},
      {
        deletedBy:{
          _id: user._id,
          email: user.email
        },
      })
    return this.RoleModel.softDelete({_id: id});
  }
}
