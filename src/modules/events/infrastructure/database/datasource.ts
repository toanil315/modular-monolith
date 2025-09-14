import { DataSource } from 'typeorm';
import { DatabaseConfiguration } from 'src/modules/common/infrastructure/database/database-configuration';

export const EVENTS_CONNECTION_NAME = 'eventsConnection';
export const EVENTS_SCHEMA = 'events';

const eventsDataSource = new DataSource({
  ...DatabaseConfiguration.get(),
  name: EVENTS_CONNECTION_NAME,
  schema: EVENTS_SCHEMA,
});

export default eventsDataSource;
