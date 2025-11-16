import { Module } from "@nestjs/common";
import { RoleRepository } from "./role.repository";

@Module({ providers: [RoleRepository], exports: [RoleRepository] })
export class RoleModule {}
