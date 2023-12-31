import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
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
  
  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
  

  
  // @Public()
  // @Get('profile1')
  // getProfile1(@Request() req) {
  //   return req.user;
  // }
}
