import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { AuthorsController } from 'src/features/authors/authors.controller';
import { CreateAuthorService } from 'src/features/authors/services/create-author.service';
import { DeleteAuthorService } from 'src/features/authors/services/delete-author.service';
import { GetAuthorService } from 'src/features/authors/services/get-author.service';
import { GetAuthorsService } from 'src/features/authors/services/get-authors.service';
import { UpdateAuthorService } from 'src/features/authors/services/update-author.service';

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
