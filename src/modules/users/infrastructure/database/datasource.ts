import { DataSource } from 'typeorm';
import { DatabaseConfiguration } from 'src/modules/common/infrastructure/database/database-configuration';

export const USERS_CONNECTION_NAME = 'usersConnection';
export const USERS_SCHEMA = 'users';

const usersDataSource = new DataSource({
  ...DatabaseConfiguration.get(__dirname),
  name: USERS_CONNECTION_NAME,
  schema: USERS_SCHEMA,
});

export default usersDataSource;
