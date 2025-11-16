import { Roles } from "@prisma/client";

export class CreateRoleDto {
  userId: string;
  role: Roles;
}
