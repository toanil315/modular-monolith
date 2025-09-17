import { configDotenv } from 'dotenv';
import { SnakeNamingStrategy } from './naming-strategy';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

configDotenv();

export class DatabaseConfiguration {
  static get(moduleDirName: string): PostgresConnectionOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [moduleDirName + '/../**/*.entity.{ts,js}'],
      migrationsTableName: 'migrations',
      migrations: [moduleDirName + '/migrations/*.{ts,js}'],
      namingStrategy: new SnakeNamingStrategy(),
      migrationsRun: true,
    };
  }
}
