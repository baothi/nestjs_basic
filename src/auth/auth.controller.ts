import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';

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
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  

  
  @Public()
  @Get('profile1')
  getProfile1(@Request() req) {
    return req.user;
  }
}
