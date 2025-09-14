import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from '../../../common/infrastructure/database/naming-strategy';
import { configDotenv } from 'dotenv';

configDotenv();

export const EVENTS_CONNECTION_NAME = 'eventsConnection';
export const EVENTS_SCHEMA = 'events';

function buildEventsDataSourceOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    name: EVENTS_CONNECTION_NAME,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    namingStrategy: new SnakeNamingStrategy(),
    schema: EVENTS_SCHEMA,
    migrationsRun: true,
  };
}

const eventsDataSource = new DataSource(buildEventsDataSourceOptions());

export default eventsDataSource;
