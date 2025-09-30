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
import { IdResponse } from '../../shared/dto/id.response';
import { CreateAuthorRequest } from './dto/requests/create-author.request';
import { GetAuthorsQuery } from './dto/requests/get-authors.query';
import { UpdateAuthorRequest } from './dto/requests/update-author.request';
import { AuthorResponse } from './dto/responses/author.response';
import { GetAuthorsResponse } from './dto/responses/get-authors.response';
import { CreateAuthorService } from './services/create-author.service';
import { DeleteAuthorService } from './services/delete-author.service';
import { GetAuthorService } from './services/get-author.service';
import { GetAuthorsService } from './services/get-authors.service';
import { UpdateAuthorService } from './services/update-author.service';

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
  async create(
    @Body() createAuthorRequest: CreateAuthorRequest,
  ): Promise<IdResponse> {
    return await this.createAuthorService.execute(createAuthorRequest);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetAuthorsQuery): Promise<GetAuthorsResponse> {
    return await this.getAuthorsService.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AuthorResponse> {
    return await this.getAuthorService.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorRequest: UpdateAuthorRequest,
  ): Promise<IdResponse> {
    return await this.updateAuthorService.execute({
      id,
      request: updateAuthorRequest,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IdResponse> {
    return await this.deleteAuthorService.execute(id);
  }
}
