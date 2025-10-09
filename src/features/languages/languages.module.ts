import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { EnvModule } from 'src/env/env.module';
import { LanguagesController } from './languages.controller';
import { CreateLanguageService } from './services/create-language.service';
import { DeleteLanguageService } from './services/delete-language.service';
import { GetLanguageService } from './services/get-language.service';
import { GetLanguagesService } from './services/get-languages.service';
import { UpdateLanguageService } from './services/update-language.service';

@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [LanguagesController],
  providers: [
    CreateLanguageService,
    DeleteLanguageService,
    GetLanguageService,
    GetLanguagesService,
    UpdateLanguageService,
  ],
  exports: [],
})
export class LanguagesModule {}
