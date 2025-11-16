import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtUserAuthGuard } from "../auth/guards/jwt-user-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { UserEntity } from "../../db/entities/user.entity";
import { InviteUserReqDto } from "./dtos/invite-user.dto";
import { UserService } from "./user.service";
import { RequireRoles } from "../auth/decorators/role.decorator";
import { Roles } from "@prisma/client";
import { CommonResponseDto } from "../../shared/dtos";
import { RolesGuard } from "../auth/guards/role.guard";
import { AcceptInviteUserDto } from "./dtos";
import { AcceptUserInviteGuard } from "../auth/guards/accept-invite-user.guard";

@ApiBearerAuth()
@ApiTags("User")
@UseGuards(JwtUserAuthGuard, RolesGuard)
@Controller("user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @ApiOkResponse({ type: CommonResponseDto })
  @Get("me")
  async getFullAccess(
    @GetUser() user: UserEntity
  ): Promise<CommonResponseDto<UserEntity>> {
    return {
      message: "Profile retrieved successfully",
      success: true,
      data: user,
    };
  }

  @HttpCode(200)
  @ApiOkResponse({ type: CommonResponseDto })
  @RequireRoles(Roles.ADMIN)
  @Post("invite")
  async invite(
    @Body() invitedUserData: InviteUserReqDto
  ): Promise<CommonResponseDto<undefined>> {
    return await this.userService.invite(invitedUserData);
  }

  @HttpCode(200)
  @ApiOkResponse({ type: CommonResponseDto })
  @UseGuards(AcceptUserInviteGuard)
  @RequireRoles(Roles.ADMIN, Roles.MANAGER, Roles.MEMBER)
  @Post("invite/accept")
  async acceptInvite(
    @GetUser() user: UserEntity,
    @Body() acceptInviteUserDto: AcceptInviteUserDto
  ): Promise<CommonResponseDto<undefined>> {
    return await this.userService.acceptInvite(acceptInviteUserDto, user);
  }
}
