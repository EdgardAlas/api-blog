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
import { CreateLanguageRequest } from 'src/features/languages/dto/requests/create-language.request';
import { GetLanguagesQuery } from 'src/features/languages/dto/requests/get-languages.query';
import { UpdateLanguageRequest } from 'src/features/languages/dto/requests/update-language.request';
import { CreateLanguageService } from 'src/features/languages/services/create-language.service';
import { DeleteLanguageService } from 'src/features/languages/services/delete-language.service';
import { GetLanguageService } from 'src/features/languages/services/get-language.service';
import { GetLanguagesService } from 'src/features/languages/services/get-languages.service';
import { UpdateLanguageService } from 'src/features/languages/services/update-language.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Rol } from '../auth/decorators/roles.decorator';

@Auth(Rol.ADMIN)
@Controller('languages')
export class LanguagesController {
  constructor(
    private readonly createLanguageService: CreateLanguageService,
    private readonly getLanguagesService: GetLanguagesService,
    private readonly getLanguageService: GetLanguageService,
    private readonly updateLanguageService: UpdateLanguageService,
    private readonly deleteLanguageService: DeleteLanguageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLanguageRequest: CreateLanguageRequest) {
    return await this.createLanguageService.execute(createLanguageRequest);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: GetLanguagesQuery) {
    return await this.getLanguagesService.execute(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getLanguageService.execute(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLanguageRequest: UpdateLanguageRequest,
  ) {
    return await this.updateLanguageService.execute({
      id,
      updateLanguageRequest,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.deleteLanguageService.execute(id);
  }
}
