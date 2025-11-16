import { ApiProperty } from "@nestjs/swagger";
import { AuthProvider, Role, Roles, User } from "@prisma/client";

export class UserEntity
  implements Omit<User, "id" | "createdAt" | "updatedAt">
{
  @ApiProperty({ description: "The unique identifier" })
  id?: string;

  @ApiProperty({ description: "Name" })
  name: string;

  @ApiProperty({ description: "Email address" })
  email: string;

  @ApiProperty({ description: "User password" })
  password: string | null;

  @ApiProperty({ description: "auth provider", enum: AuthProvider })
  authProvider: AuthProvider;

  @ApiProperty({ description: "User's registerCode" })
  registerCode: string | null;

  @ApiProperty({ description: "Creation timestamp" })
  createdAt?: Date;

  @ApiProperty({ description: "Last update timestamp" })
  updatedAt?: Date;
}
