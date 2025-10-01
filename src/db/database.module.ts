import { Module, Global, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnvModule } from 'src/env/env.module';
import { EnvsService } from 'src/env/services/envs.service';
import * as schema from 'src/db/schema';

export const DatabaseService = 'DATABASE';
export type Database = ReturnType<typeof drizzle<typeof schema>>;

function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
  });
  return drizzle({ client: pool, schema, logger: true });
}

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: DatabaseService,
      useFactory: (envsService: EnvsService): Database => {
        const logger = new Logger('DatabaseModule');
        logger.log('Creating database connection...');

        const connectionString = envsService.get('DATABASE_URL');

        logger.log('Database connection created.');
        return createDatabase(connectionString);
      },
      inject: [EnvsService],
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
