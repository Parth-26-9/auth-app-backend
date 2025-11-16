import { IsNotEmpty, IsString } from "class-validator";

export class AcceptInviteUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
