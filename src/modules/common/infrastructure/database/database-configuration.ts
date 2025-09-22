import { configDotenv } from 'dotenv';
import { SnakeNamingStrategy } from './naming-strategy';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

configDotenv();

export class DatabaseConfiguration {
  static get(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
    };
  }

  static getMigrationConfiguration(
    moduleDirName: string,
  ): Partial<TypeOrmModuleOptions> {
    return {
      entities: [moduleDirName + '/../**/*.entity.{ts,js}'],
      migrationsTableName: 'migrations',
      migrations: [moduleDirName + '/migrations/*.{ts,js}'],
    };
  }
}
