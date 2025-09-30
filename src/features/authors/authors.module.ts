import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { AuthorsController } from './authors.controller';
import { CreateAuthorService } from './services/create-author.service';
import { DeleteAuthorService } from './services/delete-author.service';
import { GetAuthorService } from './services/get-author.service';
import { GetAuthorsService } from './services/get-authors.service';
import { UpdateAuthorService } from './services/update-author.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthorsController],
  providers: [
    CreateAuthorService,
    GetAuthorsService,
    GetAuthorService,
    UpdateAuthorService,
    DeleteAuthorService,
  ],
})
export class AuthorsModule {}
