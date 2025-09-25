import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Envs } from 'src/env/envs';

@Injectable()
export class EnvsService {
  constructor(private configService: ConfigService<Envs>) {}

  get<T extends keyof Envs>(key: T) {
    return this.configService.get(key) as Envs[T];
  }
}
