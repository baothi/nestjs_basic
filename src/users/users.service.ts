import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import {genSaltSync, hashSync} from 'bcryptjs';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
