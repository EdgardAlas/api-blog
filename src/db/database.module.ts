import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnvModule } from '../env/env.module';
import { EnvsService } from '../env/services/envs.service';
import * as schema from './schema';

export const DatabaseService = 'DATABASE';
export type Database = ReturnType<typeof drizzle<typeof schema>>;

function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });
  return drizzle(pool, { schema });
}

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (envsService: EnvsService): Database => {
        const connectionString = envsService.get('DATABASE_URL');
        return createDatabase(connectionString);
      },
      inject: [EnvsService],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
