import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserM, UserDocument } from './schemas/user.schema';
import {genSaltSync, hashSync, compareSync} from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { Role as RoleM, RoleDocument } from 'src/roles/schemas/role.schemas'; // Import Role model
import { USER_ROLE } from 'src/databases/sample';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private UserModel: SoftDeleteModel<UserDocument>,
    @InjectModel(RoleM.name) private RoleModel: SoftDeleteModel<RoleDocument> // Inject Role model
  ) {}

  getHashpassword = (password:string) => {
    // var bcrypt = require('bcryptjs');
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
// Store hash in your password DB.
  }

  // Hàm kiểm tra mật khẩu
  validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      return 'Mật khẩu phải có ít nhất một chữ cái in hoa';
    }

    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
      return 'Mật khẩu phải có ít nhất một chữ cái in thường';
    }

    const hasSpecialCharacter = /[!@#\$%\^&\*]/.test(password);
    if (!hasSpecialCharacter) {
      return 'Mật khẩu phải có ít nhất một ký tự đặc biệt';
    }

    return null;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto
    // add login check email
    const isEcist = await this.UserModel.findOne({ email});
    if (isEcist) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
    // Gọi hàm kiểm tra mật khẩu
    const validationResult = this.validatePassword(password);
    if (validationResult) {
      throw new BadRequestException(validationResult);
    }
    const hashPassword = this.getHashpassword(createUserDto.password)
    let newUser = await this.UserModel.create({
      name, email, password: hashPassword, age, gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    // add login check email
    const isEcist = await this.UserModel.findOne({ email});
    if (isEcist) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
    // Gọi hàm kiểm tra mật khẩu
    const validationResult = this.validatePassword(password);
    if (validationResult) {
      throw new BadRequestException(validationResult);
    }
    const hashPassword = this.getHashpassword(user.password);

    // Find the role document (assumes 'user' role exists in your Role collection)
    const userRole = await this.RoleModel.findOne({ name: USER_ROLE });
    if (!userRole) {
      throw new BadRequestException('Role "user" does not exist');
    }

    let newRegister = await this.UserModel.create({
      name, email, password: hashPassword, 
      age, gender, address,
      role: userRole?._id
    });
    return newRegister;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? limit : 10;

    const totalItems = (await this.UserModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();
    return { 
      meta:{
        curent: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, // tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi) 
      },
      result // kết quả query
    }
  }

  async findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "Không tìm thấy user này"
    try {
      const user = (await this.UserModel.findOne({_id: id})
      .select("-password"))    // dùng dấu - chỗ password có nghĩa là excule >< include
      .populate({path: "role", select: {name: 1, _id: 1}}); 
    return user;
    } catch (error) {
      return "not found"
    }
    
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash); // false
  }
  
  async findOneByUsername(username: string) {
    return (await this.UserModel.findOne({
      email: username
    })).populate({path: "role", select: {name: 1}});
  }



  async update(updateUserDto: UpdateUserDto, user: IUser) {

    const updated = await this.UserModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;
  }

  async remove(id: string, user: IUser) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "Không tìm thấy user này"

    const foundUser = await this.UserModel.findById(id);
    if(foundUser && foundUser.email === "admin@gmail.com"){
      throw new BadRequestException("Không thể xóa admin");
    }
    await this.UserModel.updateOne({_id: id },{
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.UserModel.softDelete({_id: id});
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.UserModel.updateOne(
      {_id},
      {refreshToken}
    )
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken })
      .populate({
        path: "role",
        select: { name: 1 }
      });
  }
}
