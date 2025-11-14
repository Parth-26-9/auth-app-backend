import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordReqDto {
  @ApiProperty({ description: "confirm password that needs to change" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
