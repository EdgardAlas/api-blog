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
import { CreateAuthorRequest } from 'src/features/authors/dto/requests/create-author.request';
import { GetAuthorsQuery } from 'src/features/authors/dto/requests/get-authors.query';
import { UpdateAuthorRequest } from 'src/features/authors/dto/requests/update-author.request';
import { CreateAuthorService } from 'src/features/authors/services/create-author.service';
import { DeleteAuthorService } from 'src/features/authors/services/delete-author.service';
import { GetAuthorService } from 'src/features/authors/services/get-author.service';
import { GetAuthorsService } from 'src/features/authors/services/get-authors.service';
import { UpdateAuthorService } from 'src/features/authors/services/update-author.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../auth/decorators/roles.decorator';

@Auth(Rol.ADMIN)
@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly createAuthorService: CreateAuthorService,
    private readonly getAuthorsService: GetAuthorsService,
    private readonly getAuthorService: GetAuthorService,
    private readonly updateAuthorService: UpdateAuthorService,
    private readonly deleteAuthorService: DeleteAuthorService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAuthorRequest: CreateAuthorRequest) {
    return await this.createAuthorService.execute(createAuthorRequest);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetAuthorsQuery) {
    return await this.getAuthorsService.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getAuthorService.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorRequest: UpdateAuthorRequest,
  ) {
    return await this.updateAuthorService.execute({
      id,
      request: updateAuthorRequest,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteAuthorService.execute(id);
  }
}
