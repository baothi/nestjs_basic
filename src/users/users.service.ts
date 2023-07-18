import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import {genSaltSync, hashSync, compareSync} from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  getHashpassword = (password:string) => {
    // var bcrypt = require('bcryptjs');
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
// Store hash in your password DB.
  }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashpassword(createUserDto.password)
    console.log(hashPassword)
    let user = await this.UserModel.create({
      email: createUserDto.email, 
      password: hashPassword, 
      name: createUserDto.name, 
      address: createUserDto.address
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "Không tìm thấy user này"
    try {
      const user = await this.UserModel.findOne({_id: id});
    return user;
    } catch (error) {
      return "not found"
    }
    
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); // false
  }
  
  async findOneByUsername(username: string) {
    return await this.UserModel.findOne({email: username});
  }



  async update(updateUserDto: UpdateUserDto) {
    return await this.UserModel.updateOne({_id: updateUserDto._id},{...updateUserDto});
  }

  async remove(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "Không tìm thấy user này"
    return await this.UserModel.deleteOne({_id: id});
  }
}
