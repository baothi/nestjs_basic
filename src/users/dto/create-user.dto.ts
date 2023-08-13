import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({},{message: "Email không đúng định dạng", })
  @IsNotEmpty({message: "Email không được để trống",})
  email: string;
  
  @IsNotEmpty({message: "password không được để trống ",})
  password: string;

  @IsNotEmpty()
  name: string;

  
  address: string;
}
