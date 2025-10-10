import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserRequest } from 'src/features/users/dto/requests/create-user.request';
import { GetUsersQuery } from 'src/features/users/dto/requests/get-users.query';
import { UpdateUserRequest } from 'src/features/users/dto/requests/update-user.request';
import { CreateUserService } from 'src/features/users/services/create-user.service';
import { DeleteUserService } from 'src/features/users/services/delete-user.service';
import { GetUserService } from 'src/features/users/services/get-user.service';
import { GetUsersService } from 'src/features/users/services/get-users.service';
import { UpdateUserService } from 'src/features/users/services/update-user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../auth/decorators/roles.decorator';

@Auth(Rol.ADMIN)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUsersService: GetUsersService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserRequest: CreateUserRequest) {
    return await this.createUserService.execute(createUserRequest);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetUsersQuery) {
    return await this.getUsersService.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserService.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return await this.updateUserService.execute({
      id,
      request: updateUserRequest,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUserService.execute(id);
  }
}
