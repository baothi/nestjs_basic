import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage("Create a new resume")
  create(@Body() CreateUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(CreateUserCvDto, user);
  }

  @Post('by-user')
  @ResponseMessage("Create a new resume")
  getResumeByUser(@User() user: IUser){
    return this.resumesService.findByUsers(user);
  }


  // http://localhost:8000/api/v1/resumes?current=1&pageSize=10&populate=companyId,jobId&fields=companyId._id,companyId.name,companyId.logo,jobId._id,jobId.name
  @Get()
  @ResponseMessage("Fetch all resume with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update status resume")
  update(@Param('id') id: string, @Body("status") status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
