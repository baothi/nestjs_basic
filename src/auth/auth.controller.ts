import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ApiBody } from '@nestjs/swagger';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService
    ) {}

  // @Get()
  // @Render("home")
  // getHello() {
  //   console.log("check port = ", this.configService.get<string>("PORT"))
  //   const mesage = this.appService.getHello();
  //   return {
  //     mesage: mesage
  //   }
  // }
  
  // @UseGuards(AuthGuard('local'))
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return req.user;
  // }
  
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ResponseMessage("User is logged in successfully")
  @ApiBody({ type: UserLoginDto, })
  @Post('/login')
  handleLogin(
    @Req() req,
    @Res({passthrough: true}) response: Response
    ) {
    console.log("user is logged in successfully")
    return this.authService.login(req.user, response);
  }
  
  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  handleRegister(@Body() RegisterUserDto: RegisterUserDto) {
    return this.authService.register(RegisterUserDto);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const temp = await this.rolesService.findOne(user.role._id) as any;
    user.permissions = temp.permissions;
    return { user };
  }
  

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh-token')
  handleRefreshToken(
    @Req() request: Request,
    @Res({passthrough: true}) response: Response
    ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("Logout User")
  @Post('/logout')
  handleLogout(
    @Res({passthrough: true}) response: Response,
    @User() user: IUser
    ) {
    return this.authService.logout(response, user);
  }
}
