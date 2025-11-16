import { UserEntity } from "../../../db/entities/user.entity";

export interface LoginResponseData {
  accessToken: string;
  user: UserEntity;
}
