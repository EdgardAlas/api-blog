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
import { CreateTagRequest } from 'src/features/tags/dto/requests/create-tag.request';
import { GetTagsQuery } from 'src/features/tags/dto/requests/get-tags.query';
import { UpdateTagRequest } from 'src/features/tags/dto/requests/update-tag.request';
import { CreateTagService } from 'src/features/tags/services/create-tag.service';
import { DeleteTagService } from 'src/features/tags/services/delete-tag.service';
import { GetTagService } from 'src/features/tags/services/get-tag.service';
import { GetTagsService } from 'src/features/tags/services/get-tags.service';
import { UpdateTagService } from 'src/features/tags/services/update-tag.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../auth/decorators/roles.decorator';

@Auth(Rol.ADMIN)
@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagService: CreateTagService,
    private readonly getTagsService: GetTagsService,
    private readonly getTagService: GetTagService,
    private readonly updateTagService: UpdateTagService,
    private readonly deleteTagService: DeleteTagService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTagRequest: CreateTagRequest) {
    return await this.createTagService.execute(createTagRequest);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetTagsQuery) {
    return await this.getTagsService.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getTagService.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagRequest: UpdateTagRequest,
  ) {
    return await this.updateTagService.execute({
      id,
      request: updateTagRequest,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteTagService.execute(id);
  }
}
