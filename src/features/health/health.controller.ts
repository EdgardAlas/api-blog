import { Controller, Get } from '@nestjs/common';
import { CheckService } from 'src/features/health/services/check/check.service';

@Controller('health')
export class HealthController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  check() {
    return this.checkService.execute();
  }
}
