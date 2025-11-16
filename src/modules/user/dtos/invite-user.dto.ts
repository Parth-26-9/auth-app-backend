import { Roles } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class InviteUserReqDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: Roles;
}
