import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../../db/entities/user.entity";

export class GetProfileResDto {
  @ApiProperty({ description: "Message to user" })
  message: string;

  @ApiProperty({ description: "User details" })
  user: UserEntity;
}
