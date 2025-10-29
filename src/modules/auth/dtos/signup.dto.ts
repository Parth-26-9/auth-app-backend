import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { AuthProvider } from "@prisma/client";

export class SignupReqDto {
  @ApiProperty({ description: "Name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "john@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "Password for the user account. Must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character.",
    example: "MySecure@Password!#",
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password is too weak",
  })
  password: string;

  @ApiProperty({
    description: "Auth provider",
    enum: AuthProvider,
  })
  authProvider?: AuthProvider;
}

export class SignupResDto {
  @ApiProperty({
    example: "User account created successfully",
  })
  message: string;
}
