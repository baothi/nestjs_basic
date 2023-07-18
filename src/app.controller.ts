import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService
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

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return req.user;
  }
}
