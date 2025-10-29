import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordReqDto {
  @ApiProperty({
    description: "Email address of the user for forget password",
    example: "john@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
