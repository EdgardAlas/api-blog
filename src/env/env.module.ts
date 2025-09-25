import { Module } from '@nestjs/common';
import { EnvsService } from './services/envs.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EnvsService],
})
export class EnvModule {}
