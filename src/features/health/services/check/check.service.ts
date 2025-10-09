import { Injectable } from '@nestjs/common';
import { HealthResponse } from '../dto/responses/health.response';
import { BaseService } from 'src/shared/types/base-service';

@Injectable()
export class CheckService implements BaseService<HealthResponse> {
  execute() {
    return new HealthResponse('OK');
  }
}
