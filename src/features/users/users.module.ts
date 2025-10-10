import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module';
import { UsersController } from './users.controller';
import { CreateUserService } from './services/create-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { GetUserService } from './services/get-user.service';
import { GetUsersService } from './services/get-users.service';
import { UpdateUserService } from './services/update-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    DeleteUserService,
    GetUserService,
    GetUsersService,
    UpdateUserService,
  ],
})
export class UsersModule {}
