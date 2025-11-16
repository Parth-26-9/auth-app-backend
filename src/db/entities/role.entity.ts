import { Role, Roles } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class RoleEntity
  implements Omit<Role, "id" | "createdAt" | "updatedAt">
{
  @IsString()
  id?: string;

  @IsString()
  userId: string;

  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
