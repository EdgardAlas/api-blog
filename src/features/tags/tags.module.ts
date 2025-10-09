import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { CreateTagService } from 'src/features/tags/services/create-tag.service';
import { DeleteTagService } from 'src/features/tags/services/delete-tag.service';
import { GetTagService } from 'src/features/tags/services/get-tag.service';
import { GetTagsService } from 'src/features/tags/services/get-tags.service';
import { UpdateTagService } from 'src/features/tags/services/update-tag.service';
import { TagsController } from 'src/features/tags/tags.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [TagsController],
  providers: [
    CreateTagService,
    GetTagsService,
    GetTagService,
    UpdateTagService,
    DeleteTagService,
  ],
})
export class TagsModule {}
