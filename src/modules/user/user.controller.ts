import { Controller, Get, HttpCode, Logger, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtUserAuthGuard } from "../auth/guards/jwt-user-auth.guard";
import { GetProfileResDto } from "./dtos/get-user-profile.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { UserEntity } from "../../db/entities/user.entity";

@ApiBearerAuth()
@ApiTags("User")
@UseGuards(JwtUserAuthGuard)
@Controller("user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  @HttpCode(200)
  @ApiOkResponse({ type: GetProfileResDto })
  @Get("me")
  async getFullAccess(@GetUser() user: UserEntity): Promise<GetProfileResDto> {
    return {
      message: "Profile retrieved successfully",
      user: user,
    };
  }
}
