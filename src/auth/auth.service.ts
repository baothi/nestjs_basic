import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if(isValid===true) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
      const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role
      };
      const refresh_token = this.createRefreshToken(payload);

      //update user with refresh token
      await this.usersService.updateUserToken(refresh_token,_id);

      //set refresh token as cookie
      response.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
      })


      return {
        access_token: this.jwtService.sign(payload),
        refresh_token,
        user: {
          _id,
          name,
          email,
          role
        }
      };
  }

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);
      return {
        _id: newUser?._id,
        createdAt: newUser?.createdAt,
      };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))/1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try{
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      })
      let user = await this.usersService.findUserByToken(refreshToken);
      if(user) {
        //update frfresh token
        const { _id, name, email } = user;
        const payload = {
          sub: "token refresh",
          iss: "from server",
          _id,
          name,
          email
        };
        const refresh_token = this.createRefreshToken(payload);
        // delete old refresh token
        response.clearCookie("refresh_token");

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token,_id.toString());

        //set refresh token as cookie
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) * 1000
        })

        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          user: {
            _id,
            name,
            email
          }
      };
      }else {
        throw new BadRequestException(`Resfresh token notFound`);
      }
      console.log(user);
    }catch(error){
      console.log(error);
      throw new BadRequestException(`Resfresh token ${error}`);
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken("", user._id);
    response.clearCookie("refresh_token");
    return "ok";
  };
}
