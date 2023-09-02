import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { IUser } from 'src/users/users.interface';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
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
  @ResponseMessage("User is logged in successfully")
  @Post('/login')
  handleLogin(
    @Req() req,
    @Res({passthrough: true}) response: Response
    ) {
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
  handleGetAccount(@User() user: IUser) {
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
