import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

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

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
  

  
  @Public()
  @Get('profile1')
  getProfile1(@Req() req) {
    return req.user;
  }
}
